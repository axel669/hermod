import { writable } from "svelte/store"

import storage from "./storage"

const internal = writable(null)
storage.load().then(
    (settings) => internal.set(settings)
)

internal.subscribe(
    (current) => {
        if (current !== null) {
            storage.save(current)
        }
    }
)

const settings = {
    subscribe: internal.subscribe,
    update: (command, settings) => {
        internal.update(
            (current) => ({
                ...current,
                [command]: settings,
            })
        )
    },
    rename: (oldCommand, command) => internal.update(
        (current) => {
            const next = {
                ...current,
                [command]: current[oldCommand],
            }
            delete next[oldCommand]

            return next
        }
    )
}

export default settings
