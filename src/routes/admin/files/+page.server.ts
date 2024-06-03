import type { FileDto } from "$lib/server";
import { error } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, fetch }) {
    const res = await fetch(url.href)
    if (res.ok) {
        const result: {result: FileDto[]} = await res.json()
        return result
    }
    throw error(res.status)
}