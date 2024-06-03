import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import prisma, { getLocalTimestampInSeconds, type ClientDtoView } from "$lib/server";
import { PRIVATE_KEY } from "$env/static/private";
import type { Client } from "@prisma/client";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const p = event.url.pathname;
	const myCookie = cookie.parse(event.request.headers.get("cookie") || "");
	if (p.startsWith("/admin")) {
        const user: { username: string; password: string; } | null = await decrypt(myCookie.serce_panel_user);
		if (p == "/admin/login") {
			if (user != null) {
				const buf = await prisma.member.findFirst({
					where: {
						username: user.username,
                        password: user.password
					},
				});
				if (buf != null) return new Response("Redirect", { status: 303, headers: { Location: "/admin" } });
			}
		} else {
            if (p == "/admin/test") {
                //let v = JSON.stringify(await decrypt(myCookie.serce_user))
                return new Response("Your cookie: " + JSON.stringify(myCookie), { status: 200 });
            }
			if (user == null) return new Response("Redirect", { status: 303, headers: { Location: "/admin/login" } });
			else {
				const buf = await prisma.member.findFirst({
					where: {
						username: user.username,
                        password: user.password
					},
				});
				if (buf != null) {
					await prisma.member.update({
						data: {
							onlineUtc: getLocalTimestampInSeconds(),
						},
						where: {
							id: buf.id,
						},
					});
					event.locals.user = buf;
				} else return new Response("Redirect", { status: 303, headers: { Location: "/admin/login" } });
			}
		}
	} else if (!p.startsWith("/images") && !p.startsWith("/uploads") && !p.startsWith("/login")) {
        let user: { id: number; phone: string } | null = await decrypt(myCookie.serce_user)
        event.locals.lang = parseInt(myCookie.l || '1') - 1
        if (user == null) {
            return new Response("Redirect", { status: 303, headers: { Location: "/login" } });
        } else {
            const client = await prisma.client.findFirst({
                where: {
                    id: user.id,
                    phone: user.phone,
                    active: true
                }
            });
            if (client == null) {
                return new Response("Redirect", { status: 303, headers: { Location: "/login" } });
            } else {
                const now = getLocalTimestampInSeconds();
                await prisma.client.update({
                    data: {
                        onlineUtc: now,
                    },
                    where: {
                        id: client.id,
                    },
                });
                event.locals.user = parseClient(client);
            }
        }
    }
	const response = await resolve(event);
	return response;
}
const decrypt = (token: any, drop = false) =>
	new Promise<any>(async (resolve, reject) => {
		if (token == undefined) {
			if (drop) reject(401);
			else resolve(null);
		} else {
			jwt.verify(token, PRIVATE_KEY, (err: any, v: any) => {
				if (err) {
					if (drop) reject(401);
					else resolve(null);
				} else resolve(v);
			});
		}
	});
const parseClient = (e: Client): ClientDtoView => {
	return {
        id: e.id,
        name: e.name,
        phone: e.phone,
        description: e.description,
        address: e.address
    }
};