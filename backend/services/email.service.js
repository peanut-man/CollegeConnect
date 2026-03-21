const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

const sendEventNotification = async (user, event) => {
  const subject = `New Event: ${event.title}`;
  const text = `
Hello ${user.name},

A new event has been created at your college!

Event: ${event.title}
Category: ${event.category}
Date: ${new Date(event.eventDate).toLocaleDateString()}
Time: ${event.eventTime}

Description:
${event.description}

${event.externalLink ? `More info: ${event.externalLink}` : ""}

Best regards,
College Connect Team
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9fafb; }
    .event-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .label { font-weight: bold; color: #4F46E5; }
    .btn { display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Event Alert!</h1>
    </div>
    <div class="content">
      <p>Hello ${user.name},</p>
      <p>A new event has been created at your college!</p>
      <div class="event-details">
        <p><span class="label">Event:</span> ${event.title}</p>
        <p><span class="label">Category:</span> ${event.category}</p>
        <p><span class="label">Date:</span> ${new Date(event.eventDate).toLocaleDateString()}</p>
        <p><span class="label">Time:</span> ${event.eventTime}</p>
        <p><span class="label">Description:</span></p>
        <p>${event.description}</p>
      </div>
      ${event.externalLink ? `<p><a href="${event.externalLink}" class="btn">Learn More</a></p>` : ""}
      <p>Best regards,<br>College Connect Team</p>
    </div>
  </div>
</body>
</html>
`;

  return sendEmail(user.email, subject, text, html);
};

module.exports = {
  sendEmail,
  sendEventNotification,
};
