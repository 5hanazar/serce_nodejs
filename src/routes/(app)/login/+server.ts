import prisma from "$lib/server";
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '$env/static/private'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const json: { name: string; phone: string } = await request.json();
    const buf = await prisma.client.findUnique({
        where: {
            name: json.name,
            phone: json.phone
        }
    })
    if (buf == null) return new Response(null, { status: 401 });
    let user: { id: number; phone: string } = { id: buf.id, phone: buf.phone }
    const token = jwt.sign(JSON.stringify(user), PRIVATE_KEY)
	return new Response(token, {
        headers: {
            'Set-Cookie': `serce_user=${token};path=/;SameSite=None;Secure`
        },
        status: 200
    });
}