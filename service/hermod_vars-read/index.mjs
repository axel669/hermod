import { createClient } from "redis"
import jwt from "jsonwebtoken"
import cookie from "cookie"

const stageClient = {}
async function getConnection(options) {
    const { url } = options

    if (stageClient[url] !== undefined) {
        return stageClient[url]
    }

    const client = createClient(options)
    stageClient[url] = client
    await client.connect()

    return client
}

export async function handler(event) {
    const cookies = cookie.parse(
        event.cookies.join("; ")
    )
    const user = jwt.decode(cookies.obol)
    const { redisURL, redisPassword, redisDB } = event.stageVariables

    const client = await getConnection({
        url: redisURL,
        password: redisPassword,
    })

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: await client.get(user.userID)  ?? "{}"
    }
}
