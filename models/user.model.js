const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    registrationType: { type: [String] },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpires: { type: Date },
    role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
    refreshToken: { type: String, default: null }, // NEW FIELD
    fullName: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    isPublisherFormSubmitted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
