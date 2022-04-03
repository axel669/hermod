import { S3 } from "@aws-sdk/client-s3"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import { Response } from "node-fetch"

const s3 = new S3()

const defaultSettings = JSON.stringify({
    plugins: {},
    commands: {},
    joinMessage: "bot has joined!",
    leaveMessage: "bot is leaving 👋",
})

export async function handler(event) {
    const settings = event.body
    const cookies = cookie.parse(
        event.cookies.join("; ")
    )
    const user = jwt.decode(cookies.obol)

    try {
        const { Body } = await s3.getObject({
            Bucket: "hermod-settings",
            Key: `${user.userID}.settings.json`,
        })

        return {
            statusCode: 200,
            body: await new Response(Body).text()
        }
    }
    catch (err) {
        return {
            statusCode: 200,
            body: defaultSettings,
        }
    }
}
