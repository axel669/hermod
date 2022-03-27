<script>
    import {
        AppStyle,
        Baseline as baseline,

        HexagonSpinner as Spinner,
    } from "svelte-doric"
    import { LightTheme, DarkTheme, TronTheme } from "svelte-doric/theme"

    import Login from "@/comp/login.svelte"
    import Dashboard from "@/comp/dashboard.svelte"

    import user from "@/state/user"
    import { loaded } from "@/state/settings"
    import currentTheme from "@/state/theme"

    const themeMap = {
        light: LightTheme,
        dark: DarkTheme,
        tron: TronTheme,
    }

    $: theme = themeMap[$currentTheme]
</script>

<style>
    load-area {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100vw;
        height: 100vh;
    }
</style>

<AppStyle {baseline} {theme} />

{#if $user === null || $loaded === false}
    <load-area>
        <Spinner size={120} />
    </load-area>
{:else if $user === false}
    <Login />
{:else}
    <Dashboard />
{/if}
