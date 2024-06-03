<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { DataTable, OverflowMenu, OverflowMenuItem, Toolbar, ToolbarContent, FileUploaderButton, Pagination } from "carbon-components-svelte";
	export let data;
	const destroy = async (id: string) => {
		loading = true;
		const response = await fetch(`/admin/files`, {
			method: "DELETE",
			headers: {
				"Content-Type": "text/plain",
				Accept: "application/json",
			},
			body: id,
		});
		loading = false;
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const unzip = async (id: string) => {
		loading = true;
		const response = await fetch(`/admin/files`, {
			method: "PUT",
			headers: {
				"Content-Type": "text/plain",
				Accept: "application/json",
			},
			body: id,
		});
		loading = false;
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const headers = [
		{ key: "id", value: "Id" },
		{ key: "time", value: "Time" },
		{ key: "size", value: "Size" },
		{ key: "overflow", empty: true },
	];
	let loading = false;
	const add = async (event: CustomEvent<readonly File[]>) => {
		const myFiles = event.detail;
		if (data.result.find((e) => e.id == myFiles[0].name)) {
			alert("File already exists");
			return;
		}
		loading = true;
		const fromData = new FormData();
		fromData.append("myFile", myFiles[0]);
		const response = await fetch("/admin/files", {
			method: "POST",
			body: fromData,
		});
		loading = false;
		if (response.ok) await invalidateAll();
		else alert("Could not upload");
	};
	const formatTime = (time: number): String => {
		const today = new Date(time * 1000);
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
</script>

<DataTable {headers} rows={data.result}>
	<svelte:fragment slot="cell" let:row let:cell>
		{#if cell.key == "overflow"}
			{#if !row.id.startsWith("c1_")}
				<OverflowMenu flipped>
					{#if row.size != "Folder"}
						<OverflowMenuItem href="/uploads/{row.id}" text="Download" />
					{/if}
					{#if row.id.endsWith(".zip")}
						<OverflowMenuItem danger text="Unzip" on:click={() => unzip(row.id)} />
					{/if}
					<OverflowMenuItem danger text="Delete" on:click={() => destroy(row.id)} />
				</OverflowMenu>
			{/if}
		{:else if cell.key == "time"}
			{formatTime(cell.value)}
		{:else if cell.key == "size"}
			{cell.value}
		{:else}
			{cell.value}
		{/if}
	</svelte:fragment>
	<Toolbar>
		<ToolbarContent>
			{#if !loading}
				<FileUploaderButton disableLabelChanges kind="ghost" labelText="Add file" on:change={add} />
			{/if}
		</ToolbarContent>
	</Toolbar>
</DataTable>
<Pagination pageSizeInputDisabled totalItems={data.result.length} />
