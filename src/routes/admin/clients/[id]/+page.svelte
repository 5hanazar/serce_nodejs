<script lang="ts">
	import { Form, TextInput, Button, Tile, Checkbox, TextArea } from "carbon-components-svelte";
	import type { ClientDto, PostClientDto } from "$lib/server";
    import { afterNavigate, goto } from "$app/navigation";
	export let data: ClientDto;
	if (!Object.keys(data).length)
		data = {
			id: 0,
			active: true,
			name: "",
			phone: "",
            description: "",
			address: "",
			devices: [],
			createdDate: "",
			onlineDate: "",
		};
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
		const body: PostClientDto = {
			id: data.id,
			active: data.active,
			name: data.name,
			phone: data.phone,
            description: data.description,
			address: data.address
		};

        const formData = new FormData();
		formData.append("data", JSON.stringify(body));
		const response = await fetch("/admin/clients", {
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			body: formData,
		});
		if (response.ok) {
			await goto(previousPage, { replaceState: true });
		} else alert("Error " + response.status);
	};
    let previousPage: string = "/admin/clients";
	afterNavigate((navigaton) => {
		previousPage += navigaton.from?.url.search || "";
	});
</script>

<Tile>
	<Form on:submit={submit}>
		<TextInput labelText="Имя" bind:value={data.name} required />
		<TextInput labelText="Телефон" bind:value={data.phone} required />
		<TextInput labelText="Адрес" bind:value={data.address} />
        <TextArea labelText="Описание" bind:value={data.description} maxCount={400} />
		<Checkbox bind:checked={data.active} labelText="Актив" />
		<Button type="submit">Submit</Button>
	</Form>
</Tile>
