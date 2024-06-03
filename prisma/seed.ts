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
    await prisma.client.create({
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