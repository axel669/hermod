<script>
    import Adornment from "svelte-doric/core/adornment"
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Checkbox from "svelte-doric/core/checkbox"
    import Select from "svelte-doric/core/select"
    import Tabs from "svelte-doric/core/tabs"
    import TabPanel from "svelte-doric/core/tab-panel"
    import TextInput from "svelte-doric/core/text-input"
    import TitleBar from "svelte-doric/core/title-bar"

    import DialogContent from "svelte-doric/core/dialog/content"

    import Action from "svelte-doric/core/layout/action"
    import Flex from "svelte-doric/core/layout/flex"
    import Grid from "svelte-doric/core/layout/grid"

    import editors from "./editor"

    import pluginSettings from "@/plugin/settings"

    export let options
    export let close

    const {command} = options
    let enabled = command.enabled
    let plugin = command.plugin
    let settings = {...command.settings}

    $: settingsTemplate = Object.entries(
        $pluginSettings[plugin] ?? {}
    )
    $: editorElements = settingsTemplate.map(
        (info) => [
            info[0],
            editors[info[1]]
        ]
    )

    const cancel = () => close()
    const save = () => {
        close({
            enabled,
            settings,
            plugin,
        })
    }

    $: pluginOptions = Object.keys($pluginSettings)
        .map(
            plugin => ({label: plugin, value: plugin})
        )
</script>

<DialogContent top="25%" left="50%" originX="50%" width="min(90vw, 600px)">
    <Card>
        <TitleBar>
            Edit Command Settings
        </TitleBar>

        <Action>
            <Flex direction="column">
                <Checkbox bind:checked={enabled} color="secondary">
                    Enabled
                </Checkbox>

                <Select
                    variant="outline"
                    label="Plugin"
                    bind:value={plugin}
                    options={pluginOptions}
                />

                {#each editorElements as [label, elem] (label)}
                    <svelte:component
                        this={elem}
                        {label}
                        bind:value={settings[label]}
                    />
                {/each}
            </Flex>
            <Grid cols={2}>
                <Button color="danger" on:tap={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" on:tap={save}>
                    Save
                </Button>
            </Grid >
        </Action>
    </Card>
</DialogContent>
