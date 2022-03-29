<script>
    import {
        Adornment,
        Button,
        Checkbox,
        Icon,
        Paper,
        Select,
        Text,
        TextInput,
        TitleBar,
    } from "svelte-doric"
    import { DialogContent, Dialog, Confirm } from "svelte-doric/dialog"
    import { Action, Flex, Grid } from "svelte-doric/layout"

    import SettingsEditor from "./settings-editor.svelte"

    import { plugins } from "@/state/settings"

    export let options
    export let close

    const { command } = options
    const plugin = $plugins[command.pluginID]
    const {name, type} = command
    let { enabled, userLevel, freq, redeem } = command
    let config = {...command.config}
    let removeDialog

    const removePlugin = async () => {
        const shouldRemove = await removeDialog.show({
            title: "Delete Command?",
            message: `Are you sure you want to delete the ${type} command ${name}?`,
            okText: "Delete",
        })

        if (shouldRemove !== true) {
            return
        }

        remove()
    }

    const cancel = () => close(null)
    const remove = () => close(false)
    const save = () => close({ enabled, config, userLevel, freq, redeem })
</script>

<Dialog bind:this={removeDialog} component={Confirm} />
<DialogContent
top="15%"
left="50%"
originX="50%"
width="max(45vw, 320px)"
height="60vh"
>
    <Paper card>
        <TitleBar compact>
            Edit: {command.name} ({command.type} command)

            <Adornment slot="action">
                <Button color="danger" on:tap={removePlugin}>
                    <Icon name="trash" />
                </Button>
            </Adornment>
        </TitleBar>
        <Action>
            <Flex direction="column">
                <SettingsEditor
                    {type}
                    bind:config
                    bind:enabled
                    bind:userLevel
                    bind:freq
                    bind:redeem
                    settings={plugin.settings}
                />
            </Flex>
            <Grid cols={2}>
                <Button color="danger" on:tap={cancel}>
                    Cancel
                </Button>
                <Button color="secondary" on:tap={save}>
                    Save
                </Button>
            </Grid>
        </Action>
    </Paper>
</DialogContent>
