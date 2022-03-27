<script>
    import {
        Button,
        ControlDrawer,
        Icon,
        Text,
        TitleBar,
    } from "svelte-doric"
    import { Dialog } from "svelte-doric/dialog"

    import CommandEditor from "./command-editor.svelte"

    import bridge from "@/comm/bridge"

    export let command

    let editor = null

    let confirm = null
    const edit = async () => {
        const updatedConfig = await editor.show({
            command,
        })

        if (updatedConfig === null) {
            return
        }

        if (updatedConfig === false) {
            bridge.emit(
                "settings.change",
                { "commands.$unset": [command.id] }
            )
            return
        }

        bridge.emit(
            "settings.change",
            {
                [`commands.${command.id}.config.$set`]: updatedConfig.config,
                [`commands.${command.id}.enabled.$set`]: updatedConfig.enabled,
            }
        )
    }

    const cmdIcon = {
        chat: "message"
    }

    $: color = command.enabled ? "secondary" : "danger"
    $: status = command.enabled ? "check" : "xmark"
    $: type = cmdIcon[command.type]
</script>

<style>
    info-area {
        display: grid;
        grid-template-columns: max-content auto;
        flex-grow: 1;
    }
</style>

<Dialog persistent bind:this={editor} component={CommandEditor} />
<Button variant="outline" {color} on:tap={edit}>
    <info-area>
        <Text adorn>
            <Icon name={type} />
        </Text>
        <Text adorn>
            <Icon name={status} />
            {command.name}
        </Text>
    </info-area>
</Button>
