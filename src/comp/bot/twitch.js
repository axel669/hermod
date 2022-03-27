import { writable } from "svelte/store"

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
const speak = (message, voice = "UK English Male") => {
    responsiveVoice.speak(message, voice)
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

    comms.on(
        "chat.message",
        (evt) => {
            if (evt.data.message.startsWith("!greetings") === false) {
                return
            }

            const replyID = evt.data.tags.id
            say("Hi peachyWave", replyID)
            // speak(`Hi ${evt.data.tags.displayName}`)
        }
    )
    comms.on(
        "channel-points-channel-v1",
        (evt) => {
            const redeem = evt.data.redemption.reward.title

            if (redeem !== "Posh Idea Theft") {
                return
            }

            const msg = evt.data.redemption.user_input
            speak(msg)
            // const msg = evt.data.redemption.user_input
            // if (msg === undefined) {
            //     return
            // }

            // const name = evt.data.redemption.user.display_name
            // say(
            //     `hey @axel669 you should read things. ${name} said ${msg}`
            // )
            // console.log(evt)
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
