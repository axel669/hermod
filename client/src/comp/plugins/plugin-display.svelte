<script>
    import {
        Button,
        ControlDrawer,
        Icon,
        Text,
        TitleBar,
    } from "svelte-doric"
    import { Dialog, Confirm } from "svelte-doric/dialog"
    import { Flex } from "svelte-doric/layout"

    import bridge from "@/comm/bridge"
    import worker from "@/comm/worker"
    import { toast } from "../toast.svelte"
    import { commandList } from "@/state/settings"

    export let plugin

    let open = false

    $: usedCount = $commandList
        .filter(
            (cmd) => cmd.pluginID === plugin.id
        )
        .length
    let confirm = null
    const removePlugin = async () => {
        const remove = await confirm.show({
            title: "Confirm",
            message: `Are you sure you want to remove ${plugin.name} v${plugin.version}?`
        })

        if (remove !== true) {
            return
        }

        const unloaded = worker.removePlugin(plugin)
        if (unloaded === false) {
            console.log("couldnt unload?")
            return
        }
        bridge.emit(
            "settings.change",
            { "plugins.$unset": [plugin.id] }
        )
        toast("Plugin removed")
        open = false
    }
</script>

<style>
    info-area {
        display: grid;
        grid-template-columns: auto max-content;
        flex-grow: 1;
    }
</style>

<ControlDrawer bind:open>
    <TitleBar compact>
        {plugin.name}
    </TitleBar>

    <Flex direction="column">
        <div>
            v{plugin.version}
        </div>
        <div>
            {plugin.author}
        </div>
        <div>
            Commands using: {usedCount}
        </div>

        <div>
            Triggers: {JSON.stringify(plugin.triggers)}
        </div>
        <div>
            Settings<br />
            <pre>{JSON.stringify(plugin.settings, null, 2)}</pre>
        </div>

        <Button on:tap={removePlugin} color="danger" disabled={usedCount !== 0}>
            <Icon name="trash" />
            Delete
        </Button>
    </Flex>
</ControlDrawer>
<Dialog bind:this={confirm} component={Confirm} />

<Button on:tap={() => open = true} variant="outline">
    <info-area>
        <Text adorn>
            {plugin.label}
            <br />
            by {plugin.author}
        </Text>
        <Text adorn>
            <Icon name="caret-right" />
        </Text>
    </info-area>
</Button>
