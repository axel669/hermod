import { writable, get } from "svelte/store"

import { commands, commandList } from "@/state/settings"
import vars from "@/state/variables"
import worker from "@/comm/worker"
import bridge from "@/comm/bridge"
import gspeech from "@/comm/gtts"

let comms = null
const connected = writable({
    chat: false,
    pubsub: false,
    either: false,
})

const say = async (message, replyID) => {
    if (message.trim() === "") {
        return
    }
    await comms.say(`/me ${message}`, replyID)
}
const chat = async (result, replyID) => {
    if (result.chat === undefined) {
        return
    }
    const reply = result.reply ? replyID : undefined
    say(result.chat, reply)
}
const speak = (result) => {
    if (result.speak === undefined) {
        return
    }
    gspeech(result.speak)
    // responsiveVoice.speak(result.speak, voice)
}

bridge.on(
    "timer.trigger",
    async (evt) => {
        if (get(connected).chat === false) {
            return
        }

        const command = get(commands)[evt.data]
        const result = await worker.sendCommand({
            pluginID: command.pluginID,
            type: "timer",
            args: {
                config: command.config
            }
        })

        chat(result)
    }
)

function tagLevel (tags) {
    if (tags.broadcaster === true) {
        return 0
    }
    if (tags.mod === true) {
        return 1
    }
    if (tags.vip === true) {
        return 2
    }
    if (tags.subscriber === true) {
        return 3
    }
    return 10
}
const commandLevels = {
    anyone: 10,
    mods: 1,
    vip: 2,
    subs: 3,
    caster: 4,
}
function commandLevel(command) {
    return commandLevels[command.userLevel]
}

const join = (user, joinMessage) => {
    comms = twitch.RealTime({
        user: {
            name: user.username,
            token: user.token,
            id: user.userID,
        },
        channel: user.username,
        topics: [
            "channel-points-channel-v1"
        ]
    })

    const lastInvoke = {}

    comms.on(
        "chat.message",
        async (evt) => {
            if (evt.data.message.startsWith("!") === false) {
                return
            }

            const { message, tags } = evt.data

            const [msgcmd, ...parts] = message.slice(1).split(/\s+/)
            const cmd = msgcmd.toLowerCase()

            const command = get(commands)[`chat:${cmd}`]

            if (command === undefined) {
                return
            }

            if (tagLevel(tags) > commandLevel(command)) {
                return
            }

            const now = Date.now()
            const last = lastInvoke[command.id] ?? 0

            if (command.cooldown && (now - last) < (command.cooldown * 1000)) {
                return
            }

            lastInvoke[command.id] = now
            console.log(get(vars))
            const executionInfo = {
                pluginID: command.pluginID,
                type: "chat",
                args: {
                    cmd,
                    parts,
                    tags,
                    config: command.config,
                    vars: get(vars)
                }
            }

            const result = await worker.sendCommand(executionInfo)

            bridge.emit(
                "vars.change",
                result.vars ?? {}
            )
            speak(result)
            chat(result, tags.id)
        }
    )
    comms.on(
        "channel-points-channel-v1",
        async (evt) => {
            const { title } = evt.data.redemption.reward

            const matches = get(commandList).filter(
                cmd => cmd.redeem === title
            )

            const results = await Promise.all(
                matches.map(
                    cmd => worker.sendCommand({
                        pluginID: cmd.pluginID,
                        type: "redeem",
                        args: {
                            redemption: evt.data.redemption,
                            config: cmd.config
                        }
                    })
                )
            )

            for (const result of results) {
                speak(result)
                chat(result)
            }
        }
    )

    comms.on(
        "connect",
        (evt) => connected.update(
            (current) => ({
                ...current,
                [evt.data]: true,
                either: true,
            })
        )
    )
    comms.on(
        "connect",
        (evt) => {
            if (evt.data !== "chat") {
                return
            }
            say(joinMessage)
        }
    )
    comms.on(
        "disconnect",
        (evt) => connected.update(
            (current) => {
                const next = {
                    ...current,
                    [evt.data]: false,
                }
                next.either = (next.chat || next.pubsub)
                return next
            }
        )
    )

    comms.connect()
}
const leave = (leaveMessage) => {
    say(leaveMessage)
    comms.disconnect()
}

export { connected }
export default {
    join,
    leave
}
