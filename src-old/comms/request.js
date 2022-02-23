export default {
    get: async (options) => {
        const {
            url,
            headers,
            type = "json",
        } = options

        const response = await fetch(url, {headers})
        return await response[type]()
    }
}
