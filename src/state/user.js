import {writable} from "svelte/store"
import pubsub from "pubsub-js"

import bridge from "@/comm/bridge"
import http from "@/comm/http"
import twitch from "@/comm/twitch"
import worker from "@/comm/worker"
import {Err} from "@/comm/safe"

const login = async () => {
    const url = new URL(document.location.href.toString().replace("#", "?"))

    if (url.searchParams.has("access_token") === false) {
        return
    }

    const idToken = url.searchParams.get("id_token")
    const accessToken = url.searchParams.get("access_token")

    history.replaceState(null, document.title, location.origin)

    console.log(
        await http.postJSON(
            "https://api.axel669.net/cerberus/auth",
            {key: accessToken}
        )
    )
}

const defaultSettings = JSON.stringify({
    plugins: {},
    commands: {},
})
const user = writable(
    null,
    async (set) => {
        await login()

        const user = await http.get("https://api.axel669.net/cerberus/user")
        if (Err(user)) {
            set(false)
            bridge.emit("settings.load", {})
            return
        }

        twitch.init(user)
        const twitchUserInfo = await twitch.userInfo(user.userID)
        if (Err(twitchUserInfo)) {
            set(false)
            bridge.emit("settings.load", {})
            return
        }

        user.profileImage = twitchUserInfo.profile_image_url
        const settings = JSON.parse(
            localStorage.settings ?? defaultSettings
        )
        bridge.emit("settings.load", settings)

        for (const plugin of Object.values(settings.plugins)) {
            worker.importPlugin(plugin)
        }
        set(user)
    }
)

const win = (name) =>
    (obj) => {
        window[name] = obj
        return obj
    }

export default user
