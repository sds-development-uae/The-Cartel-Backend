const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in", // or "smtp.zoho.com" if you're using Zoho US servers
    port: 587,            // SSL port
    secure: false,         // use SSL
    auth: {
        user: process.env.ZOHO_USER, // your Zoho email
        pass: process.env.ZOHO_PASS  // app password, not normal password
    }
});
/**
 * Send admin notification when new member is created
 * @param {Object} member - Newly created member object
 */
const sendNewMemberMail = async (member) => {
    console.log({ member }, process.env.ZOHO_USER, process.env.ZOHO_PASS)
    try {
        const mailOptions = {
            from: `"The Coin Cartel Community" <${process.env.ZOHO_USER}>`,
            to: process.env.ADMIN_EMAIL_OG, // admin’s email
            subject: `New Member Registered: ${member.email}`,
            html: `
        <h2>New Member Registered 🎉</h2>
        <p><b>Email:</b> ${member.email}</p>
        <p><b>Telegram:</b> ${member.telegramUsername}</p>
        <p><b>Experience:</b> ${member.tradingExperience}</p>
        <p><b>Plan:</b> ${member.plan?.name || "N/A"} ($${member.plan?.price || ""})</p>
        <p><b>Registered At:</b> ${new Date(member.createdAt).toLocaleString()}</p>
        
        <br/>
        <p>Thanks & Regards,</p>
        <p><b>The Coin Cartel Community</b></p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Admin notified about new member");
    } catch (error) {
        console.error("❌ Error sending mail:", error.message);
    }
};


const sendOtpMail = async ({ to, subject, html, text, from }) => {
    try {
        const mailOptions = {
            from: from || `"The Coin Cartel Community Team" <${process.env.ZOHO_USER}>`,
            to,
            subject,
            html,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send email");
    }
};



module.exports = { sendNewMemberMail, sendOtpMail };
