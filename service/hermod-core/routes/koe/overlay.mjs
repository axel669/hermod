export default {
    "args": {
        userID: "string",
        roomID: "string",
    },
    "value": {
        "?name": "string",
        "?pitch": "number",
        "?speakingRate": "number",
        "?preset": "string",
        "?redeem": "string",
        // "rtcID": "string",
    },
    async func(args, context) {
        const { redisConnector } = context

        const redis = await redisConnector()
        const key = `${args.userID}.koe`

        const vars = await redis.json.get(key, ".")

        if (vars === null || vars.rtcID !== args.roomID) {
            return {}
        }

        return vars
    }
}
