<script>
    import { Checkbox } from "svelte-doric"

    export let value
    export let label
</script>

<Checkbox bind:checked={value}>
    {label}
</Checkbox>
