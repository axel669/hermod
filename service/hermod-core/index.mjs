import redisConnection from "/opt/redis-connection/index.mjs"
import hermodUser from "/opt/hermod-get-user/index.mjs"

import engine from "axel-query/esm.mjs"

const service = await engine("routes", true)

export async function handler(event) {
    const query = JSON.parse(event.body)
    const user = hermodUser(event)
    const { redisURL, redisPassword } = event.stageVariables

    function redisConnector() {
        return redisConnection(redisURL, redisPassword)
    }

    return service.execute(
        query,
        {
            redisConnector,
            user,
            stage: event.stageVariables
        }
    )
}
