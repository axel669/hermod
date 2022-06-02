export default {
    args: {
        settings: "unsafeAny"
    },
    value: "bool",
    async func(args, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.bot.settings`

        await redis.set(
            key,
            JSON.stringify(args.settings)
        )

        return true
    }
}
