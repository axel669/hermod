<script>
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Spinner from "svelte-doric/core/circle-spinner"
    import Flex from "svelte-doric/core/layout/flex"

    import update from "@axel669/immutable-update"

    import settings from "@/state/settings"
    import chat from "@/state/chat"
    import user from "@/state/user"
    import worker from "@/state/worker"
    import connected from "@/state/connected"

    // import commandSettings from "@/command/settings"

    // window.worker = worker
    const scriptURL = "https://github.com/axel669/axel-bot-roll-command/releases/tag/0.1.2"

    let connecting = false
    // let connected = false
    const connect = async () => {
        chat.configure({
            user: $settings.bot,
            channel: user.info.preferred_username
        })

        connecting = $chat.connect()
        await connecting
        $connected = true

        // console.log("loading scripts")
        // const {result} = await worker.loadScript(scriptURL)
        // console.log($commandSettings, result)
        // commandSettings.set({
        //     ...$commandSettings,
        //     [result.name]: result.settings,
        // })
    }

    const disconnect = async () => {
        await $chat.disconnect()
        $connected = false
    }

    $: status = $connected ? "Connected" : "Disconnected"
</script>

<Card>
    <svelte:fragment slot="title">
        Bot Status: {status}
    </svelte:fragment>
    <Flex direction="column">
        {#if !$connected}
            <Button on:tap={connect} color="secondary">
                {#await connecting}
                    <Spinner size={32} />
                {/await}
                Connect To Chat
            </Button>
        {:else}
            <Button on:tap={disconnect} color="primary">
                Disconnect Bot
            </Button>
        {/if}
    </Flex>
</Card>
