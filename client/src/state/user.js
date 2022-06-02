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

const user = writable(
    null,
    async (set) => {
        await login()

        function fail() {
            set(false)
            bridge.emit("settings.load", {})
        }

        const user = await api.currentUser()
        if (Err(user)) {
            return fail()
        }

        twitch.init(user)
        const twitchUserInfo = await twitch.userInfo(user.userID)
        if (Err(twitchUserInfo)) {
            return fail()
        }

        user.profileImage = twitchUserInfo.profile_image_url

        const { settings, vars } = await api.query({
            "settings:bot.settings.load": {},
            "vars:bot.vars.load": {}
        })

        if(Err(settings) || Err(vars)) {
            return fail()
        }

        for (const plugin of Object.values(settings.plugins)) {
            worker.importPlugin(plugin)
        }
        bridge.emit("settings.load", settings)
        bridge.emit("vars.load", vars)
        set(user)
    }
)

const win = (name) =>
    (obj) => {
        window[name] = obj
        return obj
    }

export default user
