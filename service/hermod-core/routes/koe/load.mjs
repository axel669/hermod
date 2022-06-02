import { v4 } from "uuid"

export default {
    "args": {},
    "value": {
        "?name": "string",
        "?pitch": "number",
        "?speakingRate": "number",
        "?preset": "string",
        "rtcID": "string",
        "?redeem": "string",
    },
    async func(args, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.koe`
        const settings = await redis.json.get(key, ".")

        if (settings !== null) {
            return settings
        }

        const defSettings = {
            rtcID: v4()
        }

        await redis.json.set(key, ".", defSettings)
        return defSettings
    }
}
