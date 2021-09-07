console.log("Command worker running o7")

const commandMap = {
    "simple": async (info) => {
        const {settings: {response}, parts, user} = info
        return {
            say: response
                .replace(
                    /\$\{(\d)\}/g,
                    (matched, n) => {
                        const index = parseInt(n)
                        if (isNaN(n)) {
                            return matched
                        }
                        return parts[index - 1]
                    }
                )
                .replace(/\$\{user\}/g, user["display-name"])
        }
    }
}
const settingsMap = {}

const commands = {
    load: async (args) => {
        const { scriptURL, author, command, version } = args
        console.log("importing", author, command, version)
        const name = `${author}:${command}:${version}`
        const commandInfo = await import(scriptURL)
        commandMap[name] = commandInfo.default
        settingsMap[name] = commandInfo.settings
        return {
            author,
            command,
            version,
            name,
            settings: settingsMap[name]
        }
    },
    exec: async (args) => {
        const { name, ...commandArgs } = args
        if (commandMap[name] === undefined) {
            throw new Error("command not found")
        }

        return await commandMap[name](commandArgs)
    },
    unload: async (args) => {
        const { author, command, version } = args
        const name = `${author}:${command}:${version}`

        delete commandMap[name]
        delete settingsMap[name]

        return {success: true}
    }
}

addEventListener(
    "message",
    async (evt) => {
        const { data, ports } = evt
        const { type, args } = data

        try {
            const result = await commands[type](args)
            ports[0].postMessage({ result })
        }
        catch (error) {
            console.error(error)
            ports[0].postMessage({
                error: error.message
            })
        }
    }
)
