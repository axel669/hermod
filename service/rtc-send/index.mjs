import crypto from "crypto"

import Pusher from "pusher"

import redisConnection from "/opt/redis-connection/index.mjs"

function sha(source, secret) {
    return crypto.createHmac('sha256', secret)
        .update(source)
        .digest('hex')
}

function verify(generated, signature) {
    return crypto.timingSafeEqual(
        Buffer.from(generated),
        Buffer.from(signature)
    )
}

const typeMap = {
    "channel.cheer": "bits",
    "channel.channel_points_custom_reward_redemption.add": "redeem"
}

export async function handler(event) {
    const info = JSON.parse(event.body)
    const { challenge } = info

    if (challenge !== undefined) {
        return {
            headers: {
                "Content-Type": "text/plain",
            },
            statusCode: 200,
            body: challenge,
        }
    }

    // const secret = process.env.twitch_secret
    // const secret = "need a longer secret"
    const secret = event.stageVariables.twitch_secret
    const messageID = event.headers["twitch-eventsub-message-id"]
    const timestamp = event.headers["twitch-eventsub-message-timestamp"]
    const signature = event.headers["twitch-eventsub-message-signature"]

    const valid = (
        messageID !== undefined
        && timestamp !== undefined
        && signature !== undefined
    )
    if (valid === false) {
        return {
            statusCode: 401,
            body: "Nope",
        }
    }

    const hmacMessage = `${messageID}${timestamp}${event.body}`
    const generated = `sha256=${sha(hmacMessage, secret)}`

    if (verify(generated, signature) === false) {
        return {
            statusCode: 401,
            body: "Nope",
        }
    }

    const redis = await redisConnection(
        event.stageVariables.redisURL,
        event.stageVariables.redisPassword
    )

    // const channel = "axel669"
    const rtcInfo = await redis.json.get(
        `${info.event.broadcaster_user_id}.koe`, "."
    )
    const channel = rtcInfo.rtcID
    const type = typeMap[info.subscription.type]

    const pusher = new Pusher({
        appId: "1217767",
        key: "899b707ba67ecd6e8aa3",
        secret: event.stageVariables.pusher_secret,
        cluster: "us3",
        useTLS: true
    })

    await pusher.trigger(
        channel,
        type,
        { message: info }
    )

    return {
        statusCode: 200,
        body: "yup",
    }
}
