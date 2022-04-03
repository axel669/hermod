<script>
    import {
        Button,
        CircleSpinner as Spinner,
        Icon,
        Paper,
        Text,
        TextInput,
        TitleBar,
    } from "svelte-doric"

    import { Action, Flex, Grid } from "svelte-doric/layout"

    import http from "@/comm/http"
    import user from "@/state/user"
    import settings from "@/state/settings"
    import bridge from "@/comm/bridge"

    import twitch, {connected} from "./bot/twitch"

    let joinMessage = $settings.joinMessage
    let leaveMessage = $settings.leaveMessage
    // let joinMessage = "bot has joined!"
    // let leaveMessage = "bot is leaving 👋"
    // let joinMessage = ""
    // let leaveMessage = ""

    let connecting = false

    const join = async () => {
        connecting = true
        await twitch.join($user, joinMessage)
        connecting = false
    }
    const leave = async () => {
        twitch.leave(leaveMessage)
    }

    $: if (joinMessage !== $settings.joinMessage) {
        bridge.emit(
            "settings.change",
            { "joinMessage.$set": joinMessage }
        )
    }
    $: if (leaveMessage !== $settings.leaveMessage) {
         bridge.emit(
            "settings.change",
            { "leaveMessage.$set": leaveMessage }
        )
    }
</script>

<style>
    div {
        text-align: center;
    }
</style>

<Paper card>
    <TitleBar compact>
        Bot Status
    </TitleBar>

    <Action>
        <Flex direction="column" gap="2px" padding="2px">
            <Grid cols={2}>
                <Text adorn>
                    Chat
                    <span class="fa-stack">
                        <i class="fas fa-wifi fa-stack-1x" />
                        {#if $connected.chat === false}
                            <i class="fas fa-slash fa-stack-1x" />
                        {/if}
                    </span>
                </Text>
                <Text adorn>
                    PubSub
                    <span class="fa-stack">
                        <i class="fas fa-wifi fa-stack-1x" />
                        {#if $connected.pubsub === false}
                            <i class="fas fa-slash fa-stack-1x" />
                        {/if}
                    </span>
                </Text>
            </Grid>

            <TextInput
            label="Join Message"
            variant="outline"
            bind:value={joinMessage}
            />
            <TextInput
            label="Leave Message"
            variant="outline"
            bind:value={leaveMessage}
            />
        </Flex>

        <Flex direction="column" gap="2px" padding="2px">
        {#if connecting}
            <div>
                <Spinner size={40} /> Connecting
            </div>
        {:else}
            {#if $connected.either}
                <Button on:tap={leave} variant="outline" color="primary">
                    Disconnect
                </Button>
            {:else}
                <Button on:tap={join} variant="outline" color="secondary">
                    Connect
                </Button>
            {/if}
        {/if}
        </Flex>
    </Action>
</Paper>
