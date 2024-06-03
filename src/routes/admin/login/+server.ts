/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '$env/static/private'

export async function POST({ request }) {
    const user = await request.json();
    const buf = await prisma.member.findUnique({
        where: {
            username: user.username
        }
    })
    if (!(buf != null && buf.password == user.password)) return new Response(null, { status: 401 });
    const token = jwt.sign(JSON.stringify(user), PRIVATE_KEY)
	return new Response(`serce_panel_user=${token}`, {
        headers: {
            'Set-Cookie': `serce_panel_user=${token};path=/;SameSite=None;Secure`
        },
        status: 200
    });
}