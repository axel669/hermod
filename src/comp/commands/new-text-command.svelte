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

    let name = ""
    let plugin = $pluginList[0]
    let config = {}

    const options = $pluginList.map(
        plugin => ({
            label: `${plugin.label} by ${plugin.author}`,
            value: plugin,
        })
    )

    const cancel = () => close(null)
    const create = () => close({
        name,
        config,
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
            New Text Command
        </TitleBar>
        <Action>
            <Flex direction="column">
                <TextInput label="Command" bind:value={name}>
                    <Adornment slot="start">
                        <Text adorn>!</Text>
                    </Adornment>
                </TextInput>

                <Select label="Plugin" bind:value={plugin} {options} />
                <SettingsEditor bind:config settings={plugin.settings} />
            </Flex>
            <Grid cols={2}>
                <Button color="danger" on:tap={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" on:tap={create}>
                    Create
                </Button>
            </Grid>
        </Action>
    </Paper>
</DialogContent>
