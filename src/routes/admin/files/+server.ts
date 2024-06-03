/** @type {import('./$types').RequestHandler} */
import { json } from "@sveltejs/kit";
import fs from 'fs';
import { exec } from "child_process";
import { filePathUploads as filePath, type FileDto } from "$lib/server";

export async function GET({ url }) {
    const files = fs.readdirSync(filePath, { withFileTypes: true })
        //.filter(item => !item.isDirectory())
        .map(item => item.name)
    const result: FileDto[] = files.map(function (fileName) {
        const e = fs.statSync(`${filePath}/${fileName}`)
        return {
            id: fileName,
            time: parseInt(e.mtime.getTime() / 1000),
            size: e.isDirectory() ? 'Folder' : parseInt(e.size / 1024) + ' Kb'
        };
    }).sort(function (a, b) {
        return b.time - a.time;
    })
	return json({result});
}
export async function POST({ request }) {
    const input = await request.formData();
    const file = Object.fromEntries(input).myFile
    const buffer = await file.arrayBuffer()
    fs.writeFileSync(`${filePath}/${file.name}`, new DataView(buffer))
	return new Response(null, {
		status: 200,
	});
}
export async function PUT({ request }) {
    const fileName = await request.text();
	return new Response(null, {
		status: (await shell(`sudo unzip ${filePath}/${fileName} -d ${filePath}`))
	});
}
export async function DELETE({ request }) {
    const fileName = await request.text();
    const e = fs.statSync(`${filePath}/${fileName}`)
    if (e.isDirectory()) fs.rmSync(`${filePath}/${fileName}`, {recursive: true});
    else fs.unlinkSync(`${filePath}/${fileName}`)
	return new Response(null, {
		status: 200,
	});
}

const shell = (cmd: string) => new Promise<number>((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`EXEC error: ${error}`);
            resolve(501)
        } else if (stderr) {
            console.error(`EXEC stderr: ${stderr}`);
            resolve(503)
        } else resolve(200)
    });
});