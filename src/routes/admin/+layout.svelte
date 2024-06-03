<script>
    import {
        Header,
        SideNav,
        SideNavItems,
        SideNavLink,
        SkipToContent,
        Content,
    } from "carbon-components-svelte";

    let isSideNavOpen = false;
</script>

<svelte:head>
	<link rel="stylesheet" href="/g10.css" />
</svelte:head>

<Header company="Serçe" platformName="Admin Panel" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent />
    </svelte:fragment>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
    <SideNavItems>
        <SideNavLink text="Главная" href="/admin" />
        <SideNavLink text="Клиенты" href="/admin/clients" />
        <SideNavLink text="Файлы" href="/admin/files" />
    </SideNavItems>
</SideNav>

<Content>
    <slot />
</Content>