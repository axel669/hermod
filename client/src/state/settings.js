import { readable, get, derived } from "svelte/store"
import update from "@axel669/immutable-update"

import sort from "@axel669/array-sort"
import bridge from "@/comm/bridge"
import api from "@/comm/api"

import builtInPlugins from "./settings/builtin-plugins"

const settings = readable(
    null,
    (set) => {
        bridge.on(
            "settings.change",
            (evt) => {
                console.log(evt)
                const next = update(
                    get(settings),
                    evt.data
                )
                api.saveSettings(next)
                set(next)
            }
        )
        bridge.on(
            "settings.load",
            (evt) => set(evt.data)
        )
    }
)
// settings.subscribe(console.log)

const userPluginList = derived(
    settings,
    (settings) => Object.values(settings.plugins)
)
const pluginList = derived(
    settings,
    (settings) => [
        ...Object.values(builtInPlugins),
        ...Object.values(settings.plugins),
    ]
)
const commandList = derived(
    settings,
    (settings) => Object.values(settings.commands).sort(
        sort.map(item => item.id, sort.natural)
    )
)

const plugins = derived(
    settings,
    (settings) => ({
        ...settings.plugins,
        ...builtInPlugins,
    })
)
const commands = derived(settings, (settings) => settings?.commands ?? null)

const loaded = derived(settings, (settings) => settings !== null)

export {
    userPluginList,
    pluginList,
    commandList,
    plugins,
    commands,
    loaded,
}
export default settings
