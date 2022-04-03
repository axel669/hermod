<script>
    import {
        Adornment,
        Button,
        Paper,
        Select,
        Text,
        TextInput,
        TitleBar,
    } from "svelte-doric"
    import { DialogContent } from "svelte-doric/dialog"
    import { Action, Flex, Grid } from "svelte-doric/layout"

    import {writable, get} from "svelte/store"

    import SettingsEditor from "./settings-editor.svelte"

    import { pluginList } from "@/state/settings"

    export let close

    const plugins = $pluginList.filter(
        p => p.triggers.includes("timer")
    )
    let name = ""
    let freq = 60
    let plugin = plugins[0]
    let config = {}
    let userLevel = "anyone"
    let enabled = true

    const options = plugins.map(
        plugin => ({
            label: `${plugin.label} by ${plugin.author}`,
            value: plugin,
        })
    )

    const cancel = () => close(null)
    const create = () => close({
        name,
        config,
        userLevel,
        enabled,
        freq,
        pluginID: plugin.id,
    })
</script>

<DialogContent
top="15%"
left="50%"
originX="50%"
width="max(45vw, 320px)"
height="60vh"
>
    <Paper card>
        <TitleBar compact>
            New Timer Command
        </TitleBar>
        <Action>
            <Flex direction="column">
                <TextInput label="Command" bind:value={name} />

                <Select label="Plugin" bind:value={plugin} {options} />

                <SettingsEditor
                    type="timer"
                    bind:config
                    bind:userLevel
                    bind:enabled
                    bind:freq
                    settings={plugin.settings}
                />
            </Flex>
            <Grid cols={2}>
                <Button color="danger" on:tap={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" on:tap={create} disabled={freq < 15}>
                    Create
                </Button>
            </Grid>
        </Action>
    </Paper>
</DialogContent>
