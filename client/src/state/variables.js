import { get, readable } from "svelte/store"
import update from "@axel669/immutable-update"

import bridge from "@/comm/bridge"
import api from "@/comm/api"

const vars = readable(
    null,
    (set) => {
        bridge.on(
            "vars.change",
            (evt) => {
                if (Object.keys(evt.data).length === 0) {
                    return
                }
                const next = {
                    ...get(vars),
                    ...evt.data,
                }
                api.saveVars(next)
                set(next)
            }
        )
        bridge.on(
            "vars.load",
            (evt) => set(evt.data)
        )
    }
)
vars.subscribe(() => {})
// vars.subscribe(
//     (vars) => console.log("vars", vars)
// )

export default vars
