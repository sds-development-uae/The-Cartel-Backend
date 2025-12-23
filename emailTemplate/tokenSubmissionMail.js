/**
 * Generate admin email HTML for new token submission
 * @param {Object} tokenData
 * @returns {string} HTML email template
 */
const tokenSubmissionTemplate = (tokenData) => {
  const {
    userType,
    name,
    email,
    telegram,
    tokenName,
    tokenSymbol,
    description,
    website,
    plan,
    pdfFileUrl,
    createdAt,
  } = tokenData;

  const dashboardUrl = `${process.env.ADMIN_DASHBOARD_URL}/token-submissions`; // set in env

  return `
  <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #e6e6e6; padding: 20px; border-radius: 10px;">
    <h2 style="color: #d4af37;">🪙 New Token Submission Received</h2>
    <p>A new token submission has been made through <b>The Coin Cartel</b> platform.</p>

    <h3 style="color: #ff3b3b;">Submitter Details:</h3>
    <ul>
      <li><b>User Type:</b> ${userType}</li>
      <li><b>Name:</b> ${name}</li>
      <li><b>Email:</b> ${email}</li>
      <li><b>Telegram:</b> ${telegram}</li>
    </ul>

    <h3 style="color: #ff3b3b;">Token Information:</h3>
    <ul>
      <li><b>Token Name:</b> ${tokenName}</li>
      <li><b>Symbol:</b> ${tokenSymbol}</li>
      <li><b>Description:</b> ${description}</li>
      <li><b>Website:</b> ${website || "N/A"}</li>
      <li><b>Plan:</b> ${plan}</li>
      <li><b>Uploaded PDF:</b> ${pdfFileUrl
      ? `<a href="${pdfFileUrl}" style="color:#d4af37;">View PDF</a>`
      : "No file attached"
    }</li>
      <li><b>Submitted At:</b> ${new Date(createdAt).toLocaleString()}</li>
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

module.exports = { tokenSubmissionTemplate };
