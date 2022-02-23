<svelte:options immutable />

<script>
    import Button from "svelte-doric/core/button"
    import Checkbox from "svelte-doric/core/checkbox"
    import Text from "svelte-doric/core/text"

    import Dialog from "svelte-doric/core/dialog"
    import Prompt from "svelte-doric/core/dialog/prompt"

    import GridLayout from "svelte-doric/core/layout/grid"
    import FlexLayout from "svelte-doric/core/layout/flex"

    import Expandable from "./expandable.svelte"

    import commandSettings from "../settings"

    export let command
    export let info
    export let dirty

    let localDirty = false
    $: ({enabled, settings} = info)
    $: if (enabled !== info.enabled || settings !== info.settings) {
        dirty = true
        localDirty = true
    }

    const save = () =>
        commandSettings.update(
            command,
            {
                gistURL: info.gistURL,
                author: info.author,
                enabled,
                settings,
            }
        )

    let renameDialog = null
    const rename = async () => {
        const newCommand = await renameDialog.show({
            title: `New Command Name for !${command}`,
            message: ""
        })
        if (newCommand !== null && newCommand !== command) {
            commandSettings.rename(command, newCommand)
        }
    }
</script>

<Dialog component={Prompt} persistent bind:this={renameDialog} />

<Expandable>
    <svelte:fragment slot="title">
        {localDirty ? "*" : ""}
        !{command} ({enabled ? "enabled" : "disabled"})
    </svelte:fragment>

    <FlexLayout direction="column">
        <Checkbox bind:checked={enabled}>
            Enable
        </Checkbox>

        <Button on:tap={rename}>
            Change Command
        </Button>

        <Button color="secondary" on:tap={save} variant="fill">
            Save
        </Button>
    </FlexLayout>
</Expandable>
