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

const countryNameFromCode = (code) => {
    try {
        if (!code) return null;
        const display = new Intl.DisplayNames(["en"], { type: "region" });
        return display.of(String(code).toUpperCase()) || code;
    } catch {
        return code ?? null;
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

const formatClientForRead = (row) => ({
    id: row.id,
    company_name: row.company_name ?? null,
    company_type_id: row.company_type ?? null,
    company_type_name: prettyFromId(row.company_type),
    company_size_id: row.company_size ?? null,
    company_size_name: prettyFromId(row.company_size),
    company_industry_id: row.company_industry ?? null,
    company_industry_name: prettyFromId(row.company_industry),
    country_id: row.country ?? null,
    country_name: countryNameFromCode(row.country),
    state_id: row.state ?? null,
    state_name: prettyFromId(row.state),
    city_id: row.city ?? null,
    city_name: prettyFromId(row.city),
    pincode_id: row.pincode ?? null,
    pincode_name: row.pincode ?? null,
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
        const finalCompanyTypeId = (company_type_id ?? company_type)?.toString().trim();
        const finalCompanySizeId = (company_size_id ?? company_size)?.toString().trim();
        const finalCompanyIndustryId = (company_industry_id ?? company_industry)?.toString().trim();
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
        const finalCompanyTypeId = (company_type_id ?? company_type ?? oldClient.company_type)?.toString().trim();
        const finalCompanySizeId = (company_size_id ?? company_size ?? oldClient.company_size)?.toString().trim();
        const finalCompanyIndustryId = (company_industry_id ?? company_industry ?? oldClient.company_industry)?.toString().trim();
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

        let query = `SELECT * FROM clients WHERE is_active = true`;
        let countQuery = `SELECT COUNT(*) FROM clients WHERE is_active = true`;

        let values = [];
        let index = 1;

        // 🔍 Search (minimum 3 letters, partial word match, case-insensitive)
        if (search && search.trim().length >= 3) {
            const words = search.trim().split(/\s+/);
            const wordConditions = words.map((_, i) => `company_name ILIKE $${index + i}`);
            query += ` AND (${wordConditions.join(" AND ")})`;
            countQuery += ` AND (${wordConditions.join(" AND ")})`;
            words.forEach(word => values.push(`%${word}%`)); // partial match
            index += words.length;
        }

        // 🌍 Filters
        if (country) { query += ` AND country = $${index}`; countQuery += ` AND country = $${index}`; values.push(country); index++; }
        if (state) { query += ` AND state = $${index}`; countQuery += ` AND state = $${index}`; values.push(state); index++; }
        if (city) { query += ` AND city = $${index}`; countQuery += ` AND city = $${index}`; values.push(city); index++; }

        // 📄 Pagination
        query += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index + 1}`;
        values.push(limit, offset);

        const data = await pool.query(query, values);

        // Count total
        const countValues = values.slice(0, values.length - 2);
        const totalResult = await pool.query(countQuery, countValues);
        const total = parseInt(totalResult.rows[0].count);
        const clients = data.rows.map(formatClientForRead);
        const pagination = buildPaginationPayload(page, limit, total, clients);

        return sendSuccess(
            res,
            200,
            data.rows.length ? "Clients fetched successfully" : "No clients found for this page",
            clients,
            pagination
        );

    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);
        return sendError(res);
    }
});

router.get("/clientsDetailsById/:id", async (req, res) => {
    // #swagger.tags = ['Clients']
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM clients WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return sendWarning(res, 404, "Client not found");
        }

        return sendSuccess(res, 200, "Client details fetched successfully", formatClientForRead(result.rows[0]));

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
