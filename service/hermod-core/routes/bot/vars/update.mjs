export default {
    args: {
        vars: "unsafeAny"
    },
    value: "bool",
    async func(args, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.bot.vars`

        await redis.json.set(key, ".", args.vars)

        return true
    }
}
