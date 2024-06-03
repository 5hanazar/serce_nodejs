<script lang="ts">
	import { goto } from "$app/navigation";
	import { clearForm, formToObj } from "$lib";
    let status = " ";
	const submit = async (e: SubmitEvent) => {
		e.preventDefault();
        const data = formToObj(e)        
		const response = await fetch(`/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ name: data.name, phone: data.phone }),
		});
		if (response.ok) await goto(`/`, { replaceState: true });
		else if (response.status == 401) {
			status = "Invalid credentials";
            clearForm(e)
		}
	};
</script>

<section>
	<form on:submit={submit}>
		<label for="name">Name</label>
		<input name="name" type="text" />
		<label for="phone">Phone</label>
		<input name="phone" type="phone" />
		<br />
		<button>Login</button>
	</form>
	<div>{status}</div>
</section>

<style>
	section {
		display: flex;
		position: absolute;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		gap: 2rem;
	}
	form {
		display: grid;
		grid-template-columns: auto auto;
		background-color: #fff;
		padding: 1rem;
		gap: 1rem;
	}
	label {
		text-align: end;
	}
	div {
		white-space: pre;
	}
</style>
