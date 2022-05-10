import {Err} from "@/comm/safe"

let clientID = null
let token = null

const apiURL = "https://api.twitch.tv/helix"
const get = async (path, params) => {
    const queryString = new URLSearchParams(params).toString()
    const url = `${apiURL}${path}?${queryString}`

    const response = await fetch(
        url,
        {
            headers: {
                "Client-ID": clientID,
                "Authorization": `Bearer ${token}`
            }
        }
    )
    const data = await response.json()

    if (response.ok === false) {
        const error = new Error(response.statusText)
        error.detail = data
        return error
    }

    return data
}

export default {
    init: (user) => {
        clientID = user.clientID
        token = user.token
    },
    channelInfo: async (userID) => {
        const channel = await get(
            "/channels",
            { broadcaster_id: userID }
        )
        if (Err(channel)) {
            return channel
        }
        return channel.data[0]
    },
    userInfo: async (userID) => {
        const user = await get(
            "/users",
            { id: userID }
        )
        if (Err(user)) {
            return user
        }
        return user.data[0]
    },
    rewards: async (userID) => {
        const channel = await get(
            "/channel_points/custom_rewards",
            { broadcaster_id: userID }
        )
        if (Err(channel)) {
            return channel
        }
        return channel.data
    },
    subList: async (userID) => {
        const subs = await get(
            "/subscriptions",
            { broadcaster_id: userID }
        )
        if (Err(subs)) {
            return subs
        }
        return subs
    }
}
