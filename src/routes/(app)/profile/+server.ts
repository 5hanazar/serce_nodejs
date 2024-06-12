/** @type {import('./$types').RequestHandler} */
import type { ClientDtoView } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
    const result: ClientDtoView = locals.user
	return json({result});
}