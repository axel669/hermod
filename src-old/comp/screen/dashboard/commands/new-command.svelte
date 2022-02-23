<script>
    import Adornment from "svelte-doric/core/adornment"
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Select from "svelte-doric/core/select"
    import Tabs from "svelte-doric/core/tabs"
    import TabPanel from "svelte-doric/core/tab-panel"
    import TextInput from "svelte-doric/core/text-input"
    import TitleBar from "svelte-doric/core/title-bar"

    import DialogContent from "svelte-doric/core/dialog/content"

    import Action from "svelte-doric/core/layout/action"
    import Flex from "svelte-doric/core/layout/flex"
    import Grid from "svelte-doric/core/layout/grid"

    import pluginSettings from "@/plugin/settings"

    export let close
    export let options

    const {title, command} = options

    let tabGroup = "chat"
    const triggers = [
        {label: "Chat", value: "chat", icon: "chat"},
        {label: "Timer", value: "schedule", icon: "schedule"}
    ]

    let name = ""
    let time = "0"

    const cancel = () => close()
    const save = () => close({
        type: tabGroup,
        name,
        time,
        plugin,
    })

    let plugin = null
    $: pluginOptions = Object.keys($pluginSettings)
        .map(
            plugin => ({label: plugin, value: plugin})
        )
    $: console.log($pluginSettings[plugin])
    $: disableSave = (
        name.trim() === ""
        || plugin === null
    )
</script>

<style>
    center-text {
        padding: 4px;
        display: flex;
        align-items: center;
        justify-items: center;
    }
</style>

<DialogContent top="25%" left="50%" originX="50%" width="min(70vw, 360px)">
    <Card>
        <TitleBar>
            {title}
            <br />Trigger: {tabGroup}

            <svelte:fragment slot="adornments">
                <Adornment position="extension">
                    <Tabs bind:tabGroup options={triggers} />
                </Adornment>
            </svelte:fragment>
        </TitleBar>
        <Action>
            <Flex direction="column">
                <TextInput label="Name" bind:value={name} variant="outline" />

                <TabPanel value="chat" {tabGroup}>
                    <center-text>
                        Command: !{name}
                    </center-text>
                </TabPanel>

                <TabPanel value="schedule" {tabGroup}>
                    <Flex direction="column" padding="0px">
                        <TextInput
                            type="number"
                            label="Interval (seconds)"
                            bind:value={time}
                            variant="outline"
                        />
                    </Flex>
                </TabPanel>

                <Select
                    variant="outline"
                    label="Plugin"
                    bind:value={plugin}
                    options={pluginOptions}
                />
            </Flex>
            <Grid cols={2}>
                <Button color="danger" on:tap={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" on:tap={save} disabled={disableSave}>
                    Save
                </Button>
            </Grid >
        </Action>
    </Card>
</DialogContent>
