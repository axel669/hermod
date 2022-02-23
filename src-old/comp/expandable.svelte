<script>
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"

    let open = false
    const toggle = () => open = !open

    $: color = open ? "primary" : "default"
</script>

<style>
    clickable-title {
        flex-grow: 1;
        display: grid;
    }
</style>

<Card {color}>
    <svelte:fragment slot="title">
        <clickable-title>
            <Button on:tap={toggle}>
                <slot name="title" />
            </Button>
        </clickable-title>
    </svelte:fragment>

    {#if open}
        <slot />
    {/if}
</Card>
