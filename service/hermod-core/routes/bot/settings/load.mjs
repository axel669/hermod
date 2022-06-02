const defaultSettings = {
    plugins: {},
    commands: {},
    joinMessage: "bot has joined!",
    leaveMessage: "bot is leaving 👋",
}

export default {
    "args": {},
    "value": "unsafeAny",
    async func(_, context) {
        const { redisConnector, user } = context

        const redis = await redisConnector()
        const key = `${user.userID}.bot.settings`

        const settings = await redis.json.get(key, ".")

        if (settings === null) {
            return defaultSettings
        }

        return settings
    }
}
