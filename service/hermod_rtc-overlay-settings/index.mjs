import redisConnection from "/opt/redis-connection/index.mjs"

export async function handler(event) {
    const info = JSON.parse(event.body)

    const redis = await redisConnection(
        event.stageVariables.redisURL,
        event.stageVariables.redisPassword
    )

    const settings = await redis.json.get(`${info.userID}.koe`, ".")
    if (settings === null || settings.rtcID !== info.roomID) {
        return {}
    }

    return settings
}
