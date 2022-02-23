<script>
    import Adornment from "svelte-doric/core/adornment"
    import Button from "svelte-doric/core/button"
    import TextInput from "svelte-doric/core/text-input"

    import Flex from "svelte-doric/core/layout/flex"

    import sort from "@axel669/array-sort"

    import PluginInfo from "./plugin/info.svelte"

    import pluginSettings from "@/plugin/settings"
    import settings from "@/state/settings"
    import worker from "@/state/worker"
    import {parseURL} from "@/plugin/info"

    let url = ""
    const pluginSort = sort.map(
        item => item.url,
        sort.string
    )
    const importPlugin = async () => {
        const {result} = await worker.loadScript(url)
        pluginSettings.set({
            ...$pluginSettings,
            [result.name]: result.settings,
        })
        settings.update({
            "plugins.$apply": (plugins = []) => [
                ...plugins,
                {
                    author: result.author,
                    command: result.command,
                    version: result.version,
                    url,
                }
            ]
        })
        url = ""
    }

    $: pluginList = ($settings.plugins ?? []).sort(pluginSort)
</script>

<Flex direction="column">
    <TextInput label="Plugin URL" bind:value={url} variant="outline">
        <Adornment position="end">
            <div style="width: 64px; display: grid;">
                <Button on:tap={importPlugin}>
                    Import
                </Button>
            </div>
        </Adornment>
    </TextInput>

    {#each pluginList as plugin (plugin)}
        <PluginInfo {plugin} />
    {/each}
</Flex>
