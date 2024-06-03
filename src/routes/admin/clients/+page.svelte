<script lang="ts">
	export let data;
	import { DataTable, OverflowMenu, OverflowMenuItem, Pagination, Toolbar, ToolbarContent, ToolbarSearch, Checkbox, Button, DataTableSkeleton } from "carbon-components-svelte";
	import Search from "carbon-icons-svelte/lib/Search.svelte";
	import Add from "carbon-icons-svelte/lib/Add.svelte";
	import { page } from "$app/stores";
	import { goto, invalidateAll } from "$app/navigation";
	import { browser } from "$app/environment";
	const destroy = async (id: number) => {
		const response = await fetch(`/admin/clients/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});
		if (response.ok) {
			await invalidateAll();
		} else alert("Error " + response.status);
	};
	const _ab0 = (a: any, b: any) => 0;
	const headers = [
		{ key: "id", value: "Id", sort: _ab0 },
		{ key: "active", value: "Active", sort: _ab0 },
		{ key: "name", value: "Name", sort: _ab0 },
		{ key: "phone", value: "Phone", sort: _ab0 },
        { key: "description", value: "Description", sort: _ab0 },
		{ key: "address", value: "Address", sort: _ab0 },
		{ key: "devices", value: "Devices", sort: false },
		{ key: "createdDate", value: "Created Date", sort: false },
		{ key: "onlineDate", value: "Online Date", sort: false },
		{ key: "overflow", empty: true },
	];
	let loading = false;
	let searchValue = $page.url.searchParams.get("q") || "";
	let sortKey: string | null = null;
	let sortDirection = "none";
	const getO = $page.url.searchParams.get("o");
	if (getO != null) {
		sortKey = getO.split(";")[0];
		sortDirection = getO.split(";")[1];
	}
	const move = async () => {
		loading = true;
		let arr = [];
		if (searchValue != "") arr.push(`q=${searchValue}`);
		if (sortKey != undefined) arr.push(`o=${sortKey};${sortDirection}`);
		if (data.pageIndex != 1) arr.push(`p=${data.pageIndex}`);
		if (browser) await goto(`/admin/clients?${arr.join("&")}`, { replaceState: true });
		loading = false;
	};
	$: sortKey, sortDirection, move();
</script>

{#if loading}
	<DataTableSkeleton {headers} showHeader={false} rows={data.count} />
{:else}
	<DataTable {headers} bind:sortKey bind:sortDirection rows={data.data} sortable>
		<svelte:fragment slot="cell" let:row let:cell>
			{#if cell.key == "overflow"}
				<OverflowMenu flipped>
					<OverflowMenuItem href="/admin/clients/{row.id}" text="Edit" />
					<OverflowMenuItem danger text="Delete" on:click={() => destroy(row.id)} />
				</OverflowMenu>
			{:else if cell.key == "active"}
				<Checkbox checked={cell.value == 1} disabled />
			{:else}
				{cell.value}
			{/if}
		</svelte:fragment>
		<Toolbar>
			<ToolbarContent>
				<ToolbarSearch persistent bind:value={searchValue} />
				<Button icon={Search} iconDescription="Search" on:click={() => move()} />
				<Button icon={Add} kind="ghost" href="/admin/clients/new">Create</Button>
			</ToolbarContent>
		</Toolbar>
	</DataTable>
	<Pagination pageSizeInputDisabled totalItems={data.count} bind:page={data.pageIndex} on:update={() => move()} pageSize={data.size} />
{/if}
