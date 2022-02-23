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

    import settings from "@/state/settings"

    export let close

    let command = ""
    let plugin = "text"

    const plugins = [
        { label: "Text", value: "text" },
        ...$settings.plugins.map(
            (plugin) => ({
                label: `${plugin.command} v${plugin.version}`,
                value: plugin.name
            })
        )
    ]

    const cancel = () => close(null)
    const create = () => close({
        command,
        plugin,
    })
</script>

<DialogContent
top="15%"
left="50%"
originX="50%"
width="min(70vw, 320px)"
height="60vh"
>
    <Paper card>
        <TitleBar compact>
            New Text Command
        </TitleBar>
        <Action>
            <Flex direction="column">
                <TextInput label="Command" bind:value={command}>
                    <Adornment slot="start">
                        <Text adorn>!</Text>
                    </Adornment>
                </TextInput>

                <Select label="Plugin" bind:value={plugin} options={plugins} />
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
