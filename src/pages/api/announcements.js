import { configDotenv } from "dotenv";
import pg from "pg";
export const prerender = false;
configDotenv();
  
const { Pool } = pg;
  
// Connects the API to the database to save submissions
export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "zecoat_quotes",
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
  })

  // Creates new instance of annoucement
export async function POST({ request }) {
    const data = await request.json();
    const { title, date, description } = data;

    try {
        if (!title || !date || !description) {
      return new Response(
        JSON.stringify({
          error: "Title, date, and description are required."
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    await pool.query(
      `
      INSERT INTO announcements (
      title,
      date,
      description
      )
      VALUES ($1, $2, $3)
      `, [
        title,
        date,
        description
      ]
    );

     return new Response(
      JSON.stringify({
        message: "Announcement created successfully."
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    } catch (error) {
    console.error("Error creating announcement:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to create announcement."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}

// actually gets the instances of the announcements and put on website
export async function GET() {
    try {
    const result = await pool.query(
      `
      SELECT id, title, date, description
      FROM announcements
      ORDER BY created_at DESC
      LIMIT 3
      `
    );

    return new Response(
      JSON.stringify(result.rows),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    console.error("Error fetching announcements:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch announcements."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}