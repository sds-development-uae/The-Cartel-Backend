// routes/cloudinary.routes.js
const express = require("express");
const { generateSignature, generateSignatureForUploadPhotos, generateSignatureForPublisherPhotos } = require("../controller/cloudionary.controller");
const router = express.Router();

router.post("/", generateSignature);

router.post("/photo-upload", generateSignatureForUploadPhotos);

router.post("/publisher-photos", generateSignatureForPublisherPhotos);

module.exports = router;
