const express = require("express")
const { commonErrors } = require("../../errors/error")
const { getCategoryListController, createCategoryController, getSubcategoriesController, updateCategoryController, deleteCategoryController } = require("../../controller/newsController/category.controller")
const router = express.Router()

router.post("/create", createCategoryController)

router.get("/", getCategoryListController)

router.get("/sub-categories", getSubcategoriesController)

router.post("/update", updateCategoryController)

router.delete("/delete", deleteCategoryController)

router.use(commonErrors)

module.exports = router