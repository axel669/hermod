import {writable} from "svelte/store"
import eventBridge from "pubsub-js"

let pubsub = null
const tpsConnected = writable(false)

const join = async (user) => {
    pubsub = new WebSocket("wss://pubsub-edge.twitch.tv")

    const nonce = Date.now().toString(16)
    pubsub.addEventListener(
        "open",
        () => {
            pubsub.send(
                JSON.stringify({ type: "PING" })
            )
            pubsub.send(
                JSON.stringify({
                    type: "LISTEN",
                    nonce,
                    data: {
                        auth_token: user.token,
                        topics: [
                            `channel-points-channel-v1.${user.userID}`
                        ]
                    }
                })
            )
        }
    )
    pubsub.addEventListener(
        "message",
        ({ data }) => {
            const event = JSON.parse(data)

            if (event.type === "MESSAGE") {
                const realEvent = JSON.parse(event.data.message)
                eventBridge.publish(realEvent.type, realEvent.data)
                return
            }

            if (event.type === "RESPONSE") {
                tpsConnected.set(true)
                return
            }

            console.log(event)
        }
    )

    pubsub.addEventListener(
        "close",
        () => tpsConnected.set(false)
    )
}
const leave = () => {
    pubsub.close()
}

export {tpsConnected}
export default {join, leave}
