import { readable, get } from "svelte/store"
import pubsub from "pubsub-js"
import update from "@axel669/immutable-update"

const settings = readable(
    null,
    (set) => {
        pubsub.subscribe(
            "settings.change",
            (_, changes) => {
                const next = update(
                    get(settings),
                    changes
                )
                localStorage.settings = JSON.stringify(next)
                set(next)
            }
        )
        pubsub.subscribe(
            "settings.load",
            (_, settings) => set(settings)
        )
    }
)

export default settings
