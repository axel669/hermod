const get = async (url, options = {}) => {
    const {
        headers = {},
        params = {}
    } = options
    const paramString = new URLSearchParams(params).toString()

    const res = await fetch(
        `${url}?${paramString}`,
        {
            credentials: "include",
            headers
        }
    )
    if(res.status !== 200) {
        return new Error(res.statusText)
    }
    return await res.json()
}
const post = async (url, options = {}) => {
    const {
        headers = {},
        data,
        dataType,
    } = options

    const fetchOptions = {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": dataType
        },
        body: data,
        credentials: "include",
    }
    const res = await fetch(url, fetchOptions)
    if (res.status !== 200) {
        return new Error(res.statusText)
    }
    return await res.json()
}
const postJSON = async (url, data, options = {}) =>
    post(
        url,
        {
            ...options,
            data: JSON.stringify(data),
            dataType: "application/json"
        }
    )

export default {
    get,
    post,
    postJSON,
}
