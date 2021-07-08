const delay = (time) => new Promise(
    (resolve) => setTimeout(resolve, time)
)

let lastSave = null
const mock = {
    save: async (settings) => {
        if (lastSave === settings) {
            return
        }
        console.log("saving")

        const now = Date.now()
        const obj = {settings, now}
        lastSave = settings

        localStorage.botSettings = JSON.stringify(obj)
    },
    load: async () => {
        await delay(1500)

        lastSave = JSON.parse(
            localStorage.botSettings ?? `{"settings":{}}`
        ).settings
        return lastSave
    }
}

export default mock
