const { createPublisherQuery, getPublisherQuery, deletePublisherQuery, updatePublisherQuery, verifyWebsiteByMetaQuery, generateTokenQuery } = require("../../query/publisherQuery/publisher.query")



const createPublisherController = async (req, res, next) => {
    try {
        const response = await createPublisherQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const getPublisherController = async (req, res, next) => {
    try {
        const {
            page,
            limit,
            accountType,
            search,
            country,
            language,
            marketplaceCategory,
            niches,
            minPrice,
            maxPrice,
            minPageViews,
            maxPageViews
        } = req.query;

        let normalizedCountry = [];
        let normalizedLanguages = [];
        let normalizedMarketCategories = [];
        let normalizedNiches = [];

        if (country) {
            try {
                const parsed = JSON.parse(country);
                if (Array.isArray(parsed)) normalizedCountry = parsed;
            } catch { }
        }

        if (language) {
            try {
                const parsed = JSON.parse(language);
                if (Array.isArray(parsed)) normalizedLanguages = parsed;
            } catch { }
        }

        if (marketplaceCategory) {
            try {
                const parsed = JSON.parse(marketplaceCategory);
                if (Array.isArray(parsed)) normalizedMarketCategories = parsed;
            } catch { }
        }

        if (niches) {
            try {
                const parsed = JSON.parse(niches);
                if (Array.isArray(parsed)) normalizedNiches = parsed;
            } catch { }
        }

        const response = await getPublisherQuery({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            accountType: accountType || "all",
            search: search || "",
            country: normalizedCountry,
            language: normalizedLanguages,
            marketplaceCategory: normalizedMarketCategories,
            niches: normalizedNiches,
            minPrice: minPrice ? Number(minPrice) : null,
            maxPrice: maxPrice ? Number(maxPrice) : null,
            minPageViews: minPageViews ? Number(minPageViews) : null,
            maxPageViews: maxPageViews ? Number(maxPageViews) : null
        });

        return res.send(response);
    } catch (error) {
        next(error);
    }
};



const updatePublisherController = async (req, res, next) => {
    try {
        const response = await updatePublisherQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const deletePublisherController = async (req, res, next) => {
    try {
        const response = await deletePublisherQuery(req.query.ids)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const verifyWebsiteByMetaController = async (req, res, next) => {
    try {
        const response = await verifyWebsiteByMetaQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const generateTokenController = async (req, res, next) => {
    try {
        const response = await generateTokenQuery(req.body)
        return res.send(response)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createPublisherController,
    getPublisherController,
    deletePublisherController,
    updatePublisherController,
    verifyWebsiteByMetaController,
    generateTokenController
}