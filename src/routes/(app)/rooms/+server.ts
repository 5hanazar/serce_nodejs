/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getLocalTimestampInSeconds, type ClientDtoView, type RoomDtoView } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ locals }) {
    const user: ClientDtoView = locals.user

    const roomIds = (await prisma.clientAndRoom.findMany({
        select: {
            roomId: true
        },
        where: {
            clientId: user.id,
        }
    })).map(e => e.roomId)
	const buf = await prisma.room.findMany({
        include: {
            adminClient: true,
            clients: {
                include: {
                    client: true
                }
            }
        },
        where: {
            id: {
                in: roomIds
            }
        },
        orderBy: {
            modifiedUtc: 'desc'
        }
    });

    const result: RoomDtoView[] = await Promise.all(buf.map(async (e) => {
        const lastMessage = await prisma.message.findFirst({
            where: {
                roomId: e.id
            },
            orderBy: {
                id: 'desc'
            }
        });
		return {
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
            messages: [],
            lastMessage: lastMessage?.description ?? null,
            createdDate: formatTime(e.createdUtc),
            modifiedDate: formatTime(e.modifiedUtc)
		};
	}));

	return json({user, result});
}

export async function POST({ request, locals }) {
    const user: ClientDtoView = locals.user
	const input = Object.fromEntries(await request.formData());
	const body: { phone: string } = await JSON.parse(input.data);

    const client = await prisma.client.findFirstOrThrow({
        where: {
            phone: body.phone
        }
    })

    const room = await prisma.room.create({
        data: {
            name: "",
            createdUtc: getLocalTimestampInSeconds(),
            modifiedUtc: getLocalTimestampInSeconds()
        },
    })
    await prisma.clientAndRoom.create({
        data: {
            clientId: user.id,
            roomId: room.id,
            createdUtc: getLocalTimestampInSeconds()
        },
    })
    await prisma.clientAndRoom.create({
        data: {
            clientId: client.id,
            roomId: room.id,
            createdUtc: getLocalTimestampInSeconds()
        },
    })

	return new Response("", {
		status: 200,
	});
}