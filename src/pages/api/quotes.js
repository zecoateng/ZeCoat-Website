import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "zecoat_quotes",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
});

export async function GET() {
    try {
        const result = await pool.query (
            "SELECT * FROM quotes ORDER BY ID DESC"
        );

    return new Response(
        JSON.stringify(result.rows),
        {
            status: 200,
            headers: {
                "Content-Type": "applications/json"
            }
        }
    )
} catch (err) {
    console.log(error);

    return new Response(
        JSON.stringify({error: "Database error"})
    )
}
}