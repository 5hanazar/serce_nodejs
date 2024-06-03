/** @type {import('./$types').PageServerLoad} */
import type { Member } from '@prisma/client';
import { error } from '@sveltejs/kit';

export async function load({ url, fetch, locals }) {
    const user: Member = locals.user
    const res = await fetch(url.pathname)    
    if (res.ok) {
        const allMembers: Member[] = await res.json()
        return { user, allMembers }
    }
    throw error(res.status)
}