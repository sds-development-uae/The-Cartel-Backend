const otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 30px;">
      <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <h2 style="text-align: center; color: #333; margin-bottom: 10px;">
          🔐 Email Verification
        </h2>
        <p style="text-align: center; color: #555; margin-top: 0;">
          Please use the OTP below to verify your email.
        </p>

        <!-- OTP Box -->
        <div style="margin: 25px 0; text-align: center;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #2d7df4; padding: 12px 0;">
            ${otp}
          </div>
          <p style="color: #777; font-size: 14px; margin-top: 5px;">
            This OTP is valid for <b>1 minute</b>.
          </p>
        </div>

        <!-- Info Text -->
        <p style="color: #444; line-height: 1.6; font-size: 15px;">
          If you didn't request this email, you can safely ignore it.  
          Your account will remain secure.
        </p>

        <!-- Footer -->
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 25px;">
          © ${new Date().getFullYear()} The Coin Cartel — All Rights Reserved.
        </p>

      </div>
    </div>
  `;
};


const passwordChangedTemplate = () => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Changed</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 500px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.08);
            }
            h2 {
                color: #333333;
                margin-bottom: 10px;
            }
            p {
                color: #555555;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                margin-top: 25px;
                font-size: 12px;
                color: #888888;
            }
            .btn {
                display: inline-block;
                background-color: #4f46e5;
                color: #ffffff !important;
                padding: 10px 18px;
                border-radius: 6px;
                margin-top: 20px;
                text-decoration: none;
                font-weight: bold;
            }
            .warning-box {
                background: #fff8e6;
                border-left: 4px solid #f5a623;
                padding: 12px 15px;
                margin-top: 20px;
                border-radius: 6px;
            }
        </style>
    </head>
    <body>

    <div class="container">
        <h2>Password Changed Successfully</h2>

        <p>Hello,</p>

        <p>This is to notify you that your <strong>account password has been changed</strong> successfully.</p>

        <div class="warning-box">
            <p>If you did not perform this action, please reset your password immediately and secure your account.</p>
        </div>

        
        <p class="footer">If you need help, please contact our support team.</p>
        </div>
        
        </body>
        </html>
        `;
};

// <a href="#" class="btn">Secure My Account</a>


const publisherRequestTemplate = (data) => {
  const {
    accountType,
    fullName,
    organizationName,
    phoneNumber,
    countryCode,
    telegramUsername,
    website,
    description,
    profileLink,
    userEmail,
    createdAt
  } = data;

  const dashboardUrl = `${process.env.ADMIN_DASHBOARD_URL}/publishers`;

  return `
    <div style="font-family: Arial, sans-serif; background-color: #0d0d0d; color: #e6e6e6; padding: 20px; border-radius: 10px;">
      
      <h2 style="color: #d4af37;">📢 New Publisher Request</h2>
      <p>A new publisher application has been submitted on <b>The Coin Cartel</b>.</p>

      <h3 style="color: #ff3b3b;">Applicant Details:</h3>
      <ul>
        <li><b>Account Type:</b> ${accountType}</li>
        <li><b>Name:</b> ${accountType === "individual" ? fullName : organizationName}</li>
        <li><b>Email:</b> ${userEmail}</li>
        <li><b>Phone:</b> ${countryCode} ${phoneNumber}</li>
        <li><b>Telegram:</b> ${telegramUsername || "N/A"}</li>
      </ul>

      <h3 style="color: #ff3b3b;">Publisher Information:</h3>
      <ul>
        <li><b>Website:</b> ${website || "N/A"}</li>
        <li><b>Profile Link:</b> ${profileLink || "N/A"}</li>
        <li><b>Description:</b> ${description || "N/A"}</li>
        <li><b>Submitted At:</b> ${new Date(createdAt).toLocaleString()}</li>
      </ul>

      <p>
        👉 <a href="${dashboardUrl}" style="color: #d4af37; text-decoration: none; font-weight: bold;">Open Publisher Dashboard</a>
      </p>

      <br/>
      <p>Kind regards,</p>
      <p><b>The Coin Cartel Admin System</b></p>
    </div>
  `;
};


const publisherConfirmationTemplate = (data) => {
  const { fullName, organizationName, accountType } = data;

  const displayName = accountType === "individual" ? fullName : organizationName;

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; color: #333;">
      <h2 style="color: #2b6cb0;">🎉 Your Publisher Request Has Been Submitted!</h2>

      <p>Hi <b>${displayName}</b>,</p>

      <p>
        Thank you for submitting your publisher application on 
        <b>The Coin Cartel</b>.
      </p>

      <p>
        Our team will review your request and notify you shortly.  
        This typically takes <b>24–48 hours</b>.
      </p>

      <p>If we need more details, we will contact you via email.</p>

      <br/>
      <p>Regards,</p>
      <p><b>The Coin Cartel Team</b></p>
    </div>
  `;
};


const publisherRejectedEmailTemplate = ({
  userName,
  website,
  reason,
  company
}) => {
  const year = new Date().getFullYear();

  return `
     <div style="font-family: Arial, sans-serif; background:#0d0d0d; color:#f5f5f5; padding:20px; border-radius:8px;">
        <h2 style="color:#ff4b4b;">Website Verification Rejected</h2>

        <p>Hi <b>${userName}</b>,</p>

        <p>
            We reviewed your website submission for the publisher program:
        </p>

        <p style="background:#1a1a1a; padding:10px; border-left:4px solid #ff4b4b;">
            <b>Website:</b> ${website} <br />
            <b>Reason:</b> ${reason}
        </p>

        <p>
            Unfortunately, your website does not meet our current publisher guidelines.
            You can update your information and submit the publisher form again anytime.
        </p>

        <p>Regards,<br /><b>The Coin Cartel Team</b></p>
    </div>
    `;
};

const publisherVerifiedEmailTemplate = ({
  userName,
  website,
  company
}) => {
  const year = new Date().getFullYear();

  return `
    <div style="font-family: Arial, sans-serif; background:#ffffff; color:#333; padding:20px; border-radius:8px; border:1px solid #e6e6e6;">
        <h2 style="color:#28a745;">Website Verification Successful</h2>

        <p>Hi <b>${userName}</b>,</p>

        <p>
            Great news! Your website has been successfully verified for our publisher program.
        </p>

        <p style="background:#f7f7f7; padding:10px; border-left:4px solid #28a745;">
            <b>Website:</b> ${website} <br />
            <b>Status:</b> Verified ✔
        </p>

        <p>
            You are now eligible to access all publisher features, submit campaigns, 
            and collaborate with <b>The Coin Cartel</b>.
        </p>

        <p>
           We're excited to have you onboard and look forward to working with you!
        </p>

        <p>Regards,<br /><b>The Coin Cartel Team</b></p>
    </div>
  `;
};


module.exports = {
  otpTemplate,
  passwordChangedTemplate,
  publisherRequestTemplate,
  publisherConfirmationTemplate,
  publisherRejectedEmailTemplate,
  publisherVerifiedEmailTemplate
}