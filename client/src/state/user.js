import {writable} from "svelte/store"
import pubsub from "pubsub-js"

import bridge from "@/comm/bridge"
import http from "@/comm/http"
import api from "@/comm/api"
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

    await api.login(accessToken)
}

const defaultSettings = JSON.stringify({
    plugins: {},
    commands: {},
})
const user = writable(
    null,
    async (set) => {
        await login()

        const user = await api.currentUser()
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

        const settings = await api.readSettings()
        for (const plugin of Object.values(settings.plugins)) {
            worker.importPlugin(plugin)
        }
        bridge.emit("settings.load", settings)
        set(user)
    }
)

const win = (name) =>
    (obj) => {
        window[name] = obj
        return obj
    }

export default user
