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
    import pubsub from "pubsub-js"

    import { toast } from "../toast.svelte"
    import settings from "@/state/settings"

    export let plugin

    let open = false

    $: usedCount = $settings.commands
        .filter(
            (cmd) => cmd.info.plugin === plugin.name
        )
        .length
    let confirm = null
    const removePlugin = async () => {
        const remove = await confirm.show({
            title: "Confirm",
            message: `Are you sure you want to remove ${plugin.command}?`
        })

        if (remove !== true) {
            return
        }

        pubsub.publish(
            "settings.change",
            { "plugins.$filter": (p) => p !== plugin }
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
        {plugin.command}
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
            {plugin.author}/{plugin.command}
        </Text>
        <Text adorn>
            <Icon name="caret-right" />
        </Text>
    </info-area>
</Button>
