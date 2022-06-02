console.log("Command worker running o7")

const cmd = {
    inc(name, value) {
        if (value === undefined) {
            return 1
        }
        return value + 1
    },
    dec(name, value) {
        if (value === undefined) {
            return -1
        }
        return value - 1
    },
    reset(name) {
        return 0
    },
    set(name, value) {
        return value
    }
}
function variableValue(name, {parts, tags, vars}) {
    if (name === "user") {
        return tags.displayName
    }
    if (name === "message") {
        return parts.join(" ")
    }
    if (/^\d+$/.test(name) === true) {
        return parts[parseInt(name) - 1] ?? ""
    }
    if (name.startsWith("$") === true) {
        return vars[variableValue(name.slice(1), info)] ?? 0
    }
    return vars[name] ?? 0
}
function textVariables(text, parts, tags, vars) {
    const changedVars = {}
    const info = { parts, tags, vars }
    const chat = text.replace(
        /\$\{(.+?)\}/g,
        function(_, input) {
            if (input === "user" || input === "message") {
                return variableValue(input, info)
            }

            const [command, variable] = input.split(/\s+/)
            if (variable === undefined) {
                return variableValue(command, info)
            }

            changedVars[variable] = cmd[command](
                variable,
                variableValue(variable, info)
            )
            return changedVars[variable]
        }
    )

    return {chat, vars: changedVars}
}
const pluginMap = {
    "text": {
        chat: async (args) => {
            const { parts, tags, config, vars } = args
            return {
                ...textVariables(config.text, parts, tags, vars),
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
        redeem: async (args) => {
            const { redemption, config } = args
            return {
                speak: redemption.user_input
            }
        },
    },
    "speech": {
        chat: async (args) => {
            const { parts, tags, config } = args
            return {
                speak: textVariables(config.text, parts, tags).chat
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

        console.log(executionInfo)
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
