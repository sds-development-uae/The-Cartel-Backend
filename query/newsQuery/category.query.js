const { syncCategoryToFirebase, deleteCategoryFromFirebase } = require("../../firebase/newsSync.firebase");
const { default: categoryModel } = require("../../models/newsModel/category.model")


const createCategoryQuery = async (details) => {
    try {

        const { name, description, parent, icon, banner, metaTitle, metaDescription, isFeatured, createdBy } = details;

        const categoryName = name.trim().toLowerCase();
        const categorySlug = categoryName.replace(/[^a-z0-9]+/g, "-");
        const exist = await categoryModel.findOne({ slug: categorySlug });

        if (exist) {
            return {
                status: false,
                statusCode: 400,
                message: "Category already exist"
            }
        }

        const autoMetaTitle = metaTitle?.trim() ? metaTitle.trim() : `${categoryName} News & update`

        const autoMetaDescription = metaDescription?.trim() ? metaDescription.trim() : (description ? description.substring(0, 160) : `${categoryName} Category news, lates updates, articles and coverage from The Coin Cartel`)

        const category = await categoryModel.create({
            name: categoryName,
            slug: categorySlug,
            description,
            parent: parent || null,
            icon,
            banner,
            metaTitle: autoMetaTitle,
            metaDescription: autoMetaDescription,
            isFeatured: isFeatured ?? false,
            createdBy: createdBy
        })

        // 🔥 Sync Category (non-blocking)
        await syncCategoryToFirebase(category).catch(err =>
            console.error("Firebase category sync failed:", err)
        );

        return {
            status: true,
            statusCode: 201,
            message: "New Category added",
            category
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 200,
            message: error.message,
        }
    }
}

const getCategoryListQuery = async ({ page, limit, search }) => {
    try {

        let query = {}

        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search, $options: "i" } }
            ]
        }


        const options = {
            page: page,
            limit: limit,
            sort: { createdAt: -1 },
            populate: [
                {
                    path: "parent",
                    select: "name"
                },
                {
                    path: "createdBy",
                    select: "email"
                }
            ]
        }
        const categories = await categoryModel.paginate(query, options)

        return {
            status: true,
            statusCode: 200,
            categories
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 200,
            message: error.message
        }
    }
}

const getSubcategoriesQuery = async ({ page, limit, categoryName }) => {
    try {
        const category = await categoryModel.findOne({ name: categoryName });
        console.log(category)

        if (!category) {
            return {
                status: false,
                statusCode: 404,
                message: "Category not found"
            };
        }

        const query = {
            parent: category._id,
            isActive: true
        };

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            populate: [{ path: "parent", select: "name" }]
        };

        const subCategories = await categoryModel.paginate(query, options);

        return {
            status: true,
            statusCode: 200,
            subCategories
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};


const updateCategoryQuery = async (details) => {
    try {
        console.log(details)
        const {
            name,
            description,
            parent,
            icon,
            banner,
            metaTitle,
            metaDescription,
            isFeatured,
            isActive,
            updatedBy
        } = details;

        const category = await categoryModel.findById(details._id);

        if (!category) {
            return {
                status: false,
                statusCode: 404,
                message: "Category not found"
            };
        }

        let nameChanged = false;
        let descriptionChanged = false;

        // 🔥 If name is updated → update slug and mark change
        if (name !== undefined) {
            const newName = name.trim();
            const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

            if (newName !== category.name) {
                nameChanged = true;
            }

            // Check if slug belongs to someone else
            const exist = await categoryModel.findOne({
                slug: newSlug,
                _id: { $ne: details._id }
            });

            if (exist) {
                return {
                    status: false,
                    statusCode: 400,
                    message: "Category name already exists"
                };
            }

            category.name = newName;
            category.slug = newSlug;
        }

        // 🔥 Update description & mark change
        if (description !== undefined) {
            if (description !== category.description) {
                descriptionChanged = true;
            }
            category.description = description;
        }

        // 🔥 Update other fields
        if (parent !== undefined) category.parent = parent || null;
        if (icon !== undefined) category.icon = icon;
        if (banner !== undefined) category.banner = banner;
        if (isFeatured !== undefined) category.isFeatured = isFeatured;
        if (isActive !== undefined) category.isActive = isActive;
        if (updatedBy) category.updatedBy = updatedBy;

        // -----------------------------------------------------
        // Auto Meta Generation Logic
        // Only auto-update IF:
        // (1) metaTitle/metaDescription not provided AND
        // (2) name or description changed
        // -----------------------------------------------------

        // Meta Title
        if (metaTitle !== undefined) {
            // User provided → use it
            category.metaTitle = metaTitle.trim() ? metaTitle.trim() : `${category.name} News & updates`;
        } else if (nameChanged) {
            // Auto update because name changed
            category.metaTitle = `${category.name} News & updates`;
        }

        // ⭐ Meta Description
        if (metaDescription !== undefined) {
            // User provided → use it
            category.metaDescription = metaDescription.trim()
                ? metaDescription.trim()
                : (
                    category.description
                        ? category.description.substring(0, 160)
                        : `${category.name} Category news, latest updates, articles and coverage from The Coin Cartel`
                );
        } else if (descriptionChanged || nameChanged) {
            // Auto update because description or name changed
            category.metaDescription = category.description
                ? category.description.substring(0, 160)
                : `${category.name} Category news, latest updates, articles and coverage from The Coin Cartel`;
        }

        // Save final updated category
        await category.save();

        // -----------------------------------------------------
        // 🔥 Sync to Firebase (with automatic ObjectId → string conversion)
        // -----------------------------------------------------
        await syncCategoryToFirebase(category).catch(err =>
            console.error("Firebase category sync failed:", err)
        );

        return {
            status: true,
            statusCode: 200,
            message: "Category updated successfully",
            category
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const deleteCategoryQuery = async (ids) => {
    try {
        console.log({ ids })
        ids = JSON.parse(ids);

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Provide an array of publisher submission id"
            };
        }

        // Validate MongoDB ObjectIds
        const inValidIds = ids.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));

        if (inValidIds.length > 0) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid mongoDB ObjectId(s)",
                inValidIds
            };
        }

        // STEP 2: Delete category
        const result = await categoryModel.deleteMany({ _id: { $in: ids } });

        await deleteCategoryFromFirebase(ids).catch(err =>
            console.error("Firebase category delete failed")
        )

        return {
            status: true,
            statusCode: 200,
            message: `${result.deletedCount} category(s) deleted successfully`,
            deletedCount: result.deletedCount,
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
}

module.exports = {
    createCategoryQuery,
    getCategoryListQuery,
    getSubcategoriesQuery,
    updateCategoryQuery,
    deleteCategoryQuery
}