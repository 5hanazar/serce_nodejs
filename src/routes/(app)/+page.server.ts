/** @type {import('./$types').PageServerLoad} */
import type { Member } from '@prisma/client';

export async function load({ locals }) {
    const user: Member = locals.user
    return { user }
}