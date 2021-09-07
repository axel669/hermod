import user from "../state/user"

const save = async (body) => {
    const response = await fetch(
        "https://api.axel669.net/fulla/save",
        {
            method: "POST",
            headers: {
                "Authorization": `Twitch ${user.token.id}`,
                "Content-Type": "text/plain",
            },
            body,
        }
    )

    return await response.json()
}
const load = async () => {
    const response = await fetch(
        "https://api.axel669.net/fulla/load",
        {
            method: "GET",
            headers: {
                "Authorization": `Twitch ${user.token.id}`
            }
        }
    )

    return await response.text()
}

export default {save, load}
