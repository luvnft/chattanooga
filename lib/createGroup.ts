import { pinata } from "./pinata";

async function createGroup() {
	const group = await pinata.groups.create({
		name: "Chattanooga Video Wall",
		isPublic: true,
	});
	console.log(group);
}

createGroup();
