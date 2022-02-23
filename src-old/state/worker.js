import {parseURL, genScriptURL} from "@/plugin/info"

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
    loadScript: (url) => {
        const info = parseURL(url)

        if (info === null) {
            return
        }

        const scriptURL = genScriptURL(info)

        return workerCall({
            type: "load",
            args: {scriptURL, ...info }
        })
    },
    execScript: (args) => workerCall({
        type: "exec",
        args,
    }),
    unloadScript: (plugin) => workerCall({
        type: "unload",
        args: {
            name: plugin.name,
            version: plugin.version,
            auithor: plugin.author,
        }
    })
}
