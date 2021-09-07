<script>
    import pattern from "url-pattern"
    import Button from "svelte-doric/core/button"

    import request from "../comms/request"

    const testURL = "https://github.com/axel669/axel-bot-roll-command/releases/tag/0.1.0"
    const releasePattern = new pattern(
        "https\\://github.com/(:user)/(:command)/releases/tag/*"
    )

    const importScript = async (url) => {
        const info = releasePattern.match(testURL)

        if (info === null) {
            return
        }

        const {user, command, _: version} = info
        const scriptURL =
            `https://cdn.jsdelivr.net/gh/${user}/${command}@${version}/command.js`
        const settingsURL =
            `https://cdn.jsdelivr.net/gh/${user}/${command}@${version}/settings.json`

        const [commandText, settingsTemplate] = await Promise.all([
            request.get({url: scriptURL, type: "text"}),
            request.get({url: settingsURL}),
        ])

        // console.log(commandText)
        // console.log(settingsTemplate)
    }
</script>

<Button variant="outline" color="primary" on:tap={importScript}>
    Import Command Script
</Button>
