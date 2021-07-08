<script>
    import Button from "svelte-doric/core/button"

    const importScript = async () => {
        console.log("importing")
    }
</script>

<Button variant="outline" color="primary" on:tap={importScript}>
    Import Command Script
</Button>
