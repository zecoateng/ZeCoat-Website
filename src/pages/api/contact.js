import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
export const prerender = false;
configDotenv();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //find out who hosts zecoat email
    port: 587,
    secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST({ request }) {
    const data = await request.json();

    const { form, configuration } = data;

    try {
  const info = await transporter.sendMail({
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

    <h3>Notes</h3>
    <p>${configuration.notes || "None"}</p>
  `
});

  console.log("Message sent: %s", info.messageId);
  return new Response(null, {
  status: 303,
  headers: { Location: "/messageSent?sent=true" },
});
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
   return new Response("Failed to send email", {
        status: 500,
    });
}

}
