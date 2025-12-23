const { default: mongoose } = require("mongoose");
const { default: categoryModel } = require("../../models/newsModel/category.model");
const { default: newsModel } = require("../../models/newsModel/news.model");
const { default: tagModel } = require("../../models/newsModel/tag.model");
const { DEFAULT_OG_IMAGE, FRONTEND_BASE_URL } = require("../../config/constants");
const { syncNewsToFirebase, syncCategoryToFirebase, syncTagToFirebase, deleteNewsFromFirebase } = require("../../firebase/newsSync.firebase");


const createNewsQuery = async (details) => {
    try {
        const {
            heading,
            subheading,
            description,
            author,
            createdBy,
            category, // should be ObjectId
            tags,
            status = "published",
            metaTitle,
            metaDescription,
            metaKeywords,
            sourceUrl,
            isFeatured = false,
            canonicalUrl,
            excerpt,
            credibilityScore,
            ogTitle,
            ogDescription,
            ogImage,
            type,  // NEW FIELD (optional, sports/crypto/politics/etc)
            imageUrl
        } = details;

        // ================================
        // Validate Required Fields
        // ================================
        if (!heading || !description || !createdBy || !category) {
            return {
                status: false,
                statusCode: 400,
                message: "Missing required fields: heading, description, category, createdBy",
            };
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid category ObjectId",
            };
        }

        if (!mongoose.Types.ObjectId.isValid(createdBy)) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid createdBy ObjectId",
            };
        }

        // ================================
        // Fetch Existing Category
        // ================================
        const catDoc = await categoryModel
            .findById(category)
            .populate({ path: "parent", select: "name slug" })
            .lean();

        if (!catDoc) {
            return {
                status: false,
                statusCode: 404,
                message: "Category not found",
            };
        }


        // ================================
        // Process Tags (Create if needed)
        // ================================
        let parsedTags = [];

        try {
            parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
        } catch (e) {
            parsedTags = [];
        }

        const tagIds = [];

        if (Array.isArray(parsedTags)) {
            for (const tagName of parsedTags) {
                const cleanName = tagName.trim().toLowerCase();
                const slug = cleanName.replace(/[^a-z0-9]+/g, "-");

                let tag = await tagModel.findOne({ slug });

                if (!tag) {
                    tag = await tagModel.create({ name: cleanName, slug, usageCount: 1 });

                    syncTagToFirebase(tag).catch(err =>
                        console.error("🔥 Firebase tag sync failed:", err)
                    );
                } else {
                    tag.usageCount += 1;
                    await tag.save();
                }

                tagIds.push(tag._id);
            }
        }

        // ================================
        // 🔗 Slug Generation
        // ================================
        const slug = heading
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        // ================================
        // Clean Description
        // ================================
        const strippedText = description.replace(/<[^>]+>/g, "");

        // ================================
        // Auto SEO Meta
        // ================================
        const seoMetaTitle = metaTitle?.trim()
            ? metaTitle.trim()
            : `${heading} | The Coin Cartel`;

        const seoMetaDescription = metaDescription?.trim()
            ? metaDescription.trim()
            : (subheading?.substring(0, 160) ||
                strippedText.substring(0, 160) ||
                `${heading} latest news, updates & insights by The Coin Cartel`
            );

        const seoMetaKeywords = metaKeywords
            ? metaKeywords.split(",").map(k => k.trim().toLowerCase())
            : [];

        const autoExcerpt =
            excerpt ||
            subheading ||
            strippedText.substring(0, 300);

        const autoCanonicalUrl =
            canonicalUrl ||
            `${FRONTEND_BASE_URL}/news/${catDoc.parent.slug}/${catDoc.slug}/${slug}`;

        const autoOgTitle = ogTitle || seoMetaTitle;
        const autoOgDescription =
            ogDescription ||
            seoMetaDescription ||
            strippedText.substring(0, 150);

        const autoOgImage = ogImage || imageUrl || DEFAULT_OG_IMAGE;

        const finalCredibilityScore =
            typeof credibilityScore === "number" ? credibilityScore : 0;

        const publishedAt = status === "published" ? new Date() : null;

        // ================================
        // Create News Document
        // ================================
        const news = await newsModel.create({
            heading,
            subheading,
            description,
            excerpt: autoExcerpt,
            author,
            image: imageUrl,
            createdBy,
            category: catDoc._id,
            parentCategory: catDoc.parent._id,
            tags: tagIds,
            slug,
            type: JSON.stringify([catDoc.name]),
            status,
            publishedAt,
            isFeatured,
            metaTitle: seoMetaTitle,
            metaDescription: seoMetaDescription,
            metaKeywords: seoMetaKeywords,
            canonicalUrl: autoCanonicalUrl,
            credibilityScore: finalCredibilityScore,
            ogTitle: autoOgTitle,
            ogDescription: autoOgDescription,
            ogImage: autoOgImage,
            sourceUrl,
        });

        // ================================
        // Firebase Sync
        // ================================
        syncNewsToFirebase(news).catch((err) =>
            console.error("🔥 Firebase news sync failed:", err.message)
        );

        return {
            status: true,
            statusCode: 201,
            message: "News created successfully",
            news,
        };

    } catch (error) {
        console.error("❌ Error creating news:", error);
        return {
            status: false,
            statusCode: 500,
            message: error.message || "Internal server error",
        };
    }
};


const getNewsQuery = async (page = 1, limit = 10, parentCategoryName, subCategoryName) => {
    try {
        let query = { isActive: { $ne: false } };

        // Normalize query params
        parentCategoryName = parentCategoryName?.trim();
        subCategoryName = subCategoryName?.trim();

        // Parent category filter
        if (parentCategoryName) {
            const parentCategory = await categoryModel.findOne({
                name: new RegExp(`^${parentCategoryName}$`, "i")
            });

            if (!parentCategory) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Category not found",
                };
            }

            query.parentCategory = parentCategory._id;
        }

        // Subcategory filter
        if (subCategoryName) {
            const subCategory = await categoryModel.findOne({
                name: new RegExp(`^${subCategoryName}$`, "i")
            });

            if (!subCategory) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Subcategory not found",
                };
            }

            query.category = subCategory._id;
        }

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: [
                { path: "category", select: "name slug _id" },
                { path: "parentCategory", select: "name slug _id" },
                { path: "tags", select: "name slug _id" },
                { path: "createdBy", select: "email" },
            ],
        };

        const news = await newsModel.paginate(query, options);

        return {
            status: true,
            statusCode: 200,
            news,
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message,
        };
    }
};


const deleteNewsQuery = async (ids) => {
    try {
        console.log(ids)
        ids = JSON.parse(ids)
        if (!ids || !Array.isArray(ids) || ids.length == 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of news IDs"
            }
        }

        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/))

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDb ObjectId(s)",
                inValidIds
            }
        }

        const result = await newsModel.deleteMany({ _id: { $in: ids } })

        // 🔥 Sync delete with Firebase (non-blocking)
        deleteNewsFromFirebase(ids).catch(err =>
            console.error("Firebase news delete failed:", err)
        );


        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} news(s) delete successfully`,
            deletedCount: result.deletedCount
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}


// const updateNewsQuery = async (details) => {
//     try {

//         const {
//             _id,
//             heading,
//             subheading,
//             description,
//             author,
//             createdBy,
//             category,
//             tags,
//             isFeatured,
//             imageUrl,
//             metaTitle,
//             metaDescription,
//             metaKeywords,
//             canonicalUrl,
//             excerpt,
//             credibilityScore,
//             ogTitle,
//             ogDescription,
//             ogImage,
//             status,
//         } = details;

//         if (!_id) {
//             return {
//                 status: false,
//                 statusCode: 400,
//                 message: "News ID is required",
//             };
//         }

//         // 🔍 Find existing news
//         const existingNews = await newsModel.findById(_id);
//         if (!existingNews) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "News not found",
//             };
//         }

//         // 🏷️ Handle category (if changed)
//         let catDoc = existingNews.category;
//         let catSlug;
//         if (category && typeof category === "string") {
//             const cleanCatName = category.trim().toLowerCase();
//             const categorySlug = cleanCatName.replace(/[^a-z0-9]+/g, "-");
//             catSlug = categorySlug;
//             let foundCat = await categoryModel.findOne({ slug: categorySlug });
//             if (!foundCat) {
//                 foundCat = await categoryModel.create({
//                     name: cleanCatName,
//                     slug: categorySlug,
//                     createdBy: createdBy || existingNews.createdBy,
//                 });
//                 await syncCategoryToFirebase(foundCat).catch((err) =>
//                     console.error("Firebase category sync failed:", err)
//                 );
//             }
//             catDoc = foundCat._id;
//         }

//         // 🏷️ Handle tags (if changed)
//         let tagIds = existingNews.tags || [];
//         if (tags) {
//             let tagArr = Array.isArray(tags) ? tags : JSON.parse(tags);
//             const newTagIds = [];

//             for (const tagName of tagArr) {
//                 const cleanName = tagName.trim().toLowerCase();
//                 const slug = cleanName.replace(/[^a-z0-9]+/g, "-");
//                 let tag = await tagModel.findOne({ slug });

//                 if (!tag) {
//                     tag = await tagModel.create({ name: cleanName, slug, usageCount: 1 });
//                     syncTagToFirebase(tag).catch((err) =>
//                         console.error("Firebase tag sync failed:", err)
//                     );
//                 } else {
//                     tag.usageCount += 1;
//                     await tag.save();
//                 }

//                 newTagIds.push(tag._id);
//             }

//             tagIds = newTagIds;
//         }

//         // 🔗 Recalculate slug (if heading changed)
//         if (heading && heading !== existingNews.heading) {
//             existingNews.slug = heading
//                 .toLowerCase()
//                 .replace(/[^a-z0-9]+/g, "-")
//                 .replace(/(^-|-$)+/g, "");
//         }

//         // 🧠 Auto SEO & Meta Updates
//         existingNews.heading = heading || existingNews.heading;
//         existingNews.subheading = subheading || existingNews.subheading;
//         existingNews.description = description || existingNews.description;
//         existingNews.author = author || existingNews.author;
//         existingNews.image = imageUrl || existingNews.image;
//         existingNews.createdBy = createdBy || existingNews.createdBy;
//         existingNews.category = catDoc;
//         existingNews.tags = tagIds;
//         existingNews.isFeatured = isFeatured ?? existingNews.isFeatured;

//         // Meta / SEO
//         existingNews.metaTitle = metaTitle?.trim() || heading || existingNews.metaTitle;
//         existingNews.metaDescription =
//             metaDescription?.trim() ||
//             subheading?.slice(0, 160) ||
//             description?.replace(/<[^>]+>/g, "").slice(0, 160) ||
//             existingNews.metaDescription;
//         existingNews.metaKeywords = metaKeywords
//             ? metaKeywords.split(",").map((k) => k.trim().toLowerCase())
//             : existingNews.metaKeywords;
//         existingNews.excerpt =
//             excerpt ||
//             subheading ||
//             description?.replace(/<[^>]+>/g, "").slice(0, 300) ||
//             existingNews.excerpt;
//         existingNews.canonicalUrl =
//             `${FRONTEND_BASE_URL}/news/${catSlug}/${existingNews.slug}`;
//         existingNews.credibilityScore =
//             typeof credibilityScore === "number"
//                 ? credibilityScore
//                 : existingNews.credibilityScore;
//         existingNews.ogTitle = ogTitle || heading || existingNews.ogTitle;
//         existingNews.ogDescription =
//             ogDescription ||
//             subheading ||
//             description?.replace(/<[^>]+>/g, "").slice(0, 150) ||
//             existingNews.ogDescription;
//         existingNews.ogImage = ogImage || imageUrl || existingNews.ogImage;

//         if (status) existingNews.status = status;

//         // 💾 Save Mongo Update
//         const updatedNews = await existingNews.save();

//         // 🔥 Sync to Firebase (non-blocking)
//         await syncNewsToFirebase(updatedNews).catch((err) =>
//             console.error("Firebase sync failed:", err)
//         );

//         return {
//             status: true,
//             statusCode: 200,
//             message: "News updated successfully",
//             news: updatedNews,
//         };
//     } catch (error) {
//         console.error("Error updating news:", error);
//         return {
//             status: false,
//             statusCode: 500,
//             message: error.message || "Internal server error",
//         };
//     }
// };


const updateNewsQuery = async (details) => {
    try {
        const {
            _id,
            heading,
            subheading,
            description,
            author,
            createdBy,
            category,
            tags,
            isFeatured,
            imageUrl,
            metaTitle,
            metaDescription,
            metaKeywords,
            canonicalUrl,
            excerpt,
            credibilityScore,
            ogTitle,
            ogDescription,
            ogImage,
            status,
        } = details;

        // ================================
        // Validate News ID
        // ================================
        if (!_id) {
            return {
                status: false,
                statusCode: 400,
                message: "News ID is required",
            };
        }

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid news ID",
            };
        }

        // ================================
        // Fetch Existing News
        // ================================
        const existingNews = await newsModel.findById(_id);
        if (!existingNews) {
            return {
                status: false,
                statusCode: 404,
                message: "News not found",
            };
        }

        // ================================
        // CATEGORY UPDATE (FULL MATCH WITH CREATE LOGIC)
        // ================================
        let finalCategory = existingNews.category;
        let catDoc = null;

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            catDoc = await categoryModel
                .findById(category)
                .populate({ path: "parent", select: "name slug" })
                .lean();

            if (!catDoc) {
                return {
                    status: false,
                    statusCode: 404,
                    message: "Category not found",
                };
            }

            finalCategory = catDoc._id;
        } else {
            // Fetch category for canonical URL generation
            catDoc = await categoryModel
                .findById(existingNews.category)
                .populate({ path: "parent", select: "name slug" })
                .lean();
        }

        // ================================
        // TAG UPDATE (MATCHED TO CREATE LOGIC)
        // ================================
        let parsedTags = [];

        try {
            parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
        } catch {
            parsedTags = [];
        }

        let tagIds = existingNews.tags;

        if (Array.isArray(parsedTags)) {
            const newTagIds = [];

            for (const tagName of parsedTags) {
                const cleanName = tagName.trim().toLowerCase();
                const slug = cleanName.replace(/[^a-z0-9]+/g, "-");

                let tag = await tagModel.findOne({ slug });

                if (!tag) {
                    tag = await tagModel.create({ name: cleanName, slug, usageCount: 1 });

                    syncTagToFirebase(tag).catch(err =>
                        console.error("🔥 Firebase tag sync failed:", err)
                    );
                } else {
                    tag.usageCount += 1;
                    await tag.save();
                }

                newTagIds.push(tag._id);
            }

            tagIds = newTagIds;
        }

        // ================================
        // SLUG UPDATE
        // ================================
        if (heading && heading !== existingNews.heading) {
            existingNews.slug = heading
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
        }

        // ================================
        // CLEAN TEXT (for meta/excerpt)
        // ================================
        const strippedText = description
            ? description.replace(/<[^>]+>/g, "")
            : existingNews.description.replace(/<[^>]+>/g, "");

        // ================================
        // META AUTO-GENERATION
        // ================================
        const seoMetaTitle = metaTitle?.trim()
            ? metaTitle.trim()
            : `${heading || existingNews.heading} | The Coin Cartel`;

        const seoMetaDescription =
            metaDescription?.trim() ||
            subheading?.substring(0, 160) ||
            strippedText.substring(0, 160) ||
            existingNews.metaDescription;

        const seoMetaKeywords = metaKeywords
            ? metaKeywords.split(",").map(k => k.trim().toLowerCase())
            : existingNews.metaKeywords;

        const autoExcerpt =
            excerpt ||
            subheading ||
            strippedText.substring(0, 300) ||
            existingNews.excerpt;

        const autoCanonicalUrl =
            canonicalUrl ||
            `${FRONTEND_BASE_URL}/news/${catDoc?.parent?.slug}/${catDoc?.slug}/${existingNews.slug}`;

        const autoOgTitle = ogTitle || seoMetaTitle;
        const autoOgDescription = ogDescription || seoMetaDescription;
        const autoOgImage = ogImage || imageUrl || existingNews.image;

        // ================================
        // APPLY UPDATES
        // ================================
        console.log({ catDoc })
        existingNews.heading = heading || existingNews.heading;
        existingNews.subheading = subheading || existingNews.subheading;
        existingNews.description = description || existingNews.description;
        existingNews.author = author || existingNews.author;
        existingNews.image = imageUrl || existingNews.image;
        existingNews.createdBy = createdBy || existingNews.createdBy;
        existingNews.category = finalCategory;
        existingNews.parentCategory = catDoc.parent._id;
        existingNews.tags = tagIds;
        existingNews.isFeatured = isFeatured ?? existingNews.isFeatured;

        existingNews.metaTitle = seoMetaTitle;
        existingNews.metaDescription = seoMetaDescription;
        existingNews.metaKeywords = seoMetaKeywords;

        existingNews.excerpt = autoExcerpt;
        existingNews.canonicalUrl = autoCanonicalUrl;

        existingNews.credibilityScore =
            typeof credibilityScore === "number"
                ? credibilityScore
                : existingNews.credibilityScore;

        existingNews.ogTitle = autoOgTitle;
        existingNews.ogDescription = autoOgDescription;
        existingNews.ogImage = autoOgImage;

        if (status) existingNews.status = status;

        // ================================
        // SAVE UPDATE
        // ================================
        const updatedNews = await existingNews.save();

        // ================================
        // FIREBASE SYNC
        // ================================
        syncNewsToFirebase(updatedNews).catch(err =>
            console.error("🔥 Firebase update sync failed:", err)
        );

        return {
            status: true,
            statusCode: 200,
            message: "News updated successfully",
            news: updatedNews,
        };

    } catch (error) {
        console.error("❌ Error updating news:", error);

        return {
            status: false,
            statusCode: 500,
            message: error.message || "Internal server error",
        };
    }
};


const getNewsBySlugQuery = async (slug) => {
    try {
        if (!slug) {
            return {
                status: false,
                statusCode: 400,
                message: "Slug is required",
            };
        }

        const options = {
            populate: [
                {
                    path: "category",
                    select: "name slug _id",
                },
                {
                    path: "tags",
                    select: "name slug _id",
                },
                {
                    path: "createdBy",
                    select: "email",
                },
            ],
        };

        // ✅ Find one document where slug matches
        const existingNews = await newsModel.findOne({ slug }).populate(options.populate);

        if (!existingNews) {
            return {
                status: false,
                statusCode: 404,
                message: "No news found for this slug!",
            };
        }

        return {
            status: true,
            statusCode: 200,
            existingNews,
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message || "Internal server error",
        };
    }
};


module.exports = {
    createNewsQuery,
    getNewsQuery,
    deleteNewsQuery,
    updateNewsQuery,
    getNewsBySlugQuery
}