import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import pg from "pg";
export const prerender = false;
configDotenv();

const { Pool } = pg;

//Connects the API to the database to save submissions
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "zecoat_quotes",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
})

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //find out who hosts zecoat email
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const quote = () => {
  return 5;
}

export async function POST({ request }) {
    const data = await request.json();

    const { form, configuration, type } = data;

    let info;

    try {

      if (type === "quote") {
        info = await transporter.sendMail({
    from: `"ZeCoat" <${process.env.SMTP_USER}>`, // sender address
    to: "aquijada@zecoat.com", // list of recipients
    subject: "New Quote", // subject line
      text: `
NEW ZECOAT INQUIRY

Name: ${form.firstName} ${form.lastName}
Company: ${form.company}
Email: ${form.email}
Phone: ${form.phone}

--- Additional Details ---
${form.comments}

This message was submitted via the ZeCoat website contact form.
  `,

  html: `
    <h2>New Quote Request</h2>

    <h3>Contact Info</h3>
    <p><b>Name:</b> ${form.firstName} ${form.lastName}</p>
    <p><b>Email:</b> ${form.email}</p>
    <p><b>Company:</b> ${form.company}</p>
    <p><b>Phone:</b> ${form.phone}</p>

    <hr />

    <h3>Configuration</h3>
    <p><b>Material:</b> ${configuration.material}</p>
    <p><b>Shape:</b> ${configuration.shape}</p>
    <p><b>Coating:</b> ${configuration.coating}</p>
    <p><b>Quantity:</b> ${configuration.quantity}</p>

    <h4>Size</h4>
    <ul>
      <li>Width: ${configuration.size?.width || "-"}</li>
      <li>Height: ${configuration.size?.height || "-"}</li>
      <li>Diameter: ${configuration.size?.diameter || "-"}</li>
      <li>Thickness: ${configuration.size?.thickness || "-"}</li>
    </ul>

  <h4>Total Price: ${quote()}</h4>

    <h3>Notes</h3>
    <p>${configuration.notes || "None"}</p>

      <p>
    <a
      href="http://localhost:4321/admindashboard"
      style="
        background:#1E293B;
        color:white;
        padding:12px 18px;
        text-decoration:none;
        border-radius:8px;
        display:inline-block;
      "
    >
      Open Admin Dashboard
    </a>
  </p>
  `
});

// Adds the inquiry to the database
await pool.query(
  `
  INSERT INTO quotes (
  first_name,
  last_name,
  company,
  email,
  phone,
  configuration,
  notes
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [
    form.firstName,
    form.lastName,
    form.company,
    form.email,
    form.phone,
    JSON.stringify(configuration),
    configuration.notes || form.comments
  ]
);
} if (type === "general") {
      info = await transporter.sendMail({
    from: `"ZeCoat" <${process.env.SMTP_USER}>`, // sender address
    to: "aquijada@zecoat.com", // list of recipients
    subject: "New Message", // subject line
      text: `
NEW ZECOAT INQUIRY

Name: ${form.firstName} ${form.lastName}
Company: ${form.company}
Email: ${form.email}
Phone: ${form.phone}

--- Additional Details ---
${form.comments}

This message was submitted via the ZeCoat website contact form.
  `,

  html:  `
<div style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#1E293B;padding:24px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:20px;font-weight:700;letter-spacing:1px;color:#ffffff;">ZECOAT</td>
            <td align="right" style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">General Inquiry</td>
          </tr></table>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:28px 32px 4px;">
          <h1 style="margin:0 0 6px;font-size:20px;color:#0f172a;font-weight:700;">New general inquiry</h1>
          <p style="margin:0;font-size:14px;color:#64748b;">Submitted via the ZeCoat website.</p>
        </td></tr>

        <!-- Contact -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Contact</p>
          <table role="presentation" width="100%" style="background:#f8fafc;border:1px solid #eaecf0;border-radius:10px;">
            <tr><td style="padding:16px 20px;">
              <table role="presentation" width="100%">
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;width:90px;">Name</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${form.firstName} ${form.lastName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${form.email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${form.email}</a></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Company</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${form.company}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Phone</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${form.phone}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#475467;">${form.comments || "None"}</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 32px 32px;">
          <a href="http://localhost:4321/admindashboard" style="background:#1E293B;color:#ffffff;padding:12px 26px;text-decoration:none;border-radius:8px;display:inline-block;font-size:14px;font-weight:600;">Open Admin Dashboard</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;border-top:1px solid #eaecf0;padding:18px 32px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Submitted via the ZeCoat website contact form.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
`
});
}
  

  console.log("Message sent: %s", info.messageId);
  return new Response(
  JSON.stringify({ success: true }),
  {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  }
);
} catch (err) {
  console.error("Error while sending mail:", err);
   return new Response("Failed to send email", {
        status: 500,
    });
}

}
