/** @type {import('./$types').RequestHandler} */
import prisma, { formatTime, getRelativeTime, getLocalTimestampInSeconds, type ClientDto, type Paged, type PostClientDto } from "$lib/server";
import { json } from "@sveltejs/kit";

export async function GET({ url }) {
    const pageIndex = parseInt(url.searchParams.get('p') || '1')
    const size = parseInt(url.searchParams.get('s') || '20')
    const query = url.searchParams.get('q') || ''
    const ordQ = !url.searchParams.get('o') ? ['id', 'desc'] : url.searchParams.get('o')!.split(';')
    ordQ[1] = ordQ[1] == 'ascending' ? 'asc' : 'desc'
    
    let where = undefined
    if (query != '') {
        where = {
            name: {
                contains: query
            }
        }
    }  

    let orderBy: any = {}
    orderBy[ordQ[0]] = ordQ[1] 

	const clients = await prisma.client.findMany({
        skip: (pageIndex - 1) * size,
        take: size,
        where,
        orderBy
    });
    const count = await prisma.client.count({
        where
    })

	const data: ClientDto[] = clients.map((e) => {
		return {
			id: e.id,
			active: e.active,
			name: e.name,
			phone: e.phone,
            description: e.description,
			address: e.address,
			devices: JSON.parse(e.devicesJ),
			createdDate: formatTime(e.createdUtc),
			onlineDate: getRelativeTime(e.onlineUtc),
		};
	});

    const result: Paged<ClientDto> = {
        count, data, size, pageIndex
    }
	return json(result);
}

export async function POST({ request }) {
	const input = Object.fromEntries(await request.formData());
	const body: PostClientDto = await JSON.parse(input.data);

	if (body.id == 0)
        body.id = (
            await prisma.client.create({
                data: {
                    active: body.active,
                    name: body.name,
                    phone: body.phone,
                    description: body.description,
                    address: body.address,
                    devicesJ: JSON.stringify([]),
                    createdUtc: getLocalTimestampInSeconds(),
                    onlineUtc: getLocalTimestampInSeconds(),
                },
            })
        ).id;
	else
		await prisma.client.update({
			data: {
				active: body.active,
				name: body.name,
				phone: body.phone,
                description: body.description,
				address: body.address,
			},
			where: {
				id: body.id,
			},
		});
	return new Response(body.id.toString(), {
		status: 200,
	});
}
