import express from "express";
import pool from "../../db/postgres.js";
import slugify from "slugify";

const router = express.Router();
const duplicateWithPlanMessage = (fieldName) => `${fieldName} already exist with this plan`;
const sanitizeSlugForResponse = (slug) =>
  typeof slug === "string" ? slug.replace(/-\d+$/, "") : slug;
const buildPlanSlug = (title) =>
  slugify(title || "", { lower: true, strict: true, trim: true });
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// Plan 

router.post("/plans", async (req, res) => {
  // #swagger.tags = ['Plans']
  const client = await pool.connect();

  try {
    const {
      product_id,
      plan_name,
      title,
      description,
      including_ids = [],
      excluding_ids = []
    } = req.body;

    if (!plan_name || !title) {
      return res.status(400).json({
        success: false,
        message: "Plan name and title required"
      });
    }

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "product_id is required"
      });
    }

    const productCheck = await client.query(
      "SELECT id FROM products_table WHERE id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const existingPlan = await client.query(
      `SELECT id, plan_name
       FROM plans
       WHERE product_id = $1
         AND status = true
         AND LOWER(TRIM(plan_name)) = LOWER(TRIM($2))`,
      [product_id, plan_name]
    );

    if (existingPlan.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("plan_name")
      });
    }

    const slug = buildPlanSlug(title);

    await client.query("BEGIN");

    // ✅ 1. create plan
    const planResult = await client.query(
      `INSERT INTO plans
      (product_id, plan_name, title, slug, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [product_id, plan_name, title, slug, description]
    );

    const plan_id = planResult.rows[0].id;

    // ✅ 2. insert INCLUDING
    if (including_ids.length > 0) {
      const values = including_ids.map((_, i) => `($1,$${i + 2})`).join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [plan_id, ...including_ids]
      );
    }

    // ✅ 3. insert EXCLUDING
    if (excluding_ids.length > 0) {
      const values = excluding_ids.map((_, i) => `($1,$${i + 2})`).join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id)
         VALUES ${values}`,
        [plan_id, ...excluding_ids]
      );
    }

    // persist selected including/excluding point values for reliable read in getAllPlans
    const selectedPointIds = [...new Set([...(including_ids || []), ...(excluding_ids || [])])]
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    const selectedPointsMap = new Map();
    if (selectedPointIds.length > 0) {
      const selectedPointsRes = await client.query(
        `SELECT id, point_name, icon, description
         FROM plan_points
         WHERE id = ANY($1::int[])`,
        [selectedPointIds]
      );
      for (const row of selectedPointsRes.rows) {
        selectedPointsMap.set(Number(row.id), row);
      }
    }

    if (including_ids.length > 0) {
      for (const rawPointId of including_ids) {
        const pointId = Number(rawPointId);
        const point = selectedPointsMap.get(pointId);
        if (!point) continue;

        await client.query(
          `INSERT INTO plan_including (plan_id, point_name, icon, description)
           VALUES ($1,$2,$3,$4)`,
          [plan_id, point.point_name, point.icon || null, point.description || null]
        );
      }
    }

    if (excluding_ids.length > 0) {
      for (const rawPointId of excluding_ids) {
        const pointId = Number(rawPointId);
        const point = selectedPointsMap.get(pointId);
        if (!point) continue;

        await client.query(
          `INSERT INTO plan_excluding (plan_id, point_name, icon, description)
           VALUES ($1,$2,$3,$4)`,
          [plan_id, point.point_name, point.icon || null, point.description || null]
        );
      }
    }

    // normalize incoming rates
    const body = req.body || {};
    const ratesRaw = body.rates || body.Rates || body.rate || body.rate_list || body.rates_list || [];
    const rates = Array.isArray(ratesRaw) ? ratesRaw : [];

    console.log('POST /plans - incoming rates length:', Array.isArray(rates) ? rates.length : 0);
    const insertedRates = [];
    if (Array.isArray(rates) && rates.length > 0) {
      for (const r of rates) {
        const referencedRateId =
          r && typeof r === "object"
            ? Number(r.rate_id ?? r.id)
            : Number.NaN;

        // allow passing a numeric id (existing rate) or an object to insert
        if (
          typeof r === 'number' ||
          (typeof r === 'string' && /^\d+$/.test(r.trim())) ||
          (!Number.isNaN(referencedRateId) && referencedRateId > 0)
        ) {
          const rateId =
            !Number.isNaN(referencedRateId) && referencedRateId > 0
              ? referencedRateId
              : Number(r);
          const existingRate = await client.query(`SELECT * FROM plan_rates WHERE id = $1 LIMIT 1`, [rateId]);
          if (existingRate.rows.length > 0) {
            const existingRateRow = existingRate.rows[0];
            if (Number(existingRateRow.plan_id) === Number(plan_id)) {
              insertedRates.push(existingRateRow);
            } else {
              const duplicateForPlan = await client.query(
                `SELECT *
                 FROM plan_rates
                 WHERE plan_id = $1
                   AND LOWER(TRIM(tenure_type)) = LOWER(TRIM($2))
                 LIMIT 1`,
                [plan_id, existingRateRow.tenure_type]
              );

              if (duplicateForPlan.rows.length > 0) {
                insertedRates.push(duplicateForPlan.rows[0]);
              } else {
                const clonedRate = await client.query(
                  `INSERT INTO plan_rates
                   (plan_id, tenure_type, display_price, selling_price, is_discountable)
                   VALUES ($1,$2,$3,$4,$5)
                   RETURNING *`,
                  [
                    plan_id,
                    existingRateRow.tenure_type,
                    existingRateRow.display_price,
                    existingRateRow.selling_price,
                    existingRateRow.is_discountable
                  ]
                );
                insertedRates.push(clonedRate.rows[0]);
              }
            }
            continue;
          }
          // if numeric but not found, skip
          continue;
        }

        // treat as object to insert
        const tenure_type = (r.tenure_type || r.duration || r.duration_type || r.type || '').toString();
        const display_price = Number(r.display_price ?? r.price ?? r.displayPrice ?? 0);
        const selling_price = Number(r.selling_price ?? r.price ?? r.sellingPrice ?? display_price);
        const is_discountable = r.is_discountable !== undefined ? !!r.is_discountable : true;

        const rateRes = await client.query(
          `INSERT INTO plan_rates (plan_id, tenure_type, display_price, selling_price, is_discountable)
           VALUES ($1,$2,$3,$4,$5) RETURNING *`,
          [plan_id, tenure_type, display_price, selling_price, is_discountable]
        );
        insertedRates.push(rateRes.rows[0]);
      }
    }

    await client.query("COMMIT");

    // fetch mapping points (plan_point_mapping -> plan_points)
    const mappingRes = await client.query(
      `SELECT ppm.type, pp.id, pp.point_name, pp.icon, pp.description
   FROM plan_point_mapping ppm
   JOIN plan_points pp ON pp.id = ppm.point_id
   WHERE ppm.plan_id = $1`,
      [plan_id]
    );
    const mappingPoints = mappingRes.rows || [];

    // fetch explicit including / excluding points
    const includingRes = await client.query(
      `SELECT * FROM plan_including WHERE plan_id = $1 AND status = true ORDER BY id DESC`,
      [plan_id]
    );
    const excludingRes = await client.query(
      `SELECT * FROM plan_excluding WHERE plan_id = $1 AND status = true ORDER BY id DESC`,
      [plan_id]
    );

    // ensure we return all rates for this plan
    const ratesRes = await client.query(`SELECT * FROM plan_rates WHERE plan_id = $1 ORDER BY id DESC`, [plan_id]);

    const createdPlan = planResult.rows[0];

    // keep response ids separated exactly as include/exclude selections
    const normalizedIncludingIds = [...new Set((including_ids || [])
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id) && selectedPointsMap.has(id)))];
    const normalizedExcludingIds = [...new Set((excluding_ids || [])
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id) && selectedPointsMap.has(id)))];

    // merge insertedRates (which may include fetched existing rate rows) with DB rates for this plan
    const finalRates = Array.isArray(ratesRes.rows) ? [...ratesRes.rows] : [];
    for (const r of insertedRates) {
      if (r && r.id && !finalRates.find((fr) => fr.id === r.id)) finalRates.unshift(r);
    }

    const responseData = {
      ...createdPlan,
      slug: sanitizeSlugForResponse(createdPlan.slug),
      including_ids: normalizedIncludingIds,
      excluding_ids: normalizedExcludingIds,
      // return only rate ids in POST response
      rates: (finalRates || []).filter(r => r && r.id).map(r => r.id)
    };

    res.status(201).json({
      message: "Plan created with points",
      data: responseData
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  } finally {
    client.release();
  }
});

router.get("/plansByProduct/:product_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { product_id } = req.params;

    const productCheck = await pool.query(
      `SELECT id FROM products_table WHERE id = $1`,
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Product not found"
      });
    }

    const result = await pool.query(
      `SELECT * FROM plans WHERE product_id = $1 AND status = true ORDER BY id DESC LIMIT 1`,
      [product_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "No plan assigned to this product"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Assigned plan fetched successfully",
      data: {
        ...result.rows[0],
        slug: sanitizeSlugForResponse(result.rows[0].slug)
      }
    });

  } catch (error) {
    console.log("GET PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/getAllPlans", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT * FROM plans WHERE status = true ORDER BY id DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total FROM plans WHERE status = true`
      )
    ]);

    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // no plans
    if (result.rows.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No plans found",
        total,
        total_pages: totalPages,
        page,
        limit,
        has_next: page < totalPages,
        has_prev: page > 1,
        data: []
      });
    }

    const planIds = result.rows.map((p) => p.id);

    // plan_including / plan_excluding tables (explicit include/exclude points)
    const [includingRes, excludingRes] = await Promise.all([
      pool.query(
        `SELECT DISTINCT ON (pi.id)
           pi.id,
           pi.plan_id,
           p.title AS plan_title,
           pi.point_name,
           pi.icon,
           pi.description,
           pi.status,
           pi.created_at,
           pi.updated_at,
           pp.id AS point_id
         FROM plan_including pi
         JOIN plans p ON p.id = pi.plan_id
         LEFT JOIN plan_points pp
           ON LOWER(TRIM(pp.point_name)) = LOWER(TRIM(pi.point_name))
          AND COALESCE(pp.icon, '') = COALESCE(pi.icon, '')
          AND COALESCE(pp.description, '') = COALESCE(pi.description, '')
          AND pp.status = true
         WHERE pi.plan_id = ANY($1::int[]) AND pi.status = true
         ORDER BY pi.id, pp.id DESC`,
        [planIds]
      ),
      pool.query(
        `SELECT DISTINCT ON (pe.id)
           pe.id,
           pe.plan_id,
           p.title AS plan_title,
           pe.point_name,
           pe.icon,
           pe.description,
           pe.status,
           pe.created_at,
           pe.updated_at,
           pp.id AS point_id
         FROM plan_excluding pe
         JOIN plans p ON p.id = pe.plan_id
         LEFT JOIN plan_points pp
           ON LOWER(TRIM(pp.point_name)) = LOWER(TRIM(pe.point_name))
          AND COALESCE(pp.icon, '') = COALESCE(pe.icon, '')
          AND COALESCE(pp.description, '') = COALESCE(pe.description, '')
          AND pp.status = true
         WHERE pe.plan_id = ANY($1::int[]) AND pe.status = true
         ORDER BY pe.id, pp.id DESC`,
        [planIds]
      )
    ]);

    const includePointsMap = new Map();
    const excludePointsMap = new Map();
    const includeIdsMap = new Map();
    const excludeIdsMap = new Map();
    const toPlanKey = (value) => String(value);
    for (const pid of planIds) {
      const key = toPlanKey(pid);
      includePointsMap.set(key, []);
      excludePointsMap.set(key, []);
      includeIdsMap.set(key, []);
      excludeIdsMap.set(key, []);
    }
    for (const r of includingRes.rows) {
      const key = toPlanKey(r.plan_id);
      if (r.point_id !== null && r.point_id !== undefined) {
        const includeIds = includeIdsMap.get(key) || [];
        const numericPointId = Number(r.point_id);
        if (!includeIds.includes(numericPointId)) {
          includeIds.push(numericPointId);
          includeIdsMap.set(key, includeIds);
        }
      }
      includePointsMap.get(key)?.push({
        id: r.point_id ?? r.id,
        relation_id: r.id,
        plan_id: r.plan_id,
        plan_title: r.plan_title,
        point_name: r.point_name,
        icon: r.icon,
        description: r.description,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at
      });
    }
    for (const r of excludingRes.rows) {
      const key = toPlanKey(r.plan_id);
      if (r.point_id !== null && r.point_id !== undefined) {
        const excludeIds = excludeIdsMap.get(key) || [];
        const numericPointId = Number(r.point_id);
        if (!excludeIds.includes(numericPointId)) {
          excludeIds.push(numericPointId);
          excludeIdsMap.set(key, excludeIds);
        }
      }
      excludePointsMap.get(key)?.push({
        id: r.point_id ?? r.id,
        relation_id: r.id,
        plan_id: r.plan_id,
        plan_title: r.plan_title,
        point_name: r.point_name,
        icon: r.icon,
        description: r.description,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at
      });
    }

    // fetch rates
    const ratesRes = await pool.query(
      `SELECT * FROM plan_rates WHERE plan_id = ANY($1::int[]) ORDER BY id DESC`,
      [planIds]
    );

    const ratesMap = new Map();
    for (const pid of planIds) {
      ratesMap.set(toPlanKey(pid), []);
    }
    for (const r of ratesRes.rows) {
      const key = toPlanKey(r.plan_id);
      if (ratesMap.has(key)) ratesMap.get(key)?.push(r);
    }

    const shaped = result.rows.map((plan) => ({
      id: plan.id,
      product_id: plan.product_id,
      plan_name: plan.plan_name,
      title: plan.title,
      slug: sanitizeSlugForResponse(plan.slug),
      description: plan.description,
      including_ids: includeIdsMap.get(toPlanKey(plan.id)) || [],
      excluding_ids: excludeIdsMap.get(toPlanKey(plan.id)) || [],
      including_points: includePointsMap.get(toPlanKey(plan.id)) || [],
      excluding_points: excludePointsMap.get(toPlanKey(plan.id)) || [],
      rates: (ratesMap.get(toPlanKey(plan.id)) || []).map((rate) => rate.id),
      status: plan.status,
      created_at: plan.created_at,
      updated_at: plan.updated_at
    }));

    return res.status(200).json({
      status: "success",
      message: shaped.length ? "Plans fetched successfully" : "No plans found",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: shaped
    });

  } catch (error) {
    console.log("GET ALL PLANS ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

// router.get("/getAllPlans", async (req, res) => {
//   try {
//     const { page, limit, offset } = parsePagination(req.query);

//     const [result, totalResult] = await Promise.all([
//       pool.query(
//         `SELECT * FROM plans 
//          WHERE status = true 
//          ORDER BY id DESC 
//          LIMIT $1 OFFSET $2`,
//         [limit, offset]
//       ),
//       pool.query(`SELECT COUNT(*) AS total FROM plans WHERE status = true`)
//     ]);

//     const total = Number(totalResult.rows[0]?.total || 0);
//     const totalPages = Math.max(1, Math.ceil(total / limit));

//     if (result.rows.length === 0) {
//       return res.json({
//         success: true,
//         message: "No plans found",
//         total,
//         total_pages: totalPages,
//         page,
//         limit,
//         has_next: page < totalPages,
//         has_prev: page > 1,
//         data: []
//       });
//     }

//     const planIds = result.rows.map((p) => p.id);

//     // ✅ FIXED: include/exclude from single table
//     const mappingRes = await pool.query(
//       `SELECT plan_id, point_id, type
//        FROM plan_point_mapping
//        WHERE plan_id = ANY($1::int[])`,
//       [planIds]
//     );

//     const pointsMap = new Map();
//     for (const pid of planIds) {
//       pointsMap.set(pid, {
//         including_points: [],
//         excluding_points: []
//       });
//     }

//     for (const r of mappingRes.rows) {
//       if (r.type === "include") {
//         pointsMap.get(r.plan_id).including_points.push(r.point_id);
//       } else if (r.type === "exclude") {
//         pointsMap.get(r.plan_id).excluding_points.push(r.point_id);
//       }
//     }

//     // ✅ FIXED: rates with master join
//     const ratesRes = await pool.query(
//       `SELECT 
//          pr.plan_id,
//          r.id AS rate_id,
//          r.tenure_type,
//          r.display_price,
//          r.selling_price,
//          r.is_discountable
//        FROM plan_rates pr
//        JOIN rates r ON r.id = pr.rate_id
//        WHERE pr.plan_id = ANY($1::int[])`,
//       [planIds]
//     );

//     const ratesMap = new Map();
//     for (const pid of planIds) ratesMap.set(pid, []);

//     for (const r of ratesRes.rows) {
//       ratesMap.get(r.plan_id).push({
//         rate_id: r.rate_id,
//         tenure_type: r.tenure_type,
//         display_price: r.display_price,
//         selling_price: r.selling_price,
//         is_discountable: r.is_discountable
//       });
//     }

//     // ✅ promo codes (same)
//     const promoRes = await pool.query(
//       `SELECT * FROM promo_codes 
//        WHERE plan_id = ANY($1::int[]) 
//        ORDER BY id DESC`,
//       [planIds]
//     );

//     const promoMap = new Map();
//     for (const pid of planIds) promoMap.set(pid, []);

//     for (const p of promoRes.rows) {
//       promoMap.get(p.plan_id).push(p);
//     }

//     // ✅ final response
//     const shaped = result.rows.map((plan) => ({
//       id: plan.id,
//       product_id: plan.product_id,
//       plan_name: plan.plan_name,
//       title: plan.title,
//       slug: plan.slug,
//       description: plan.description,

//       including_points: pointsMap.get(plan.id)?.including_points || [],
//       excluding_points: pointsMap.get(plan.id)?.excluding_points || [],

//       rates: ratesMap.get(plan.id) || [],
//       promo_codes: promoMap.get(plan.id) || [],

//       status: plan.status,
//       created_at: plan.created_at,
//       updated_at: plan.updated_at
//     }));

//     return res.json({
//       success: true,
//       message: "Plans fetched successfully",
//       total,
//       total_pages: totalPages,
//       page,
//       limit,
//       has_next: page < totalPages,
//       has_prev: page > 1,
//       data: shaped
//     });

//   } catch (error) {
//     console.log("GET ALL PLANS ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

router.put("/plans/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      product_id,
      plan_name,
      title,
      description,
      including_ids = [],
      excluding_ids = []
    } = req.body;

    // 🔍 check existing
    const existingPlan = await client.query(
      `SELECT * FROM plans WHERE id = $1`,
      [id]
    );

    if (existingPlan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    const oldPlan = existingPlan.rows[0];

    // slug update only if title changed
    let slug = oldPlan.slug;
    if (title && title !== oldPlan.title) {
      slug = buildPlanSlug(title);
    }

    await client.query("BEGIN");

    // ✅ 1. update plan
    const updatedPlan = await client.query(
      `UPDATE plans
       SET product_id = $1,
           plan_name = $2,
           title = $3,
           slug = $4,
           description = $5
       WHERE id = $6
       RETURNING *`,
      [
        product_id || oldPlan.product_id,
        plan_name || oldPlan.plan_name,
        title || oldPlan.title,
        slug,
        description || oldPlan.description,
        id
      ]
    );

    // ✅ 2. delete old mappings
    await client.query(
      `DELETE FROM plan_point_mapping WHERE plan_id = $1`,
      [id]
    );

    // ✅ 3. insert INCLUDING
    // if (including_ids.length > 0) {
    //   const values = including_ids
    //     .map((_, i) => `($1,$${i + 2})`)
    //     .join(",");

    //   await client.query(
    //     `INSERT INTO plan_point_mapping (plan_id, point_id)
    //      VALUES ${values}`,
    //     [id, ...including_ids]
    //   );
    // }

    // // ✅ 4. insert EXCLUDING
    // if (excluding_ids.length > 0) {
    //   const values = excluding_ids
    //     .map((_, i) => `($1,$${i + 2})`)
    //     .join(",");

    //   await client.query(
    //     `INSERT INTO plan_point_mapping (plan_id, point_id)
    //      VALUES ${values}`,
    //     [id, ...excluding_ids]
    //   );
    // }

    if (including_ids.length > 0) {
      const values = including_ids
        .map((_, i) => `($1,$${i + 2},'include')`)
        .join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id, type)
     VALUES ${values}`,
        [plan_id, ...including_ids]
      );
    }
    if (excluding_ids.length > 0) {
      const values = excluding_ids
        .map((_, i) => `($1,$${i + 2},'exclude')`)
        .join(",");

      await client.query(
        `INSERT INTO plan_point_mapping (plan_id, point_id, type)
     VALUES ${values}`,
        [plan_id, ...excluding_ids]
      );
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "Plan updated with points",
      data: updatedPlan.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.log("UPDATE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    client.release();
  }
});

router.patch("/plans/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    // Check plan exists
    const plan = await pool.query(
      `SELECT * FROM plans WHERE id = $1`,
      [id]
    );

    if (plan.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // Update status to false
    const result = await pool.query(
      `UPDATE plans
       SET status = false
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.status(200).json({
      message: "Plan deactivated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("DEACTIVATE PLAN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// Plan points


router.post("/planPoints", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { point_name, icon, description } = req.body;

    if (!point_name) {
      return res.status(400).json({
        success: false,
        message: "Point name is required"
      });
    }

    const normalizedPointName = point_name.toString().trim();

    const duplicateCheck = await pool.query(
      `SELECT id
       FROM plan_points
       WHERE status = true
         AND LOWER(TRIM(point_name)) = LOWER(TRIM($1))
       LIMIT 1`,
      [normalizedPointName]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: "plan points already exists"
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_points (point_name, icon, description)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [normalizedPointName, icon, description]
    );

    res.status(201).json({
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/assignPointsToPlan", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id, point_ids } = req.body;

    if (!plan_id || !Array.isArray(point_ids)) {
      return res.status(400).json({
        success: false,
        message: "plan_id and point_ids are required"
      });
    }

    // transaction start
    await pool.query("BEGIN");

    // old mapping delete (update case)
    await pool.query(
      `DELETE FROM plan_point_mapping WHERE plan_id = $1`,
      [plan_id]
    );

    // bulk insert (fast 🔥)
    const values = point_ids.map((point_id, i) =>
      `($1, $${i + 2})`
    ).join(",");

    await pool.query(
      `INSERT INTO plan_point_mapping (plan_id, point_id)
       VALUES ${values}`,
      [plan_id, ...point_ids]
    );

    await pool.query("COMMIT");

    res.status(200).json({
      message: "Points assigned successfully"
    });

  } catch (error) {
    await pool.query("ROLLBACK");

    console.log("ASSIGN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/getAllplanPoints", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT id, point_name
         FROM plan_points
         WHERE status = true
         ORDER BY id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total FROM plan_points WHERE status = true`
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.status(200).json({
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET POINT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/planPoints/:plan_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT pp.id, pp.point_name, pp.icon, pp.description
         FROM plan_point_mapping ppm
         JOIN plan_points pp ON pp.id = ppm.point_id
         WHERE ppm.plan_id = $1
         ORDER BY pp.id DESC
         LIMIT $2 OFFSET $3`,
        [plan_id, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_point_mapping ppm
         JOIN plan_points pp ON pp.id = ppm.point_id
         WHERE ppm.plan_id = $1`,
        [plan_id]
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.status(200).json({
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Plan including

router.post("/planIncluding", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id, point_name, icon, description } = req.body;

    if (!plan_id || !point_name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "plan_id and point_name are required"
      });
    }

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1 AND status = true`,
      [plan_id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const duplicateCheck = await pool.query(
      `SELECT id
       FROM plan_including
       WHERE plan_id = $1
         AND status = true
         AND LOWER(TRIM(point_name)) = LOWER(TRIM($2))
       LIMIT 1`,
      [plan_id, point_name]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("point_name")
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_including (plan_id, point_name, icon, description)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [plan_id, point_name, icon || null, description || null]
    );

    return res.status(201).json({
      status: "success",
      message: "Plan including added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("CREATE PLAN INCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/getAllIncludingPlan", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
      `SELECT
          pi.id,
          pi.plan_id,
          pi.point_name,
          pi.icon,
          pi.description,
          pi.created_at,
          pi.updated_at
       FROM plan_including pi
       JOIN plans p ON p.id = pi.plan_id
       WHERE pi.status = true
       ORDER BY pi.id DESC
       LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_including pi
         WHERE pi.status = true`
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length
        ? "All including points fetched successfully"
        : "No including points found",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ALL PLAN INCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/planIncluding/:plan_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1 AND status = true`,
      [plan_id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const [result, totalResult] = await Promise.all([
      pool.query(
      `SELECT id, plan_id, point_name, icon, description, created_at, updated_at
       FROM plan_including
       WHERE plan_id = $1
         AND status = true
         ORDER BY id DESC
         LIMIT $2 OFFSET $3`,
        [plan_id, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_including
         WHERE plan_id = $1
           AND status = true`,
        [plan_id]
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length
        ? "Plan including fetched successfully"
        : "No including points found for this plan",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET PLAN INCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/planIncluding/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;
    const { plan_id, point_name, icon, description } = req.body;

    const pointCheck = await pool.query(
      `SELECT * FROM plan_including WHERE id = $1 AND status = true`,
      [id]
    );

    if (pointCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Including point not found"
      });
    }

    if (!point_name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "point_name is required"
      });
    }

    if (plan_id) {
      const planCheck = await pool.query(
        `SELECT id FROM plans WHERE id = $1 AND status = true`,
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          status: "warning",
          message: "Plan not found"
        });
      }
    }

    const existingPoint = pointCheck.rows[0];
    const nextPlanId = plan_id || existingPoint.plan_id;
    const nextPointName = point_name || existingPoint.point_name;

    const duplicateCheck = await pool.query(
      `SELECT id
       FROM plan_including
       WHERE plan_id = $1
         AND status = true
         AND LOWER(TRIM(point_name)) = LOWER(TRIM($2))
         AND id != $3
       LIMIT 1`,
      [nextPlanId, nextPointName, id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("point_name")
      });
    }

    const updatedPoint = await pool.query(
      `UPDATE plan_including
       SET plan_id = COALESCE($1, plan_id),
           point_name = $2,
           icon = $3,
           description = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [plan_id || null, point_name, icon || null, description || null, id]
    );

    return res.status(200).json({
      status: "success",
      message: "Plan including updated successfully",
      data: updatedPoint.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PLAN INCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/planIncludingToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const pointCheck = await pool.query(
      `SELECT id FROM plan_including WHERE id = $1`,
      [id]
    );

    if (pointCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Including point not found"
      });
    }

    const result = await pool.query(
      `UPDATE plan_including
       SET status = NOT status,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      status: "success",
      message: "Plan including status toggled successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PLAN INCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

// Plan excluding

router.post("/planExcluding", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id, point_name, icon, description } = req.body;

    if (!plan_id || !point_name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "plan_id and point_name are required"
      });
    }

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1 AND status = true`,
      [plan_id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const duplicateCheck = await pool.query(
      `SELECT id
       FROM plan_excluding
       WHERE plan_id = $1
         AND status = true
         AND LOWER(TRIM(point_name)) = LOWER(TRIM($2))
       LIMIT 1`,
      [plan_id, point_name]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("point_name")
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_excluding (plan_id, point_name, icon, description)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [plan_id, point_name, icon || null, description || null]
    );

    return res.status(201).json({
      status: "success",
      message: "Plan excluding added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("CREATE PLAN EXCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/getAllExcludingPlan", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT
          pe.id,
          pe.plan_id,
          p.title AS plan_title,
          pe.point_name,
          pe.icon,
          pe.description,
          pe.status,
          pe.created_at,
          pe.updated_at
       FROM plan_excluding pe
       JOIN plans p ON p.id = pe.plan_id
       WHERE pe.status = true
       ORDER BY pe.id DESC
       LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_excluding pe
         WHERE pe.status = true`
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length
        ? "All excluding points fetched successfully"
        : "No excluding points found",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ALL PLAN EXCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/planExcluding/:plan_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1 AND status = true`,
      [plan_id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT id, plan_id, point_name, icon, description, status, created_at, updated_at
         FROM plan_excluding
         WHERE plan_id = $1
           AND status = true
         ORDER BY id DESC
         LIMIT $2 OFFSET $3`,
        [plan_id, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_excluding
         WHERE plan_id = $1
           AND status = true`,
        [plan_id]
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length
        ? "Plan excluding fetched successfully"
        : "No excluding points found for this plan",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET PLAN EXCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/planExcluding/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;
    const { plan_id, point_name, icon, description } = req.body;

    const pointCheck = await pool.query(
      `SELECT * FROM plan_excluding WHERE id = $1 AND status = true`,
      [id]
    );

    if (pointCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Excluding point not found"
      });
    }

    if (!point_name) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "point_name is required"
      });
    }

    if (plan_id) {
      const planCheck = await pool.query(
        `SELECT id FROM plans WHERE id = $1 AND status = true`,
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          status: "warning",
          message: "Plan not found"
        });
      }
    }

    const existingPoint = pointCheck.rows[0];
    const nextPlanId = plan_id || existingPoint.plan_id;
    const nextPointName = point_name || existingPoint.point_name;

    const duplicateCheck = await pool.query(
      `SELECT id
       FROM plan_excluding
       WHERE plan_id = $1
         AND status = true
         AND LOWER(TRIM(point_name)) = LOWER(TRIM($2))
         AND id != $3
       LIMIT 1`,
      [nextPlanId, nextPointName, id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("point_name")
      });
    }

    const updatedPoint = await pool.query(
      `UPDATE plan_excluding
       SET plan_id = COALESCE($1, plan_id),
           point_name = $2,
           icon = $3,
           description = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [plan_id || null, point_name, icon || null, description || null, id]
    );

    return res.status(200).json({
      status: "success",
      message: "Plan excluding updated successfully",
      data: updatedPoint.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PLAN EXCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/planExcludingToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const pointCheck = await pool.query(
      `SELECT id FROM plan_excluding WHERE id = $1`,
      [id]
    );

    if (pointCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Excluding point not found"
      });
    }

    const result = await pool.query(
      `UPDATE plan_excluding
       SET status = NOT status,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      status: "success",
      message: "Plan excluding status toggled successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PLAN EXCLUDING ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});


// Promo code

router.post("/promoCode", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const {
      plan_id,
      promo_code,
      unit_type,
      unit_value,
      valid_from,
      valid_to,
      usage_limit = 1
    } = req.body;

    const parsedPlanId = Number(plan_id);
    const parsedUnitValue = Number(unit_value);
    const parsedUsageLimit = usage_limit === undefined ? 1 : Number(usage_limit);
    const normalizedPromoCode = promo_code?.trim();
    const normalizedUnitType = unit_type?.trim();

    if (!parsedPlanId || !normalizedPromoCode || !normalizedUnitType || Number.isNaN(parsedUnitValue)) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "plan_id, promo_code, unit_type and unit_value are required"
      });
    }

    if (Number.isNaN(parsedUsageLimit) || parsedUsageLimit <= 0) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "usage_limit must be a valid number greater than 0"
      });
    }

    if (valid_from && Number.isNaN(Date.parse(valid_from))) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "valid_from must be a valid date"
      });
    }

    if (valid_to && Number.isNaN(Date.parse(valid_to))) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "valid_to must be a valid date"
      });
    }

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1`,
      [parsedPlanId]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const duplicatePromoCheck = await pool.query(
      `SELECT id
       FROM promo_codes
       WHERE LOWER(TRIM(promo_code)) = LOWER(TRIM($1))
         AND plan_id = $2
       LIMIT 1`,
      [normalizedPromoCode, parsedPlanId]
    );

    if (duplicatePromoCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: "Promo code already exist"
      });
    }

    const result = await pool.query(
      `INSERT INTO promo_codes
        (plan_id, promo_code, unit_type, unit_value, valid_from, valid_to, usage_limit)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *`,
      [
        parsedPlanId,
        normalizedPromoCode,
        normalizedUnitType,
        parsedUnitValue,
        valid_from || null,
        valid_to || null,
        parsedUsageLimit
      ]
    );

    res.status(201).json({
      status: "success",
      message: "Promo code created",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/getAllPromoCode", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT * FROM promo_codes ORDER BY id DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*) AS total FROM promo_codes`)
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length ? "Promo codes fetched successfully" : "No promo codes found",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ALL PROMO CODE ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.get("/promoCode/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM promo_codes WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Promo code not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Promo code details fetched successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("GET PROMO CODE DETAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/promoCode/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const {
      plan_id,
      promo_code,
      unit_type,
      unit_value,
      valid_from,
      valid_to,
      usage_limit,
      is_active
    } = req.body;

    let normalizedIsActive;
    if (is_active !== undefined) {
      if (typeof is_active === "boolean") {
        normalizedIsActive = is_active;
      } else if (typeof is_active === "string") {
        const lowered = is_active.trim().toLowerCase();
        if (lowered === "true" || lowered === "1") normalizedIsActive = true;
        else if (lowered === "false" || lowered === "0") normalizedIsActive = false;
      } else if (typeof is_active === "number") {
        if (is_active === 1) normalizedIsActive = true;
        else if (is_active === 0) normalizedIsActive = false;
      }

      if (normalizedIsActive === undefined) {
        return res.status(400).json({
          success: false,
          status: "warning",
          message: "is_active must be true/false (or 1/0)"
        });
      }
    }

    // 1️⃣ Check promo exists
    const existingPromo = await pool.query(
      "SELECT * FROM promo_codes WHERE id = $1",
      [id]
    );

    if (existingPromo.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found"
      });
    }

    // 2️⃣ Optional: validate plan_id
    if (plan_id) {
      const planCheck = await pool.query(
        "SELECT id FROM plans WHERE id = $1",
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan_id"
        });
      }
    }

    // 3️⃣ Update query (COALESCE use for partial update)
    const result = await pool.query(
      `UPDATE promo_codes SET
        plan_id = COALESCE($1, plan_id),
        promo_code = COALESCE($2, promo_code),
        unit_type = COALESCE($3, unit_type),
        unit_value = COALESCE($4, unit_value),
        valid_from = COALESCE($5, valid_from),
        valid_to = COALESCE($6, valid_to),
        usage_limit = COALESCE($7, usage_limit),
        is_active = COALESCE($8, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *`,
      [
        plan_id,
        promo_code,
        unit_type,
        unit_value,
        valid_from,
        valid_to,
        usage_limit,
        normalizedIsActive,
        id
      ]
    );

    res.json({
      message: "Promo code updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PROMO ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/promoCodeToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const check = await pool.query(
      `SELECT id FROM promo_codes WHERE id = $1`,
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Promo code not found"
      });
    }

    const result = await pool.query(
      `UPDATE promo_codes
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      status: "success",
      message: "Promo status toggled successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PROMO ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});


// Plan rates

router.post("/planRate", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const {
      plan_id,
      tenure_type,
      display_price,
      selling_price,
      is_discountable = true
    } = req.body;

    if (
      plan_id === undefined ||
      plan_id === null ||
      !tenure_type ||
      display_price === undefined ||
      display_price === null ||
      selling_price === undefined ||
      selling_price === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const parsedPlanId = Number(plan_id);
    const parsedDisplayPrice = Number(display_price);
    const parsedSellingPrice = Number(selling_price);
    const normalizedTenureType = tenure_type?.toString().trim().toLowerCase();

    if (
      Number.isNaN(parsedPlanId) ||
      Number.isNaN(parsedDisplayPrice) ||
      Number.isNaN(parsedSellingPrice)
    ) {
      return res.status(400).json({
        success: false,
        status: "warning",
        message: "plan_id, display_price and selling_price must be valid numbers"
      });
    }

    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1 AND status = true`,
      [parsedPlanId]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found for given plan_id"
      });
    }

    const duplicateRateCheck = await pool.query(
      `SELECT id
       FROM plan_rates
       WHERE plan_id = $1
         AND LOWER(TRIM(tenure_type)) = $2
         AND is_active = true
       LIMIT 1`,
      [parsedPlanId, normalizedTenureType]
    );

    if (duplicateRateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("tenure_type")
      });
    }

    const result = await pool.query(
      `INSERT INTO plan_rates
      (plan_id, tenure_type, display_price, selling_price, is_discountable)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [parsedPlanId, tenure_type, parsedDisplayPrice, parsedSellingPrice, is_discountable]
    );

    res.status(201).json({
      message: "Plan rate added successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/getAllPlanRate", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT * FROM plan_rates ORDER BY id DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*) AS total FROM plan_rates`)
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length ? "Plan rates fetched successfully" : "No plan rates found",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET ALL PLAN RATES ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

router.put("/planRate/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const {
      plan_id,
      tenure_type,
      display_price,
      selling_price,
      is_discountable
    } = req.body;

    // 1️⃣ Check rate exists
    const rateCheck = await pool.query(
      "SELECT * FROM plan_rates WHERE id = $1",
      [id]
    );

    if (rateCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Plan rate not found"
      });
    }

    const existingRate = rateCheck.rows[0];
    const nextPlanId = plan_id || existingRate.plan_id;
    const nextTenureType = (tenure_type || existingRate.tenure_type)
      ?.toString()
      .trim()
      .toLowerCase();

    // 2️⃣ Optional: validate plan_id
    if (plan_id) {
      const planCheck = await pool.query(
        "SELECT id FROM plans WHERE id = $1",
        [plan_id]
      );

      if (planCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid plan_id"
        });
      }
    }

    const duplicateRateCheck = await pool.query(
      `SELECT id
       FROM plan_rates
       WHERE plan_id = $1
         AND LOWER(TRIM(tenure_type)) = $2
         AND is_active = true
         AND id != $3
       LIMIT 1`,
      [nextPlanId, nextTenureType, id]
    );

    if (duplicateRateCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        status: "warning",
        message: duplicateWithPlanMessage("tenure_type")
      });
    }

    // 3️⃣ Update
    const result = await pool.query(
      `UPDATE plan_rates SET
        plan_id = COALESCE($1, plan_id),
        tenure_type = COALESCE($2, tenure_type),
        display_price = COALESCE($3, display_price),
        selling_price = COALESCE($4, selling_price),
        is_discountable = COALESCE($5, is_discountable),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [
        plan_id,
        tenure_type,
        display_price,
        selling_price,
        is_discountable,
        id
      ]
    );

    res.json({
      message: "Plan rate updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("UPDATE PLAN RATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/planRateToggle/:id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT id FROM plan_rates WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan rate not found"
      });
    }

    const result = await pool.query(
      `UPDATE plan_rates
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    return res.status(200).json({
      status: "success",
      message: "Plan rate status toggled successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("TOGGLE PLAN RATE ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});
// Get all active plan rates for a given plan_id
router.get("/planRates/:plan_id", async (req, res) => {
  // #swagger.tags = ['Plans']
  try {
    const { plan_id } = req.params;
    const { page, limit, offset } = parsePagination(req.query);

    // optional: verify plan exists
    const planCheck = await pool.query(
      `SELECT id FROM plans WHERE id = $1`,
      [plan_id]
    );

    if (planCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: "warning",
        message: "Plan not found"
      });
    }

    const [result, totalResult] = await Promise.all([
      pool.query(
        `SELECT *
         FROM plan_rates
         WHERE plan_id = $1 AND is_active = true
         ORDER BY id DESC
         LIMIT $2 OFFSET $3`,
        [plan_id, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) AS total
         FROM plan_rates
         WHERE plan_id = $1 AND is_active = true`,
        [plan_id]
      )
    ]);
    const total = Number(totalResult.rows[0]?.total || 0);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return res.status(200).json({
      status: "success",
      message: result.rows.length ? "Plan rates fetched successfully" : "No active rates found for this plan",
      total,
      total_pages: totalPages,
      page,
      limit,
      has_next: page < totalPages,
      has_prev: page > 1,
      data: result.rows
    });

  } catch (error) {
    console.log("GET PLAN RATES ERROR:", error);
    return res.status(500).json({
      success: false,
      status: "error",
      message: error.message
    });
  }
});

// Get all plan rates




// // Promo code 

// router.post("/applyPromo", async (req, res) => {
// #swagger.tags = ['Plans']
//   try {
//     const { plan_id, promo_code, price } = req.body;

//     if (!plan_id || !promo_code || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "plan_id, promo_code, price required"
//       });
//     }

//     // 1️⃣ Get promo
//     const promoResult = await pool.query(
//       `SELECT * FROM promo_codes 
//        WHERE promo_code = $1 AND plan_id = $2`,
//       [promo_code, plan_id]
//     );

//     if (promoResult.rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Invalid promo code"
//       });
//     }

//     const promo = promoResult.rows[0];

//     // 2️⃣ Check active
//     if (!promo.is_active) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo code inactive"
//       });
//     }

//     const now = new Date();

//     // 3️⃣ Check expiry
//     if (promo.valid_from && now < promo.valid_from) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo not started yet"
//       });
//     }

//     if (promo.valid_to && now > promo.valid_to) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo expired"
//       });
//     }

//     // 4️⃣ Usage limit
//     if (promo.used_count >= promo.usage_limit) {
//       return res.status(400).json({
//         success: false,
//         message: "Promo usage limit exceeded"
//       });
//     }

//     // 5️⃣ Calculate discount
//     let discount = 0;

//     if (promo.unit_type === "percentage") {
//       discount = price * (promo.unit_value / 100);
//     } else {
//       discount = promo.unit_value;
//     }

//     let final_price = price - discount;

//     if (final_price < 0) final_price = 0;

//     res.json({
//       success: true,
//       message: "Promo applied successfully",
//       data: {
//         original_price: price,
//         discount,
//         final_price
//       }
//     });

//   } catch (error) {
//     console.log("APPLY PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

// router.post("/consumePromo", async (req, res) => {
// #swagger.tags = ['Plans']
//   try {
//     const { promo_code } = req.body;

//     await pool.query(
//       `UPDATE promo_codes
//        SET used_count = used_count + 1
//        WHERE promo_code = $1`,
//       [promo_code]
//     );

//     res.json({
//       success: true,
//       message: "Promo usage updated"
//     });

//   } catch (error) {
//     console.log("CONSUME PROMO ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });



export default router;


