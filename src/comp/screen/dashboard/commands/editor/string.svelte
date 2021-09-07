<script>
    import TextInput from "svelte-doric/core/text-input"

    export let label
    export let value
</script>

<TextInput variant="outline" {label} bind:value />
