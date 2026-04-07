import express from "express";
import pool from "../../db/postgres.js";
import crypto from "crypto";

const router = express.Router();

const ensurePaymentTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payment_orders (
      id BIGSERIAL PRIMARY KEY,
      order_id VARCHAR(80) UNIQUE NOT NULL,
      client_id BIGINT NOT NULL,
      plan_rate_id BIGINT NOT NULL,
      amount NUMERIC(12,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      payment_method VARCHAR(20),
      payment_provider VARCHAR(30) NOT NULL DEFAULT 'manual',
      provider_order_id VARCHAR(120),
      provider_payment_id VARCHAR(120),
      provider_signature TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'initiated',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      paid_at TIMESTAMPTZ,
      failed_at TIMESTAMPTZ
    )
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_payment_orders_client_id ON payment_orders(client_id)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status)`);

  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS plan_id BIGINT`);
  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS product_id BIGINT`);
  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS client_name VARCHAR(255)`);
  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS plan_name VARCHAR(255)`);
  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`);
  await pool.query(`ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS tenure_type VARCHAR(50)`);
};

const fetchCheckoutReference = async (clientDb, clientId, planRateId) => {
  const result = await clientDb.query(
    `SELECT
       c.id AS client_id,
       c.company_name AS client_name,
       pr.id AS plan_rate_id,
       pr.tenure_type,
       pr.is_discountable,
       pr.selling_price,
       p.id AS plan_id,
       p.title AS plan_name,
       p.product_id,
       pt.product_name
     FROM clients c
     JOIN plan_rates pr ON pr.id = $2 AND pr.is_active = true
     JOIN plans p ON p.id = pr.plan_id AND p.status = true
     JOIN products_table pt ON pt.id = p.product_id
     WHERE c.id = $1
       AND c.is_active = true`,
    [clientId, planRateId]
  );

  if (result.rows.length === 0) {
    return {
      ok: false,
      status: 404,
      message: "Client or active plan rate not found"
    };
  }

  return { ok: true, detail: result.rows[0] };
};

router.post("/create-checkout", async (req, res) => {
  // #swagger.tags = ['Subscriptions']
  const clientDb = await pool.connect();

  try {
    await ensurePaymentTables();

    const {
      client_id,
      plan_rate_id,
      payment_method
    } = req.body;

    const parsedClientId = Number(client_id);
    const parsedPlanRateId = Number(plan_rate_id);

    if (!parsedClientId || !parsedPlanRateId) {
      return res.status(400).json({
        message: "client_id and plan_rate_id are required"
      });
    }

    if (payment_method && !["upi", "card", "netbanking", "wallet"].includes(payment_method)) {
      return res.status(400).json({
        message: "payment_method must be one of upi/card/netbanking/wallet"
      });
    }

    const reference = await fetchCheckoutReference(clientDb, parsedClientId, parsedPlanRateId);

    if (!reference.ok) {
      return res.status(reference.status).json({
        message: reference.message
      });
    }

    const detail = reference.detail;

    const amount = Number(detail.selling_price);
    const orderId = `ord_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const orderResult = await clientDb.query(
      `INSERT INTO payment_orders
       (order_id, client_id, plan_rate_id, plan_id, product_id, amount, payment_method, status,
        client_name, plan_name, product_name, tenure_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        orderId,
        parsedClientId,
        parsedPlanRateId,
        detail.plan_id,
        detail.product_id,
        amount,
        payment_method || null,
        "initiated",
        detail.client_name,
        detail.plan_name,
        detail.product_name,
        detail.tenure_type
      ]
    );

    return res.status(201).json({
      message: "Checkout created. Redirect user to payment page.",
      data: {
        order_id: orderResult.rows[0].order_id,
        client_id: detail.client_id,
        client_name: detail.client_name,
        product_id: detail.product_id,
        product_name: detail.product_name,
        plan_id: detail.plan_id,
        plan_name: detail.plan_name,
        plan_rate_id: detail.plan_rate_id,
        tenure_type: detail.tenure_type,
        is_discountable: detail.is_discountable,
        amount: orderResult.rows[0].amount,
        currency: orderResult.rows[0].currency,
        payment_methods: ["upi", "card"],
        gateway: "manual_integration_placeholder"
      }
    });

  } catch (error) {
    console.log("CREATE CHECKOUT ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  } finally {
    clientDb.release();
  }
});

router.post("/confirm-payment/:order_id", async (req, res) => {
  // #swagger.tags = ['Subscriptions']
  const clientDb = await pool.connect();

  try {
    await ensurePaymentTables();

    const { order_id } = req.params;
    const {
      payment_status,
      provider_payment_id,
      provider_order_id,
      provider_signature,
      payment_method
    } = req.body;

    if (!payment_status || !["success", "failed"].includes(payment_status)) {
      return res.status(400).json({
        message: "payment_status must be success or failed"
      });
    }

    await clientDb.query("BEGIN");

    const orderCheck = await clientDb.query(
      `SELECT * FROM payment_orders WHERE order_id = $1 FOR UPDATE`,
      [order_id]
    );

    if (orderCheck.rows.length === 0) {
      await clientDb.query("ROLLBACK");
      return res.status(404).json({
        message: "Payment order not found"
      });
    }

    const order = orderCheck.rows[0];

    if (order.status === "paid") {
      await clientDb.query("COMMIT");
      return res.status(200).json({
        message: "Subscribed",
        data: { order_id, status: order.status }
      });
    }

    if (payment_status === "failed") {
      const failResult = await clientDb.query(
        `UPDATE payment_orders
         SET status = 'failed',
             payment_method = COALESCE($1, payment_method),
             provider_order_id = COALESCE($2, provider_order_id),
             provider_payment_id = COALESCE($3, provider_payment_id),
             provider_signature = COALESCE($4, provider_signature),
             failed_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE order_id = $5
         RETURNING *`,
        [payment_method || null, provider_order_id || null, provider_payment_id || null, provider_signature || null, order_id]
      );

      await clientDb.query("COMMIT");

      return res.status(200).json({
        message: "Payment failed",
        data: failResult.rows[0]
      });
    }

    const paidResult = await clientDb.query(
      `UPDATE payment_orders
       SET status = 'paid',
           payment_method = COALESCE($1, payment_method),
           provider_order_id = COALESCE($2, provider_order_id),
           provider_payment_id = COALESCE($3, provider_payment_id),
           provider_signature = COALESCE($4, provider_signature),
           paid_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE order_id = $5
       RETURNING *`,
      [payment_method || null, provider_order_id || null, provider_payment_id || null, provider_signature || null, order_id]
    );

    await clientDb.query(
      `UPDATE subscription
       SET is_active = false,
           updated_at = CURRENT_TIMESTAMP
       WHERE client_id = $1
         AND is_active = true`,
      [order.client_id]
    );

    const subscriptionResult = await clientDb.query(
      `INSERT INTO subscription (client_id, plan_rate_id, is_active)
       VALUES ($1, $2, true)
       RETURNING *`,
      [order.client_id, order.plan_rate_id]
    );

    await clientDb.query("COMMIT");

    return res.status(200).json({
      message: "Subscribed",
      data: {
        payment_order: paidResult.rows[0],
        subscription: subscriptionResult.rows[0]
      }
    });

  } catch (error) {
    await clientDb.query("ROLLBACK");
    console.log("CONFIRM PAYMENT ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  } finally {
    clientDb.release();
  }
});

router.get("/payment-status/:order_id", async (req, res) => {
  // #swagger.tags = ['Subscriptions']
  try {
    await ensurePaymentTables();

    const { order_id } = req.params;

    const result = await pool.query(
      `SELECT order_id, client_id, client_name, plan_id, plan_name, product_id, product_name,
              plan_rate_id, tenure_type, amount, currency, payment_method,
              status, created_at, updated_at, paid_at, failed_at
       FROM payment_orders
       WHERE order_id = $1`,
      [order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment order not found"
      });
    }

    return res.status(200).json({
      message: "Payment status fetched successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.log("PAYMENT STATUS ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  }
});

router.get("/subscription-report", async (req, res) => {
  // #swagger.tags = ['Subscriptions']
  try {
    await ensurePaymentTables();

    let {
      search = "",
      date_from,
      date_to,
      page = 1,
      limit = 10
    } = req.query;

    const parsedPage = Math.max(1, Number(page) || 1);
    const parsedLimit = Math.max(1, Math.min(200, Number(limit) || 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = ["po.status = 'paid'"];
    const values = [];
    let idx = 1;

    if (search && search.toString().trim()) {
      conditions.push(
        `(po.order_id ILIKE $${idx} OR COALESCE(po.client_name, c.company_name, '') ILIKE $${idx})`
      );
      values.push(`%${search.toString().trim()}%`);
      idx++;
    }

    if (date_from) {
      conditions.push(`po.created_at >= $${idx}`);
      values.push(date_from);
      idx++;
    }

    if (date_to) {
      conditions.push(`po.created_at <= $${idx}`);
      values.push(date_to);
      idx++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const dataQuery = `
      SELECT
        po.order_id,
        COALESCE(po.client_name, c.company_name) AS client_name,
        COALESCE(po.product_name, pt.product_name) AS product_name,
        COALESCE(po.plan_name, p.title) AS plan_name,
        COALESCE(po.tenure_type, pr.tenure_type) AS tenure_type,
        po.amount,
        po.created_at
      FROM payment_orders po
      LEFT JOIN clients c ON c.id = po.client_id
      LEFT JOIN plan_rates pr ON pr.id = po.plan_rate_id
      LEFT JOIN plans p ON p.id = COALESCE(po.plan_id, pr.plan_id)
      LEFT JOIN products_table pt ON pt.id = COALESCE(po.product_id, p.product_id)
      ${whereClause}
      ORDER BY po.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM payment_orders po
      LEFT JOIN clients c ON c.id = po.client_id
      ${whereClause}
    `;

    const dataValues = [...values, parsedLimit, offset];
    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, values)
    ]);

    return res.status(200).json({
      message: dataResult.rows.length
        ? "Subscription report fetched successfully"
        : "No subscription data found",
      total: countResult.rows[0].total,
      page: parsedPage,
      limit: parsedLimit,
      data: dataResult.rows
    });

  } catch (error) {
    console.log("SUBSCRIPTION REPORT ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  }
});

// Backward compatibility alias: old subscribe endpoint now creates checkout.
router.post("/subscribe", async (req, res) => {
  req.url = "/create-checkout";
  return router.handle(req, res);
});


export default router;
