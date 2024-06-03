import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getLocalTimestampInSeconds = () => {
    const now = new Date();
	return Math.round((now.getTime() - now.getTimezoneOffset() * 60000) / 1000);
}
async function main() {
	const now = getLocalTimestampInSeconds();
	const user = await prisma.member.create({
		data: {
			active: true,
			username: "admin",
			password: "123",
			name: "Administrator",
			phone: "",
			address: "",
			description: "",
            warehouse: 0,
			createdUtc: now,
            onlineUtc: now
		},
	});
    const client = await prisma.client.create({
        data: {
            active: true,
            name: "sha",
            phone: "987",
            description: "",
            address: "ezizow",
            devicesJ: "[\"tel1\", \"comp1\"]",
            createdUtc: now,
            onlineUtc: now
        }
    })
    const client2 = await prisma.client.create({
        data: {
            active: true,
            name: "rah",
            phone: "234",
            description: "",
            address: "swoboda",
            devicesJ: "[\"tel2\", \"comp2\"]",
            createdUtc: now,
            onlineUtc: now
        }
    })
    const room = await prisma.room.create({
        data: {
            name: "",
            adminClientId: null,
            createdUtc: now
        }
    })
    await prisma.clientAndRoom.create({
        data: {
            clientId: client.id,
            roomId: room.id,
            createdUtc: now
        }
    })
    await prisma.clientAndRoom.create({
        data: {
            clientId: client2.id,
            roomId: room.id,
            createdUtc: now
        }
    })
    await prisma.message.create({
        data: {
            description: "Hello",
            clientId: client2.id,
            roomId: room.id,
            createdUtc: now
        }
    })
    console.log(`A new member was inserted.\nName: ${user.username}\nPassword: ${user.password}`);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});