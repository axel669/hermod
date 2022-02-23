import pubsub from "pubsub-js"
import {writable} from "svelte/store"

let chat = null
const chatConnected = writable(false)

let user = null
const say = async (message) => {
    if (message.trim() === "") {
        return
    }
    await chat.say(user.username, `/me ${message}`)
}
const join = async (twitchUser, joinMessage) => {
    user = twitchUser
    chat = new tmi.Client({
        connection: {
            secure: true,
        },
        identity: {
            username: user.username,
            password: `oauth:${user.token}`
        },
        channels: [user.username]
    })

    chat.on(
        "message",
        async (channel, user, message, self) => {
            const msg = message.trim()

            if (msg.startsWith("!") === false) {
                return
            }

            user.broadcaster = user.badges?.broadcaster !== undefined
            user.vip = user.badges?.vip !== undefined

            const [command, ...parts] = msg.slice(1).split(/\s+/)
            const cmd = command.toLowerCase()

            // console.log(`user: ${user["display-name"]}`)
            // console.log(`command: ${cmd}, args: ${parts}`)

            pubsub.publish(
                "chat.command",
                {user, cmd, parts}
            )

            // const commands = get(settings).commands
            // const info = commands.find(
            //     info => info.name === cmd
            // )

            // if (info === undefined || info.enabled === false) {
            //     return
            // }

            // processCall(
            //     await worker.execScript({
            //         name: info.plugin,
            //         settings: info.settings,
            //         user,
            //         parts,
            //     })
            // )
        }
    )

    chat.on(
        "connected",
        () => {
            chatConnected.set(true)
            if (joinMessage.trim() === "") {
                return
            }
            say(joinMessage)
        }
    )
    chat.on(
        "disconnected",
        () => chatConnected.set(false)
    )

    await chat.connect()
}

const leave = async (leaveMessage) => {
    await say(leaveMessage)
    chat.disconnect()
}

export {chatConnected}
export default {join, leave}
