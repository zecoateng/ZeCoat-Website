import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import { getDatabase } from "@netlify/database";
export const prerender = false;
configDotenv();

const sql = (strings, ...values) => getDatabase().sql(strings, ...values);

const transporter = nodemailer.createTransport({
    host: "smtp.resend.com",
    port: 587,
    secure: false,
    auth: {
    user: "resend",
    pass: process.env.SMTP_PASS, // Resend API key
  },
});

// Dimension fields per shape — mirrors the configurator form exactly
const DIMENSION_FIELDS = {
  Round: [["diameter", "Diameter (in)"]],
  Rectangle: [
    ["width", "Width (mm)"],
    ["height", "Height (mm)"],
    ["thickness", "Thickness (mm)"],
  ],
  Hexagon: [
    ["flatToFlat", "Flat-to-Flat (mm)"],
    ["thickness", "Thickness (mm)"],
  ],
  Elliptical: [
    ["length", "Length (in)"],
    ["width", "Width (in)"],
  ],
};

function formatDimensions(config) {
  const fields = DIMENSION_FIELDS[config.shape] || [];
  const parts = fields
    .filter(([key]) => config.dimensions?.[key])
    .map(([key, label]) => `${label}: ${config.dimensions[key]}`);
  return parts.length ? parts.join(", ") : "-";
}

export async function POST({ request }) {
    const data = await request.json();

    const { form, configuration, type } = data;
    const { firstName, lastName, company, email, phone: phoneNumber, comments } = form ?? {};

    let info;

    try {

      if (type === "quote") {

        // Configuration is an array of mirrors (one per mirror added in the form)
        const mirrors = Array.isArray(configuration) ? configuration : [configuration];

        const mirrorsText = mirrors
          .map((c) =>
`Mirror #${c.orderNumber}
  Material:   ${c.material || "-"}
  Shape:      ${c.shape || "-"}
  Dimensions: ${formatDimensions(c)}
  Coating:    ${c.coating || "-"}
  Quantity:   ${c.quantity}
  Notes:      ${c.notes || "None"}`
          )
          .join("\n\n");

        const mirrorsHtml = mirrors
          .map(
            (c) => `
          <div style="border:1px solid #eaecf0;border-radius:10px;background:#f8fafc;padding:6px 20px;margin:0 0 14px;">
            <p style="margin:12px 0 8px;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Mirror #${c.orderNumber}</p>
            <table role="presentation" width="100%">
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;width:120px;">Material</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${c.material || "-"}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;">Shape</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${c.shape || "-"}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;">Dimensions</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${formatDimensions(c)}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;">Coating</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${c.coating || "-"}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;">Quantity</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${c.quantity}</td></tr>
              <tr><td style="padding:5px 0;font-size:13px;color:#94a3b8;">Notes</td><td style="padding:5px 0;font-size:14px;color:#0f172a;font-weight:600;">${c.notes || "None"}</td></tr>
            </table>
          </div>`
          )
          .join("");

        info = await transporter.sendMail({
    from: `"ZeCoat" <${process.env.MAIL_FROM}>`, // sender address
    to: "aquijada@zecoat.com", // list of recipients
    subject: `New Quote Request — ${mirrors.length} mirror${mirrors.length > 1 ? "s" : ""}`, // subject line
      text: `
NEW ZECOAT QUOTE REQUEST

--- Contact ---
Name: ${firstName} ${lastName}
Company: ${company || "-"}
Email: ${email}
Phone: ${phoneNumber || "-"}

--- Configuration (${mirrors.length} mirror${mirrors.length > 1 ? "s" : ""}) ---
${mirrorsText}

--- Additional Comments ---
${comments || "None"}

This request was submitted via the ZeCoat website coating configurator.
  `,

  html: `
<div style="margin:0;padding:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#1E293B;padding:24px 32px;">
          <table role="presentation" width="100%"><tr>
            <td style="font-size:20px;font-weight:700;letter-spacing:1px;color:#ffffff;">ZECOAT</td>
            <td align="right" style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Quote Request</td>
          </tr></table>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:28px 32px 4px;">
          <h1 style="margin:0 0 6px;font-size:20px;color:#0f172a;font-weight:700;">New quote request</h1>
          <p style="margin:0;font-size:14px;color:#64748b;">${mirrors.length} mirror${mirrors.length > 1 ? "s" : ""} submitted via the ZeCoat coating configurator.</p>
        </td></tr>

        <!-- Contact -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Contact</p>
          <table role="presentation" width="100%" style="background:#f8fafc;border:1px solid #eaecf0;border-radius:10px;">
            <tr><td style="padding:16px 20px;">
              <table role="presentation" width="100%">
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;width:90px;">Name</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${email}</a></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Company</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${company || "-"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Phone</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${phoneNumber || "-"}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Configuration -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Configuration</p>
          ${mirrorsHtml}
        </td></tr>

        <!-- Comments -->
        <tr><td style="padding:8px 32px 0;">
          <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Additional Comments</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#475467;">${comments || "None"}</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 32px 32px;">
          <a href="${process.env.URL}/admindashboard" style="background:#1E293B;color:#ffffff;padding:12px 26px;text-decoration:none;border-radius:8px;display:inline-block;font-size:14px;font-weight:600;">Open Admin Dashboard</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f8fafc;border-top:1px solid #eaecf0;padding:18px 32px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Submitted via the ZeCoat website coating configurator.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</div>
  `
});

// Adds the inquiry to the database
await sql
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
  VALUES (
      ${firstName},
      ${lastName},
      ${company},
      ${email},
      ${phoneNumber},
      ${JSON.stringify(configuration)},
      ${comments ?? null}
      )
      `;

} if (type === "general") {
      info = await transporter.sendMail({
    from: `"ZeCoat" <${process.env.MAIL_FROM}>`, // sender address
    to: "aquijada@zecoat.com", // list of recipients
    subject: "New Message", // subject line
      text: `
NEW ZECOAT INQUIRY

Name: ${firstName} ${lastName}
Company: ${company}
Email: ${email}
Phone: ${phoneNumber}

--- Additional Details ---
${comments}

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
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;width:90px;">Name</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Email</td><td style="padding:6px 0;font-size:14px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;font-weight:600;">${email}</a></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Company</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${company}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#94a3b8;">Phone</td><td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600;">${phoneNumber}</td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#475467;">${comments || "None"}</p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 32px 32px;">
          <a href="${process.env.URL}/admindashboard" style="background:#1E293B;color:#ffffff;padding:12px 26px;text-decoration:none;border-radius:8px;display:inline-block;font-size:14px;font-weight:600;">Open Admin Dashboard</a>
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
