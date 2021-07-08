<script>
    import AppStyle from "svelte-doric/core/app-style"
    import baseline from "svelte-doric/core/baseline"
    import theme from "svelte-doric/core/theme/tron"

    import Spinner from "svelte-doric/core/hexagon-spinner"

    import Button from "svelte-doric/core/button"
    import Text from "svelte-doric/core/text"

    import GridLayout from "svelte-doric/core/layout/grid"
    import FlexLayout from "svelte-doric/core/layout/flex"

    import pattern from "url-pattern"

    import Expandable from "./comp/expandable.svelte"
    import CommandSettings from "./comp/command-settings.svelte"
    import NewCommand from "./comp/new-command.svelte"

    import commandSettings from "./settings"

    const pw = TWITCH_TOKEN

    const client = new tmi.Client({
        connection: {
            secure: true
        },
        identity: {
            username: "axel_669bot",
            password: pw
        },
        channels: ["axel669"]
    })
    const channelID = "64263610"
    const pubsub = "wss://pubsub-edge.twitch.tv"

    const say = (messageText) => client.say("axel669", messageText)

    client.on(
        "message",
        // (style, control, damage, aggression) => {
        (channel, user, message, self) => {
            const msg = message.trim()

            if (user.badges?.hasOwnProperty("broadcaster") === true) {
                user.broadcaster = true
            }
            if (user.badges?.hasOwnProperty("vip") === true) {
                user.vip = true
            }

            user.level = parseInt(
                [user.broadcaster, user.mod, user.vip]
                    .map(flag => flag ? "1" : "0")
                    .join(""),
                2
            )

            console.log(user)

            if (msg.startsWith("!") === false) {
                return
            }

            const [command, ...parts] = msg.slice(1).split(/\s+/)
            const cmd = command.toLowerCase()

            if ($commandSettings[cmd]?.enabled !== true) {
                return
            }

            commands[cmd]({
                user,
                parts,
                say,
                settings: {},
                whisper: (message) => client.whisper(user.username, message)
            })
        }
    )

    const loadCommands = async () => {
        commands = {}
        for (const [command, info] of commandList) {
            await importCommand(command, info)
        }
    }
    const connect = async () => {
        await loadCommands()
        await client.connect()
        console.log("connected")
    }

    const urlPattern = new pattern("https\\://gist.github.com/(:user)/(:gistID)")
    let commands = {}

    const commandSource = [
        ["roll", "https://gist.github.com/axel669/613f9caf5cbbc2e369082a222318a407"],
        ["so-test", "https://gist.github.com/axel669/9ae7d8b04b6da6a5bbe34d43d7382dfe"]
    ]

    const loadGist = async (gistURL) => {
        const sourceInfo = urlPattern.match(gistURL)

        const res = await fetch(`https://api.github.com/gists/${sourceInfo.gistID}`)
        return await res.json()
    }

    const importGist = (command, gistURL) => {
        const gistInfo = loadGist(gistURL)

        const options = JSON.parse(
            gistInfo.files["options.json"]?.content ?? "{}"
        )

        console.log(options)
    }

    const importCommand = async (command, info) => {
        const {enabled, gistURL} = info
        console.log("importing", command, "from", gistURL)

        if (enabled === false) {
            console.log(`Not importing ${command}, disabled`)
            return
        }

        const sourceInfo = urlPattern.match(gistURL)

        const res = await fetch(`https://api.github.com/gists/${sourceInfo.gistID}`)
        const gistInfo = await res.json()

        const sourceCode = gistInfo.files["command.js"].content
        const override = Object.keys(window)

        const init = new Function(...override, sourceCode)

        commands = {
            ...commands,
            [command]: init.call(null),
        }
    }

    const delay = (time) => new Promise(
        (resolve) => setTimeout(resolve, time)
    )

    // const importGist = () => console.log("nope")

    let dirty = false

    commandSettings.subscribe(
        () => dirty = false
    )

    $: commandList = Object.entries($commandSettings ?? {})
</script>

<style>
    app-wrapper {
        display: block;
        margin: auto;
        width: min(100%, 640px);
    }
</style>

<AppStyle {baseline} {theme} />

<app-wrapper>
    <FlexLayout direction="column" class="app">
        <GridLayout cols={2}>
            <Button on:tap={loadCommands} color="primary" variant="fill" disabled={dirty}>
                Refresh Command Scripts
            </Button>
            <Button on:tap={connect} color="secondary" variant="fill" disabled={dirty}>
                Start Bot
            </Button>

            <NewCommand />
        </GridLayout>

        {#if $commandSettings === null}
            <div style="text-align: center;">
                Loading Command Settings
                <br />
                <Spinner size={200} />
            </div>
        {:else}
            <FlexLayout direction="column">
                <!-- {#each commandList as [command, info]} -->
                {#each commandList as [command, info] (command)}
                    <CommandSettings {command} {info} bind:dirty />
                {/each}
            </FlexLayout>
        {/if}
    </FlexLayout>
</app-wrapper>
