console.log("hi from a worker")

const commandMap = {}

const commands = {
    load: async (name, args) => {
        const {url} = args
        const commandInfo = await import(url)
        commandMap[name] = commandInfo.default
        return true
    },
    exec: async (name, args) => {
        if (commandMap[name] === undefined) {
            throw new Error("command not found")
        }

        return await commandMap[name](args)
    },
}

addEventListener(
    "message",
    async (evt) => {
        const {data, ports} = evt
        const {type, name, args} = data

        try {
            const result = await commands[type](name, args)
            ports[0].postMessage({result})
        }
        catch (error) {
            console.error(error)
            ports[0].postMessage({
                error: error.message
            })
        }
    }
)
