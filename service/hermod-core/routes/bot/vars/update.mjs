export default {
    args: {
        vars: "unsafeAny"
    },
    value: "bool",
    async func(args, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.bot.vars`

        await redis.set(
            key,
            JSON.stringify(args.vars)
        )

        return true
    }
}
