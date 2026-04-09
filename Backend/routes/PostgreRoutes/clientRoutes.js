import express from "express";
import pool from "../../db/postgres.js";

const router = express.Router();

const sendSuccess = (res, statusCode, message, data, extra = {}) => {
    return res.status(statusCode).json({
        // success: true,
        status: "success",
        message,
        ...extra,
        data
    });
};

const sendWarning = (res, statusCode, message, extra = {}) => {
    return res.status(statusCode).json({
        // success: false,
        status: "warning",
        message,
        ...extra
    });
};

const sendError = (res, message = "Internal server error") => {
    return res.status(500).json({
        // success: false,
        status: "error",
        message
    });
};
const buildPaginationPayload = (page, limit, total, data = []) => {
    const safeData = Array.isArray(data) ? data : [];
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        paging: {
            totalrecords: total,
            totalCount: safeData.length,
            pageSize: limit,
            currentPage: page,
            totalPages
        }
    };
};
const companyTypeOptions = [
    "Private Limited",
    "Public Limited",
    "LLP",
    "Partnership",
    "Proprietorship",
    "OPC"
].map((name, index) => ({
    id: `type_${String(index + 1).padStart(2, "0")}`,
    name
}));
const companySizeOptions = [
    { value: 1, label: "1-10 Employees" },
    { value: 2, label: "11-50 Employees" },
    { value: 3, label: "51-100 Employees" },
    { value: 4, label: "101-500 Employees" },
    { value: 5, label: "501-1000 Employees" },
    { value: 6, label: "1000+ Employees" }
].map((option) => ({
    id: `size_${String(option.value).padStart(2, "0")}`,
    name: option.label
}));
const companyIndustryOptions = [
    "Information Technology (IT)",
    "Software / SaaS",
    "E-commerce",
    "Finance / Banking",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Real Estate",
    "Hospitality",
    "Logistics / Supply Chain",
    "Retail",
    "Telecommunications",
    "Media & Entertainment",
    "Consulting",
    "Marketing / Advertising",
    "Construction",
    "Automobile",
    "Pharmaceutical",
    "Agriculture",
    "Energy / Utilities",
    "Travel & Tourism",
    "Food & Beverage",
    "Legal Services",
    "Human Resources",
    "Other"
].map((name, index) => ({
    id: `ind_${String(index + 1).padStart(2, "0")}`,
    name
}));
const companyTypeNameFromId = (value) => {
    if (value === null || value === undefined) return null;

    const matchedType = companyTypeOptions.find(
        (option) => option.id === String(value).trim()
    );

    return matchedType?.name || prettyFromId(value);
};
const companySizeNameFromId = (value) => {
    if (value === null || value === undefined) return null;

    const matchedSize = companySizeOptions.find(
        (option) => option.id === String(value).trim()
    );

    return matchedSize?.name || prettyFromId(value);
};
const companyIndustryNameFromId = (value) => {
    if (value === null || value === undefined) return null;

    const matchedIndustry = companyIndustryOptions.find(
        (option) => option.id === String(value).trim()
    );

    return matchedIndustry?.name || prettyFromId(value);
};

const countryNameFromCode = (code) => {
    try {
        if (!code) return null;
        const display = new Intl.DisplayNames(["en"], { type: "region" });
        return display.of(String(code).toUpperCase()) || code;
    } catch {
        return code ?? null;
    }
};
const ensureLocationCache = (cache = {}) => ({
    states: cache.states || {},
    cities: cache.cities || {},
    pincodes: cache.pincodes || {}
});
const getCountryLabel = (countryValue) => {
    if (!countryValue) return null;

    const upperCountry = String(countryValue).trim().toUpperCase();
    const byCode = countryNameFromCode(upperCountry);
    if (byCode && byCode !== upperCountry) return byCode;

    return String(countryValue).trim();
};
const getStateOptionsByCountry = async (countryValue, cache = {}) => {
    const safeCache = ensureLocationCache(cache);
    const countryKey = String(countryValue || "").trim().toUpperCase();
    if (!countryKey) return [];
    if (safeCache.states[countryKey]) return safeCache.states[countryKey];

    const country = getCountryLabel(countryValue);
    if (!country) {
        safeCache.states[countryKey] = [];
        return safeCache.states[countryKey];
    }

    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ country })
            }
        );

        if (!response.ok) {
            safeCache.states[countryKey] = [];
            return safeCache.states[countryKey];
        }

        const result = await response.json();
        safeCache.states[countryKey] = (result.data?.states ?? []).map((state) => ({
            id: String(state.state_code || state.name).trim(),
            name: state.name
        }));
        return safeCache.states[countryKey];
    } catch {
        safeCache.states[countryKey] = [];
        return safeCache.states[countryKey];
    }
};
const getStateNameFromId = async (countryValue, stateId, cache = {}) => {
    if (!stateId) return null;
    const states = await getStateOptionsByCountry(countryValue, cache);
    const target = String(stateId).trim().toUpperCase();
    const matchedState = states.find(
        (state) => String(state.id).trim().toUpperCase() === target
    );

    return matchedState?.name || prettyFromId(stateId);
};
const getCityOptionsByState = async (countryValue, stateId, cache = {}) => {
    const safeCache = ensureLocationCache(cache);
    const countryKey = String(countryValue || "").trim().toUpperCase();
    const stateKey = String(stateId || "").trim().toUpperCase();
    const cacheKey = `${countryKey}::${stateKey}`;
    if (!countryKey || !stateKey) return [];
    if (safeCache.cities[cacheKey]) return safeCache.cities[cacheKey];

    const country = getCountryLabel(countryValue);
    const state = await getStateNameFromId(countryValue, stateId, safeCache);
    if (!country || !state) {
        safeCache.cities[cacheKey] = [];
        return safeCache.cities[cacheKey];
    }

    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/state/cities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ country, state })
            }
        );

        if (!response.ok) {
            safeCache.cities[cacheKey] = [];
            return safeCache.cities[cacheKey];
        }

        const result = await response.json();
        safeCache.cities[cacheKey] = (result.data ?? []).map((city, index) => ({
            id: `${String(stateId).trim()}-${index + 1}`,
            name: city
        }));
        return safeCache.cities[cacheKey];
    } catch {
        safeCache.cities[cacheKey] = [];
        return safeCache.cities[cacheKey];
    }
};
const getCityNameFromId = async (countryValue, stateId, cityId, cache = {}) => {
    if (!cityId) return null;
    const cities = await getCityOptionsByState(countryValue, stateId, cache);
    const target = String(cityId).trim().toUpperCase();
    const matchedCity = cities.find(
        (city) => String(city.id).trim().toUpperCase() === target
    );

    return matchedCity?.name || prettyFromId(cityId);
};
const getPincodeNameFromId = async (countryValue, pincodeId, cache = {}) => {
    const safeCache = ensureLocationCache(cache);
    const countryKey = String(countryValue || "IN").trim().toUpperCase();
    const pincodeKey = String(pincodeId || "").trim();
    const cacheKey = `${countryKey}::${pincodeKey}`;
    if (!pincodeKey) return null;
    if (safeCache.pincodes[cacheKey]) return safeCache.pincodes[cacheKey];

    try {
        const response = await fetch(
            `https://api.zippopotam.us/${countryKey.toLowerCase()}/${pincodeKey}`
        );

        if (!response.ok) {
            safeCache.pincodes[cacheKey] = pincodeKey;
            return safeCache.pincodes[cacheKey];
        }

        const result = await response.json();
        const firstPlace = result.places?.[0];
        safeCache.pincodes[cacheKey] =
            firstPlace?.["place name"] || result["post code"] || pincodeKey;
        return safeCache.pincodes[cacheKey];
    } catch {
        safeCache.pincodes[cacheKey] = pincodeKey;
        return safeCache.pincodes[cacheKey];
    }
};

const prettyFromId = (value) => {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    if (!str) return null;

    return str
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
};

const formatClientForRead = async (row, cache = {}) => ({
    id: row.id,
    company_name: row.company_name ?? null,
    company_type_id: row.company_type ?? null,
    company_type_name: companyTypeNameFromId(row.company_type),
    company_size_id: row.company_size ?? null,
    company_size_name: row.company_size_name ?? companySizeNameFromId(row.company_size),
    company_industry_id: row.company_industry ?? null,
    company_industry_name: row.company_industry_name ?? companyIndustryNameFromId(row.company_industry),
    country_id: row.country ?? null,
    country_name: getCountryLabel(row.country),
    state_id: row.state ?? null,
    state_name: await getStateNameFromId(row.country, row.state, cache),
    city_id: row.city ?? null,
    city_name: await getCityNameFromId(row.country, row.state, row.city, cache),
    pincode_id: row.pincode ?? null,
    pincode_name: await getPincodeNameFromId(row.country, row.pincode, cache),
    tax_info: row.tax_info ?? null,
    address_line1: row.address_line1 ?? null,
    address_line2: row.address_line2 ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at
});

router.get("/countries", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,cca2"
        );

        if (!response.ok) {
            return sendError(res, "Failed to fetch countries");
        }

        const countries = await response.json();
        const formattedCountries = countries
            .map((country) => ({
                id: country.cca2,
                name: country.name?.common ?? ""
            }))
            .filter((country) => country.id && country.name)
            .sort((a, b) => a.name.localeCompare(b.name));

        return sendSuccess(
            res,
            200,
            formattedCountries.length ? "Countries fetched successfully" : "No countries found",
            formattedCountries
        );

    } catch (error) {
        console.error("GET COUNTRIES ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/states", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { country } = req.query;

        if (!country) {
            return sendWarning(res, 400, "country is required");
        }

        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ country })
            }
        );

        if (!response.ok) {
            return sendError(res, "Failed to fetch states");
        }

        const result = await response.json();
        const states = (result.data?.states ?? [])
            .map((state) => ({
                id: state.state_code || state.name,
                name: state.name
            }))
            .filter((state) => state.name)
            .sort((a, b) => a.name.localeCompare(b.name));

        return sendSuccess(
            res,
            200,
            states.length ? "States fetched successfully" : "No states found",
            states
        );

    } catch (error) {
        console.error("GET STATES ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/cities", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { country, state } = req.query;

        if (!country || !state) {
            return sendWarning(res, 400, "country and state are required");
        }

        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/state/cities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ country, state })
            }
        );

        if (!response.ok) {
            return sendError(res, "Failed to fetch cities");
        }

        const result = await response.json();
        const cities = (result.data ?? [])
            .map((city, index) => ({
                id: `${state}-${index + 1}`,
                name: city
            }))
            .filter((city) => city.name)
            .sort((a, b) => a.name.localeCompare(b.name));

        return sendSuccess(
            res,
            200,
            cities.length ? "Cities fetched successfully" : "No cities found",
            cities
        );

    } catch (error) {
        console.error("GET CITIES ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/pincode", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { countryCode = "IN", pincode } = req.query;

        if (!pincode) {
            return sendWarning(res, 400, "pincode is required");
        }

        const response = await fetch(
            `https://api.zippopotam.us/${countryCode.toString().toLowerCase()}/${pincode}`
        );

        if (response.status === 404) {
            return sendWarning(res, 404, "Pincode not found");
        }

        if (!response.ok) {
            return sendError(res, "Failed to fetch pincode details");
        }

        const result = await response.json();
        const firstPlace = result.places?.[0];

        return sendSuccess(res, 200, "Pincode details fetched successfully", {
            pincode: result["post code"],
            country_code: result["country abbreviation"],
            country_name: result.country,
            state: firstPlace?.state ?? null,
            state_code: firstPlace?.["state abbreviation"] ?? null,
            city: firstPlace?.["place name"] ?? null
        });

    } catch (error) {
        console.error("GET PINCODE ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/company-typesDDL", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        return sendSuccess(
            res,
            200,
            companyTypeOptions.length
                ? "Company types fetched successfully"
                : "No company types found",
            companyTypeOptions
        );
    } catch (error) {
        console.error("GET COMPANY TYPES ERROR:", error);
        return sendError(res, error.message);
    }
});

router.post("/clients", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const {
            company_name,
            company_type,
            company_size,
            company_industry,
            company_type_id,
            company_size_id,
            company_industry_id,
            tax_info,
            address_line1,
            address_line2,
            country,
            state,
            city,
            country_id,
            state_id,
            city_id,
            pincode,
            pincode_id,
            email,
            phone
        } = req.body;

        const finalCompanyName = company_name?.toString().trim();
        const finalCompanyTypeId = company_type_id?.toString().trim();
        const finalCompanySizeId = company_size_id?.toString().trim();
        const finalCompanyIndustryId = company_industry_id?.toString().trim();
        const finalCountryId = (country_id ?? country)?.toString().trim();
        const finalStateId = (state_id ?? state)?.toString().trim();
        const finalCityId = (city_id ?? city)?.toString().trim();
        const finalPincodeId = (pincode_id ?? pincode)?.toString().trim();

        // Basic validation
        if (
            !finalCompanyTypeId ||
            !finalCompanySizeId ||
            !finalCompanyIndustryId ||
            !finalCountryId ||
            !finalStateId ||
            !finalCityId ||
            !finalPincodeId
        ) {
            return sendWarning(
                res,
                400,
                "company_type_id, company_size_id, company_industry_id, country_id, state_id, city_id and pincode_id are required"
            );
        }

        if (!finalCompanyName) {
            return sendWarning(res, 400, "company_name is required");
        }

        const duplicateClient = await pool.query(
            `SELECT id
             FROM clients
             WHERE is_active = true
               AND LOWER(TRIM(company_name)) = LOWER(TRIM($1))
             LIMIT 1`,
            [finalCompanyName]
        );

        if (duplicateClient.rows.length > 0) {
            return sendWarning(res, 409, "Client name already exist");
        }

        const result = await pool.query(
            `INSERT INTO clients (
        company_name, company_type, company_size, company_industry, tax_info,
        address_line1, address_line2, country, state, city, pincode, email, phone
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
            [
                finalCompanyName,
                finalCompanyTypeId,
                finalCompanySizeId,
                finalCompanyIndustryId,
                tax_info,
                address_line1,
                address_line2,
                finalCountryId,
                finalStateId,
                finalCityId,
                finalPincodeId,
                email,
                phone
            ]
        );

        return sendSuccess(res, 201, "Client added successfully", result.rows[0]);

    } catch (error) {
        console.error("CLIENT ERROR:", error);
        return sendError(res, error.message);
    }
});

router.put("/clients/:id", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const {
            company_name,
            company_type,
            company_size,
            company_industry,
            company_type_id,
            company_size_id,
            company_industry_id,
            tax_info,
            address_line1,
            address_line2,
            country,
            state,
            city,
            country_id,
            state_id,
            city_id,
            pincode,
            pincode_id,
            email,
            phone
        } = req.body;

        // Check client exists
        const existing = await pool.query(
            "SELECT * FROM clients WHERE id = $1",
            [id]
        );

        if (existing.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        const oldClient = existing.rows[0];

        const finalCompanyName = (company_name ?? oldClient.company_name)?.toString().trim();
        const finalCompanyTypeId = (company_type_id ?? oldClient.company_type)?.toString().trim();
        const finalCompanySizeId = (company_size_id ?? oldClient.company_size)?.toString().trim();
        const finalCompanyIndustryId = (company_industry_id ?? oldClient.company_industry)?.toString().trim();
        const finalCountryId = (country_id ?? country ?? oldClient.country)?.toString().trim();
        const finalStateId = (state_id ?? state ?? oldClient.state)?.toString().trim();
        const finalCityId = (city_id ?? city ?? oldClient.city)?.toString().trim();
        const finalPincodeId = (pincode_id ?? pincode ?? oldClient.pincode)?.toString().trim();

        const result = await pool.query(
            `UPDATE clients SET
        company_name = $1,
        company_type = $2,
        company_size = $3,
        company_industry = $4,
        tax_info = $5,
        address_line1 = $6,
        address_line2 = $7,
        country = $8,
        state = $9,
        city = $10,
        pincode = $11,
        email = $12,
        phone = $13
      WHERE id = $14
      RETURNING *`,
            [
                finalCompanyName,
                finalCompanyTypeId,
                finalCompanySizeId,
                finalCompanyIndustryId,
                tax_info ?? oldClient.tax_info,
                address_line1 ?? oldClient.address_line1,
                address_line2 ?? oldClient.address_line2,
                finalCountryId,
                finalStateId,
                finalCityId,
                finalPincodeId,
                email ?? oldClient.email,
                phone ?? oldClient.phone,
                id
            ]
        );

        return sendSuccess(res, 200, "Client updated successfully", result.rows[0]);

    } catch (error) {
        console.error("UPDATE CLIENT ERROR:", error);
        return sendError(res, error.message);
    }
});

router.get("/clients", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        let { search = "", page = 1, limit = 10, country, state, city } = req.query;

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.max(1, parseInt(limit) || 10);
        const offset = (page - 1) * limit;

        let query = `
            SELECT
                c.*,
                ic.name AS company_industry_name
            FROM clients c
            LEFT JOIN industry_categories ic
                ON ic.id::text = c.company_industry::text
            WHERE c.is_active = true
        `;

        let countQuery = `
            SELECT COUNT(*)
            FROM clients c
            WHERE c.is_active = true
        `;

        let values = [];
        let index = 1;

        // Search
        if (search && search.trim().length >= 3) {
            const words = search.trim().split(/\s+/);
            const wordConditions = words.map((_, i) => `c.company_name ILIKE $${index + i}`);
            query += ` AND (${wordConditions.join(" AND ")})`;
            countQuery += ` AND (${wordConditions.join(" AND ")})`;
            words.forEach(word => values.push(`%${word}%`));
            index += words.length;
        }

        // Filters
        if (country) {
            query += ` AND c.country = $${index}`;
            countQuery += ` AND c.country = $${index}`;
            values.push(country);
            index++;
        }

        if (state) {
            query += ` AND c.state = $${index}`;
            countQuery += ` AND c.state = $${index}`;
            values.push(state);
            index++;
        }

        if (city) {
            query += ` AND c.city = $${index}`;
            countQuery += ` AND c.city = $${index}`;
            values.push(city);
            index++;
        }

        // Pagination
        query += ` ORDER BY c.id DESC LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit, offset);

        const data = await pool.query(query, values);

        // Count
        const countValues = values.slice(0, values.length - 2);
        const totalResult = await pool.query(countQuery, countValues);
        const total = parseInt(totalResult.rows[0].count);

        const locationCache = ensureLocationCache();
        const clients = await Promise.all(
            data.rows.map((row) => formatClientForRead(row, locationCache))
        );

        const pagination = buildPaginationPayload(page, limit, total, clients);

        return sendSuccess(
            res,
            200,
            data.rows.length
                ? "Clients fetched successfully"
                : "No clients found for this page",
            clients,
            pagination
        );

    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);
        return sendError(res);
    }
});

// router.get("/clients", async (req, res) => {
//     // #swagger.tags = ['Clients']
//     try {
//         let { search = "", page = 1, limit = 10, country, state, city } = req.query;

//         page = Math.max(1, parseInt(page) || 1);
//         limit = Math.max(1, parseInt(limit) || 10);
//         const offset = (page - 1) * limit;

//         let query = `
//             SELECT
//                 c.*,
//                 ic.name AS company_industry_name
//             FROM clients c
//             LEFT JOIN industry_categories ic
//                 ON ic.id::text = c.company_industry::text
//             WHERE c.is_active = true
//         `;
//         let countQuery = `SELECT COUNT(*) FROM clients c WHERE c.is_active = true`;

//         let values = [];
//         let index = 1;

//         // 🔍 Search (minimum 3 letters, partial word match, case-insensitive)
//         if (search && search.trim().length >= 3) {
//             const words = search.trim().split(/\s+/);
//             const wordConditions = words.map((_, i) => `c.company_name ILIKE $${index + i}`);
//             query += ` AND (${wordConditions.join(" AND ")})`;
//             countQuery += ` AND (${wordConditions.join(" AND ")})`;
//             words.forEach(word => values.push(`%${word}%`)); // partial match
//             index += words.length;
//         }

//         // 🌍 Filters
//         if (country) { query += ` AND c.country = $${index}`; countQuery += ` AND c.country = $${index}`; values.push(country); index++; }
//         if (state) { query += ` AND c.state = $${index}`; countQuery += ` AND c.state = $${index}`; values.push(state); index++; }
//         if (city) { query += ` AND c.city = $${index}`; countQuery += ` AND c.city = $${index}`; values.push(city); index++; }

//         // 📄 Pagination
//         query += ` ORDER BY c.id DESC LIMIT $${index} OFFSET $${index + 1}`;
//         values.push(limit, offset);

//         const data = await pool.query(query, values);

//         // Count total
//         const countValues = values.slice(0, values.length - 2);
//         const totalResult = await pool.query(countQuery, countValues);
//         const total = parseInt(totalResult.rows[0].count);
//         const clients = data.rows.map(formatClientForRead);
//         const pagination = buildPaginationPayload(page, limit, total, clients);

//         return sendSuccess(
//             res,
//             200,
//             data.rows.length ? "Clients fetched successfully" : "No clients found for this page",
//             clients,
//             pagination
//         );

//     } catch (error) {
//         console.error("GET CLIENTS ERROR:", error);
//         return sendError(res);
//     }
// });

router.get("/clientsDetailsById/:id", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                c.*,
                ic.name AS company_industry_name
             FROM clients c
             LEFT JOIN industry_categories ic
                ON ic.id::text = c.company_industry::text
             WHERE c.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        return sendSuccess(
            res,
            200,
            "Client details fetched successfully",
            await formatClientForRead(result.rows[0], ensureLocationCache())
        );

    } catch (error) {
        console.error("GET CLIENT DETAIL ERROR:", error);
        return sendError(res, error.message);
    }
});

router.patch("/clients/:id/deactivate", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE clients SET is_active = false WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        return sendSuccess(res, 200, "Client deactivated", result.rows[0]);

    } catch (error) {
        return sendError(res, error.message);
    }
});


export default router;
