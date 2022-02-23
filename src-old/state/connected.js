import { writable } from "svelte/store"

const source = writable(false)

export default {
    subscribe: source.subscribe,
    set: source.set
}
