/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, type ClientDto, getRelativeTime } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
    if (params.id == "new") {
        return json({});
    }
	const e = await prisma.client.findFirstOrThrow({
        where: {
            id: parseInt(params.id)
        }
    });
    const result: ClientDto = {
        id: e.id,
        active: e.active,
        name: e.name,
        phone: e.phone,
        description: e.description,
        address: e.address,
        devices: JSON.parse(e.devicesJ),
        createdDate: formatTime(e.createdUtc),
        onlineDate: getRelativeTime(e.onlineUtc),
    }
	return json(result);
}

export async function DELETE({ params }) {
    await prisma.client.delete({
        where: {
            id: parseInt(params.id)
        }
    })
	return new Response(null, {
		status: 200,
	});
}