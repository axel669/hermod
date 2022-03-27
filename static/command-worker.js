console.log("Command worker running o7")

const commandMap = {
    "text": {
        chat: async (info) => {
            const {settings: {response}, parts, trigger} = info
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
                    .replace(/\$\{user\}/g, trigger.tags.displayName)
            }
        }
    }
}

const genID = () =>
    Date.now().toString(16)
const commands = {
    load: async (args) => {
        const { scriptURL, author, name, version, id } = args
        console.log("importing", author, name, version)
        const {settings, ...triggers} = await import(scriptURL)
        const loadID = id ?? genID()
        commandMap[loadID] = triggers
        console.log(commandMap)
        return {
            author,
            name,
            version,
            id: loadID,
            settings: settings ?? [],
            triggers: Object.keys(triggers),
            label: `${name} v${version}`,
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
        const { id } = args

        console.log(`Unloading ${id}`)

        delete commandMap[id]

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
