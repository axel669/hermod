<script>
    import { writable } from "svelte/store"

    import componentMap from "./component-map.js"

    export let settings
    export let config

    const iden = (real) => real

    $: config = iden(config, settings)
</script>

{#each settings as input}
    <svelte:component
        this={componentMap[input.type]}
        label={input.label}
        bind:value={config[input.name]}
    />
{/each}
