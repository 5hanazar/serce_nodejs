/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getLocalTimestampInSeconds, notifyClient, type ClientDtoView, type RoomDtoView } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals, params }) {
    const user: ClientDtoView = locals.user

    await prisma.clientAndRoom.findFirstOrThrow({
        where: {
            clientId: user.id,
            roomId: parseInt(params.id)
        }
    })

	const e = await prisma.room.findFirstOrThrow({
        include: {
            adminClient: true,
            clients: {
                include: {
                    client: true
                }
            },
            messages: {
                include: {
                    client: true
                },
                orderBy: {
                    id: 'desc'
                }
            }
        },
        where: {
            id: parseInt(params.id)
        }
    });

	const result: RoomDtoView = {
        id: e.id,
		adminClient: e.adminClient == null ? null : {
            id: e.adminClient.id,
            name: e.adminClient.name,
            phone: e.adminClient.phone,
            description: e.adminClient.description,
            address: e.adminClient.address
        },
        clients: e.clients.map(o => ({
            id: o.client.id,
            name: o.client.name,
            phone: o.client.phone,
            description: o.client.description,
            address: o.client.address
        })),
        messages: e.messages.map(o => ({
            id: o.id,
            description: o.description,
            client: {
                id: o.client.id,
                name: o.client.name,
                phone: o.client.phone,
                description: o.client.description,
                address: o.client.address
            },
            isMine: o.client.id == user.id,
            createdDate: formatTime(o.createdUtc),
        })),
        lastMessage: null,
        createdDate: formatTime(e.createdUtc),
        modifiedDate: formatTime(e.modifiedUtc)
    }

	return json({result});
}

export async function POST({ request, locals, params }) {
    const user: ClientDtoView = locals.user
	const input = Object.fromEntries(await request.formData());
	const body: { description: string } = await JSON.parse(input.data);

    await prisma.clientAndRoom.findFirstOrThrow({
        where: {
            clientId: user.id,
            roomId: parseInt(params.id)
        }
    })
    await prisma.message.create({
        data: {
            description: body.description,
            clientId: user.id,
            roomId: parseInt(params.id),
            createdUtc: getLocalTimestampInSeconds()
        },
    })
    await prisma.room.update({
        data: {
            modifiedUtc: getLocalTimestampInSeconds()
        },
        where: {
            id: parseInt(params.id)
        }
    })

    const buf = await prisma.clientAndRoom.findMany({
        where: {
            roomId: parseInt(params.id),
            clientId: {
                not: user.id
            }
        }
    })
    buf.forEach(e => {
        notifyClient(e.clientId, user.id, body.description)
    })

	return new Response("", {
		status: 200,
	});
}

export async function DELETE({ params }) {
    await prisma.message.deleteMany({
        where: {
            roomId: parseInt(params.id)
        }
    })
    await prisma.clientAndRoom.deleteMany({
        where: {
            roomId: parseInt(params.id)
        }
    })
    await prisma.room.delete({
        where: {
            id: parseInt(params.id)
        }
    })
	return new Response(null, {
		status: 200,
	});
}