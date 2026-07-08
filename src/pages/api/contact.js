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

  console.log("Message sent: %s", info.messageId);
  return new Response(null, {
  status: 303,
  headers: { Location: "/messageSent?sent=true" },
});
} catch (err) {
  console.error("Error while sending mail:", err);
   return new Response("Failed to send email", {
        status: 500,
    });
}

}
