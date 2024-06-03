/** @type {import('./$types').PageServerLoad} */
import type { ClientDtoView } from '$lib/server';

export async function load({ locals }) {
    const user: ClientDtoView = locals.user
    return { user }
}