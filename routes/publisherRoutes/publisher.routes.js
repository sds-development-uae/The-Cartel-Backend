const express = require("express")
const { createPublisherController, getPublisherController, deletePublisherController, updatePublisherController, verifyWebsiteByMetaController } = require("../../controller/publisherController/publisher.controller")
const { commonErrors } = require("../../errors/error")
const adminOnly = require("../../services/role.service")
const router = express.Router()

router.post('/create', createPublisherController)

router.get('/get', getPublisherController)

router.delete('/delete', deletePublisherController)

router.post('/update', updatePublisherController)

router.post('/meta-verification', verifyWebsiteByMetaController)

router.use(commonErrors)

module.exports = router