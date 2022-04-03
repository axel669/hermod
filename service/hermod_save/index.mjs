import { S3 } from "@aws-sdk/client-s3"
import jwt from "jsonwebtoken"
import cookie from "cookie"

const s3 = new S3()

export async function handler(event) {
    const settings = event.body
    const cookies = cookie.parse(
        event.cookies.join("; ")
    )
    const user = jwt.decode(cookies.obol)

    await s3.putObject({
        Bucket: "hermod-settings",
        Key: `${user.userID}.settings.json`,
        Body: settings,
    })

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
    }
}
