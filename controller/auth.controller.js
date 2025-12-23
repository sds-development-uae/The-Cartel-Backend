const userModel = require("../models/user.model")
const { authQuery, signUpQuery, verifyOtpQuery, resendOtpQuery, forgotPasswordQuery } = require("../query/auth.query")
const { verifyRefreshToken, signAccessToken } = require("../services/jwt.service")


const authController = async (req, res, next) => {
    try {
        const response = await authQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const signUpController = async (req, res, next) => {
    try {
        const response = await signUpQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const verifyOtpController = async (req, res, next) => {
    try {
        const response = await verifyOtpQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}


const resendOtpController = async (req, res, next) => {
    try {
        const response = await resendOtpQuery(req.body)
        return res.send(response)
    } catch (error) {
        next(error)
    }
}

const forgotPasswordController = async (req, res, next) => {
    try {
        const response = await forgotPasswordQuery(req.body)
        return res.send(response)

    } catch (error) {
        next(error)
    }
}

const refreshController = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ status: false, message: "Refresh token required" });
    }

    try {
        const payload = verifyRefreshToken(refreshToken);
        const user = await userModel.findById(payload.sub);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ status: false, message: "Invalid refresh token" });
        }

        const newAccessToken = signAccessToken({
            sub: user._id,
            role: user.role,
            email: user.email,
        });

        return res.json({
            status: true,
            accessToken: newAccessToken,
        });
    } catch (err) {
        return res.status(403).json({ status: false, message: "Invalid or expired refresh token" });
    }
}


const logoutController = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ status: false, message: "Refresh token required" });
    }

    const user = await userModel.findOne({ refreshToken });
    if (!user) {
        return res.status(200).json({ status: true, message: "Logged out" });
    }

    user.refreshToken = null;
    await user.save();

    return res.json({ status: true, message: "Logged out successfully" });
};


module.exports = {
    authController,
    signUpController,
    verifyOtpController,
    resendOtpController,
    forgotPasswordController,
    refreshController,
    logoutController
}