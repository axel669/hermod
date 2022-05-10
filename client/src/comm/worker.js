import {parseURL, genScriptURL} from "./plugin"

const worker = new Worker("./command-worker.js")

const workerCall = (message) => new Promise(
    (resolve, reject) => {
        const channel = new MessageChannel()
        channel.port1.onmessage = (evt) => {
            if (evt.data.error !== undefined) {
                resolve(new Error(evt.data.error))
            }
            resolve(evt.data.result)
        }
        worker.postMessage(message, [channel.port2])
    }
)

export default {
    importPlugin: (info) => {
        // const info = parseURL(url)

        if (info === null) {
            return
        }

        const scriptURL = genScriptURL(info)

        return workerCall({
            type: "load",
            args: {scriptURL, ...info }
        })
    },
    sendCommand: (args) => workerCall({
        type: "exec",
        args,
    }),
    removePlugin: (plugin) => workerCall({
        type: "unload",
        args: {
            id: plugin.id
        }
    })
}
