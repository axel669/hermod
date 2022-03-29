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
        const newConfig = await editor.show({
            command,
        })

        if (newConfig === null) {
            return
        }

        if (newConfig === false) {
            bridge.emit(
                "settings.change",
                { "commands.$unset": [command.id] }
            )
            return
        }

        bridge.emit(
            "settings.change",
            {
                [`commands.${command.id}.config.$set`]: newConfig.config,
                [`commands.${command.id}.enabled.$set`]: newConfig.enabled,
                [`commands.${command.id}.userLevel.$set`]: newConfig.userLevel,
                [`commands.${command.id}.freq.$set`]: newConfig.freq,
                [`commands.${command.id}.redeem.$set`]: newConfig.redeem,
            }
        )
    }

    const cmdIcon = {
        chat: "message",
        redeem: "circle",
        timer: "hourglass"
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
