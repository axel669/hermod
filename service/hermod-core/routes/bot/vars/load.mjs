export default {
    "args": {},
    "value": "unsafeAny",
    async func(_, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.bot.vars`

        const vars = await redis.json.get(key, ".")

        if (vars === null) {
            return {}
        }

        return vars
    }
}
