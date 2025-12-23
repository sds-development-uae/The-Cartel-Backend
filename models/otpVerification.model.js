const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otpCode: { type: String },
    otpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Otp', OtpSchema);
