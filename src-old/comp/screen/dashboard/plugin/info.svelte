<script>
    import Alert from "svelte-doric/core/dialog/alert"
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Confirm from "svelte-doric/core/dialog/confirm"
    import Dialog from "svelte-doric/core/dialog"
    import Icon from "svelte-doric/core/icon"
    import Text from "svelte-doric/core/text"

    import update from "@axel669/immutable-update"

    import settings from "@/state/settings"
    import pluginSettings from "@/plugin/settings"
    import worker from "@/state/worker"

    export let plugin

    let warn = null
    let confirm = null

    const name = `${plugin.author}:${plugin.command}:${plugin.version}`
    const remove = async () => {
        const dependants = $settings.commands.filter(
            cmd => cmd.plugin === name
        )

        if (dependants.length > 0) {
            warn.show({
                title: "Cannot Delete Plugin",
                message: `${plugin.command} - ${plugin.version}
                    has a command using it, so it cannot be delete right now.`
            })
            return
        }

        const shouldDelete = await confirm.show({
            title: "Confirm",
            message: `Remove plugin ${plugin.command} - ${plugin.version}?`
        })
        if (shouldDelete !== true) {
            return
        }

        await worker.unloadScript(plugin)
        const updatedPlugins = {...$pluginSettings}
        delete updatedPlugins[name]
        $pluginSettings = updatedPlugins
        $settings = update(
            $settings,
            {
                "plugins.$apply": (plugins) => plugins.filter(
                    p => p !== plugin
                )
            }
        )
    }
</script>

<style>
    plugin-info {
        display: grid;
        grid-template-columns: auto 48px;
        padding: 4px;
    }
</style>

<Dialog component={Alert} bind:this={warn} />
<Dialog component={Confirm} bind:this={confirm} />
<Card color="primary">
    <plugin-info>
        <div>
            <Text>{plugin.command} - {plugin.version}</Text>
            <Text block variant="secondary">
                By {plugin.author}
            </Text>
        </div>

        <Button color="danger" on:tap={remove}>
            <Icon name="delete" />
        </Button>
    </plugin-info>
</Card>
