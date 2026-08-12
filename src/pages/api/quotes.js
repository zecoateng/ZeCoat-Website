import { getDatabase } from "@netlify/database";

const sql = (strings, ...values) => getDatabase().sql(strings, ...values);
export const prerender = false

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