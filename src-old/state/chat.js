import { writable, get } from "svelte/store"

import worker from "@/state/worker"
import settings from "@/state/settings"

const chat = writable(null)

export default {
    subscribe: chat.subscribe,
    configure: (botSettings) => {
        const chatClient = new tmi.Client({
            connection: {
                secure: true
            },
            identity: {
                username: botSettings.user.username,
                password: botSettings.user.password,
            },
            channels: [botSettings.channel]
        })
        const processCall = ({result}) => {
            const { say, whisper } = result

            if (say !== undefined) {
                chatClient.say(botSettings.channel, say)
            }
        }
        chatClient.on(
            "message",
            async (channel, user, message, self) => {
                const msg = message.trim()

                if (msg.startsWith("!") === false) {
                    return
                }

                user.broadcaster = user.badges?.broadcaster !== undefined
                user.vip = user.badges?.vip !== undefined

                user.level = parseInt(
                    [user.broadcaster, user.mod, user.vip]
                        .map(flag => flag ? "1" : "0")
                        .join(""),
                    2
                )

                const [command, ...parts] = msg.slice(1).split(/\s+/)
                const cmd = command.toLowerCase()

                const commands = get(settings).commands
                const info = commands.find(
                    info => info.name === cmd
                )

                if (info === undefined || info.enabled === false) {
                    return
                }

                processCall(
                    await worker.execScript({
                        name: info.plugin,
                        settings: info.settings,
                        user,
                        parts,
                    })
                )
            }
        )
        chat.set(chatClient)
    }
}
