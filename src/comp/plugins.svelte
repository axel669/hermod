<script>
    import {
        Adornment,
        Button,
        CircleSpinner as Spinner,
        Paper,
        TextInput,
        TitleBar,
    } from "svelte-doric"
    import { Flex } from "svelte-doric/layout"

    import pubsub from "pubsub-js"

    import PluginDisplay from "./plugins/plugin-display.svelte"

    import worker from "@/comm/worker"
    import {parseURL} from "@/comm/plugin"
    import {toast} from "@/comp/toast.svelte"

    import settings from "@/state/settings"

    let importing = false
    const test = async () => {
        importing = true
        const pluginInfo = await worker.importPlugin(url)

        pubsub.publish(
            "settings.change",
            { "plugins.$push": pluginInfo }
        )

        importing = false
        url = ""

        toast("Plugin imported!")
    }

    let url = ""
    $: pluginInfo = parseURL(url)
</script>

<Flex direction="column">
    <TextInput label="Plugin URL" bind:value={url} />

    {#if pluginInfo}
        <Paper card>
            <TitleBar compact>
                Plugin Info
            </TitleBar>

            <Flex direction="column">
                <div>
                    {pluginInfo.command} v{pluginInfo.version}
                </div>
                <div>
                    by {pluginInfo.author}
                </div>

                <Button
                on:tap={test}
                color="secondary"
                disabled={importing}
                variant="outline"
                >
                    Import Plugin
                    {#if importing}
                        <Adornment position="start">
                            <Spinner size="24px" />
                        </Adornment>
                    {/if}
                </Button>
            </Flex>
        </Paper>
    {/if}

    {#each $settings.plugins as plugin}
        <PluginDisplay {plugin} />
    {/each}
</Flex>
