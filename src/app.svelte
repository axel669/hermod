<script>
    import AppStyle from "svelte-doric/core/app-style"
    import baseline from "svelte-doric/core/baseline"
    import theme from "svelte-doric/core/theme/tron"

    import Login from "@/comp/screen/login.svelte"
    import DashboardInit from "@/comp/screen/dashboard/init.svelte"
    import Dashboard from "@/comp/screen/dashboard.svelte"

    import user from "@/state/user"
    import settings from "@/state/settings"
</script>

<AppStyle {baseline} {theme} />

{#if user === null}
    <Login />
{:else}
    {#if $settings === null}
        <DashboardInit />
    {:else}
        <Dashboard />
    {/if}
{/if}
