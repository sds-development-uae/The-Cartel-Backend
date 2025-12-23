// routes/cloudinary.routes.js
const express = require("express");
const { generateSignature, generateSignatureForUploadPhotos } = require("../controller/cloudionary.controller");
const router = express.Router();

router.post("/", generateSignature);

router.post("/photo-upload", generateSignatureForUploadPhotos);

module.exports = router;
