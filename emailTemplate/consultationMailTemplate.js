/**
 * Generate admin email HTML for new consultation request
 * @param {Object} consultationData
 * @returns {string} HTML email template
 */
const consultationTemplate = (consultationData) => {
    const { name, email, telegram, topic, message, createdAt } = consultationData;

    const dashboardUrl = `${process.env.ADMIN_DASHBOARD_URL}/consultations`; // set in .env

    return `
  <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #e6e6e6; padding: 20px; border-radius: 10px;">
    <h2 style="color: #d4af37;">💬 New Consultation Request</h2>
    <p>A new consultation request has been submitted via <b>The Coin Cartel</b> platform.</p>

    <h3 style="color: #ff3b3b;">User Details:</h3>
    <ul>
      <li><b>Name:</b> ${name}</li>
      <li><b>Email:</b> ${email}</li>
      <li><b>Telegram:</b> ${telegram || "N/A"}</li>
    </ul>

    <h3 style="color: #ff3b3b;">Consultation Information:</h3>
    <ul>
      <li><b>Topic:</b> ${topic}</li>
      <li><b>Message:</b> ${message || "No message provided"}</li>
      <li><b>Requested At:</b> ${new Date(createdAt).toLocaleString()}</li>
    </ul>

    <p>
      👉 <a href="${dashboardUrl}" style="color: #d4af37; text-decoration: none; font-weight: bold;">Open Admin Dashboard</a>
    </p>

    <br/>
    <p>Kind regards,</p>
    <p><b>The Coin Cartel Admin System</b></p>
  </div>
  `;
};

module.exports = { consultationTemplate };
