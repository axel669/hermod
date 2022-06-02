import Pusher from "pusher"

export default {
    "args": {
        "?name": "string",
        "?pitch": "number",
        "?speakingRate": "number",
        "?preset": "string",
        "rtcID": "string",
        "?redeem": "string"
    },
    "value": {
        "success": "bool"
    },
    async func(args, context) {
        const { redisConnector, user, stage } = context

        const redis = await redisConnector()
        const key = `${user.userID}.koe`

        await redis.json.set(key, ".", args)

        const pusher = new Pusher({
            appId: "1217767",
            key: "899b707ba67ecd6e8aa3",
            secret: stage.pusher_secret,
            cluster: "us3",
            useTLS: true
        })

        await pusher.trigger(
            args.rtcID,
            "settings",
            args
        )

        return { success: true }
    }
}
