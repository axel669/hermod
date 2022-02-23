import { writable, get } from "svelte/store"
import update from "@axel669/immutable-update"
import fulla from "@/comms/fulla"
import crypto from "@/state/crypto"

const source = writable(null)
const updateSource = (updates) => source.update(
    settings => update(settings, updates, true)
)

let initialized = false
source.subscribe(
    async (settings) => {
        if (settings === null) {
            return
        }
        if (initialized === false) {
            initialized = true
            return
        }
        await fulla.save(
            await crypto.encrypt(settings)
        )
        console.log("settings updated")
    }
)
export default {
    subscribe: source.subscribe,
    set: source.set,
    load: (settings) => {
        source.set(settings)
    },
    update: (changes) => source.set(
        update(
            get(source),
            changes
        )
    ),
    updateCommand: (command, changed) => {
        const state = get(source)
        const index = state.commands.indexOf(command)
        source.set(
            update(
                state,
                {
                    [`commands.${index}.$set`]: changed
                }
            )
        )
    }
}
