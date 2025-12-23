const userModel = require("../models/user.model");
const { signAccessToken, signRefreshToken } = require("../services/jwt.service");
const bcrypt = require("bcryptjs");
const { sendOtpMail } = require("../services/mailService");
const { otpTemplate, passwordChangedTemplate } = require("../services/emailTemplates");
const otpVerificationModel = require("../models/otpVerification.model");

const authQuery = async (details) => {
    console.log({ details })
    const { email, password } = details;

    if (!email || !password) {
        return { status: false, statusCode: 400, message: "email and password is required" };
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return { status: false, statusCode: 401, message: "invalid email" };
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        return { status: false, statusCode: 401, message: "invalid password" };
    }

    const accessToken = signAccessToken({ sub: user._id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ sub: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    return {
        status: true,
        statusCode: 200,
        message: "Logged in. Welcome!",
        accessToken,
        refreshToken,
        user
    };
};


const signUpQuery = async (details) => {
    try {
        const { email, password, registrationType } = details;

        const existingUser = await userModel.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return {
                status: false,
                statusCode: 400,
                message: "Email already registered and verified. Try logging in."
            };
        }

        // Fetch OTP entry if exists
        const existingOtp = await otpVerificationModel.findOne({ email });

        if (existingUser && !existingUser.isVerified) {

            // If OTP exists for this user
            if (existingOtp) {
                const otpExpired = existingOtp.otpExpires < Date.now();

                // OTP expired → delete user + OTP → recreate
                if (otpExpired) {
                    await userModel.deleteOne({ email });
                    await otpVerificationModel.deleteOne({ email });

                    // Continue to CREATE new user & OTP below
                } else {
                    return {
                        status: true,
                        statusCode: 200,
                        message: "Try again after 2 min."
                    };
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

        // Create fresh user
        const newUser = await userModel.create({
            email,
            registrationType: [registrationType],
            passwordHash: hashedPassword,
            isVerified: false
        });

        // Create fresh OTP entry
        await otpVerificationModel.create({
            email,
            otpCode: otp,
            otpExpires: Date.now() + 1 * 60 * 1000 // 1 minute
        });

        // Send OTP
        await sendOtpMail({
            to: newUser.email,
            subject: "Your Registration OTP for Verification",
            html: otpTemplate(otp)
        });

        return {
            status: true,
            statusCode: 200,
            message: "User registered successfully. OTP sent to your email.",
            newUser
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const verifyOtpQuery = async (details) => {
    try {
        const { email, otp } = details;

        // 1. Check user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return {
                status: false,
                statusCode: 400,
                message: "User not found. Please register first."
            };
        }

        // 2. Fetch OTP entry
        const otpEntry = await otpVerificationModel.findOne({ email });
        if (!otpEntry) {
            return {
                status: false,
                statusCode: 400,
                message: "OTP not found. Please request a new OTP."
            };
        }

        // 3. Check OTP expiry
        if (otpEntry.otpExpires < Date.now()) {
            await otpVerificationModel.deleteOne({ email }); // delete expired OTP
            return {
                status: false,
                statusCode: 400,
                message: "OTP expired. Please resend OTP."
            };
        }

        // 4. Check OTP code
        if (otpEntry.otpCode !== otp) {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid OTP."
            };
        }

        // 5. OTP verified → Update user + delete OTP record
        await userModel.updateOne(
            { email },
            {
                $set: {
                    isVerified: true,
                    verificationTime: new Date()
                }
            }
        );

        // Remove OTP from OTP collection
        await otpVerificationModel.deleteOne({ email });

        return {
            status: true,
            statusCode: 200,
            message: "Email verified successfully."
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};

const resendOtpQuery = async (details) => {
    try {
        const { email } = details;

        const existingUser = await userModel.findOne({ email });

        // User does not exist
        if (!existingUser) {
            return {
                status: false,
                statusCode: 404,
                message: "User not found. Please register first."
            };
        }



        // Check if OTP record exists for the user
        const existingOtp = await otpVerificationModel.findOne({ email });

        // Case 1: OTP exists
        if (existingOtp) {

            // Check if OTP is expired
            if (existingOtp.otpExpires < Date.now()) {
                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

                existingOtp.otpCode = newOtp;
                existingOtp.otpExpires = Date.now() + 1 * 60 * 1000;
                await existingOtp.save();

                await sendOtpMail({
                    to: email,
                    subject: "Your OTP for Verification",
                    html: otpTemplate(newOtp)
                });

                return {
                    status: true,
                    statusCode: 200,
                    message: "New OTP has been sent to your email."
                };
            }

            // OTP exists & still valid
            return {
                status: false,
                statusCode: 400,
                message: "Your previous OTP is still valid. Please use that."
            };
        }

        // Case 2: No OTP exists in DB → Create a new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await otpVerificationModel.create({
            email,
            otpCode: newOtp,
            otpExpires: Date.now() + 1 * 60 * 1000
        });

        await sendOtpMail({
            to: email,
            subject: "Your OTP for Verification",
            html: otpTemplate(newOtp)
        });

        return {
            status: true,
            statusCode: 200,
            message: "OTP has been sent to your email."
        };

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        };
    }
};



const forgotPasswordQuery = async (details) => {
    try {
        const { email, password } = details;

        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return {
                status: false,
                statusCode: 400,
                message: "User not found. please register first"
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.updateOne(
            { email },
            {
                $set: {
                    passwordHash: hashedPassword,
                }
            }
        );

        await sendOtpMail({
            to: email,
            subject: "Password change Notification",
            html: passwordChangedTemplate()
        })

        return {
            status: true,
            statusCode: 200,
            message: "Password changed Successfully"
        }

    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: error.message
        }
    }
}

module.exports = { authQuery, signUpQuery, verifyOtpQuery, resendOtpQuery, forgotPasswordQuery };
