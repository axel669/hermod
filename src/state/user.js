import {writable} from "svelte/store"
import pubsub from "pubsub-js"

import http from "@/comm/http"
import twitch from "@/comm/twitch"
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
    plugins: [],
    commands: []
})
const user = writable(
    null,
    async (set) => {
        await login()

        const user = await http.get("https://api.axel669.net/cerberus/user")
        if (Err(user)) {
            set(false)
            return
        }

        twitch.init(user)
        const twitchUserInfo = await twitch.userInfo(user.userID)
        if (Err(twitchUserInfo)) {
            set(false)
            return
        }

        user.profileImage = twitchUserInfo.profile_image_url
        pubsub.publish(
            "settings.load",
            JSON.parse(
                localStorage.settings ?? defaultSettings
            )
        )
        set(user)
    }
)

const win = (name) =>
    (obj) => {
        window[name] = obj
        return obj
    }

export default user
