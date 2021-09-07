import { writable } from "svelte/store"

const pluginSettings = writable({
    "simple": {
        response: "string"
    }
})

export default pluginSettings
// export default {
//     subscribe: pluginSettings.subscribe,
//     set: pluginSettings.set,
//     update:
// }
