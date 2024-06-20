// place files you want to import through the `$lib` alias in this folder.
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default prisma;

import { connect } from 'mqtt';
const mqtt = connect("mqtt://localhost", { username: '', password: '' });
mqtt.on('connect', () => {
    console.log('MQTT Connected');
});
mqtt.on('close', function() {
    console.log("MQTT Disconnected")
})
export const notifyClient = (receiverId: number, senderId: number, message: string) => {
	mqtt.publish(`client${receiverId}`, message);
};

export const filePath = "C:/Users/User/Documents/shapro/svkit/serce/static/images"
export const filePathUploads = "C:/Users/User/Documents/shapro/svkit/serce/static/uploads"
//export const filePath = "/var/www/html/images"
//export const filePathUploads = "/var/www/html/uploads"

export const getLocalTimestampInSeconds = () => {
	const now = new Date();
	return Math.round(now.getTime() / 1000);
};
export const getRelativeTime = (timestamp: number): string => {
	const timeDifferenceInSeconds = Math.floor(getLocalTimestampInSeconds() - timestamp);
	const intervals = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
	};
	for (const interval in intervals) {
		const numberOfUnits = Math.floor(timeDifferenceInSeconds / intervals[interval]);
		if (numberOfUnits >= 1) {
			return `${numberOfUnits} ${interval}${numberOfUnits > 1 ? "s" : ""} ago`;
		}
	}
	return "just now";
};
export const formatTime = (time: number): string => {
	const today = new Date((time + 18000) * 1000);
	const yyyy = today.getFullYear();
	const mm = today.getMonth() + 1;
	const dd = today.getDate();
	const hh = today.getHours();
	const m = today.getMinutes();

	let smm = mm.toString();
	let sdd = dd.toString();
	let shh = hh.toString();
	let sm = m.toString();

	if (mm < 10) smm = "0" + mm;
	if (dd < 10) sdd = "0" + dd;
	if (hh < 10) shh = "0" + hh;
	if (m < 10) sm = "0" + m;
	return sdd + "." + smm + "." + yyyy + " " + shh + ":" + sm;
};
export type ClientDto = {
	id: number;
	active: boolean;
	name: string;
	phone: string;
    description: string;
	address: string;
	devices: string[];
	createdDate: string;
	onlineDate: string;
};
export type PostClientDto = {
	id: number;
	active: boolean;
	name: string;
	phone: string;
    description: string;
	address: string;
};
export type ClientDtoView = {
    id: number;
	name: string;
	phone: string;
    description: string;
	address: string;
}
export type FileDto = {
	id: string;
    time: number;
	size: string;
};
export type Paged<T> = {
	count: number;
	data: T[];
	size: number;
	pageIndex: number;
};

export type RoomDtoView = {
	id: number;
	adminClient: ClientDtoView | null;
	clients: ClientDtoView[];
    messages: MessageDtoView[];
    lastMessage: string | null;
	createdDate: string;
    modifiedDate: string;
};
export type MessageDtoView = {
	id: number;
	description: string;
	client: ClientDtoView;
    isMine: boolean;
	createdDate: string;
};