console.log("Command worker running o7")

function textVariables(text, parts, tags) {
    return text.replace(
        /\$\{(\d)\}/g,
        (matched, n) => {
            const index = parseInt(n)
            if (isNaN(n)) {
                return matched
            }
            return parts[index - 1]
        }
    )
    .replace(/\$\{user\}/g, tags.displayName)
    .replace(/\$\{message\}/g, parts.join(" "))
}
const pluginMap = {
    "text": {
        chat: async (args) => {
            const { parts, tags, config } = args
            return {
                chat: textVariables(config.text, parts, tags),
                reply: config.reply,
            }
        },
        timer: async (args) => {
            const { parts, tags, config } = args
            return {
                // chat: textVariables(config.text, parts, tags)
                chat: config.text
            }
        },
    },
    "speech": {
        chat: async (args) => {
            const { parts, tags, config } = args
            return {
                speak: textVariables(config.text, parts, tags)
            }
        },
        redeem: async (args) => {
            const { redemption, config } = args
            return {
                speak: redemption.user_input
            }
        },
    },
}

const genID = () =>
    Date.now().toString(16)
const commands = {
    load: async (args) => {
        const { scriptURL, author, name, version, id } = args
        console.log("importing", author, name, version)
        const {settings, ...triggers} = await import(scriptURL)
        const loadID = id ?? genID()
        pluginMap[loadID] = triggers
        console.log(pluginMap)
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
    exec: async (executionInfo) => {
        const { pluginID, type, args } = executionInfo
        if (pluginMap[pluginID] === undefined) {
            throw new Error("plugin not found")
        }

        return await pluginMap[pluginID][type](args)
    },
    unload: async (args) => {
        const { id } = args

        console.log(`Unloading ${id}`)

        delete pluginMap[id]

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
