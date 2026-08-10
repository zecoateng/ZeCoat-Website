import { neon } from "@netlify/neon"

const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function GET() {
    try {
        const result = await sql `
            SELECT * FROM quotes ORDER BY ID DESC`;


    return new Response(
        JSON.stringify(result),
        {
            status: 200,
            headers: {
                "Content-Type": "applications/json"
            }
        }
    )
} catch (err) {
    console.log(err);

    return new Response(
        JSON.stringify({error: "Database error"})
    )
}
}