/** @type {import('./$types').RequestHandler} */
import prisma from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET() {
	const members = await prisma.member.findMany();
	return json(members);
}