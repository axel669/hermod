<script>
    import {
        Button,
        Icon,
        Paper,
        Text,
        TextInput,
        TitleBar,
    } from "svelte-doric"

    import { Action, Flex, Grid } from "svelte-doric/layout"

    import http from "@/comm/http"
    import user from "@/state/user"

    import chat, {chatConnected} from "./bot/chat"
    import tps, {tpsConnected} from "./bot/twitch-pubsub"
    // let pubsub = null

    // let joinMessage = "bot has joined!"
    // let leaveMessage = "bot is leaving 👋"
    let joinMessage = ""
    let leaveMessage = ""

    const join = async () => {
        chat.join($user, joinMessage)
        tps.join($user)
    }
    const leave = async () => {
        chat.leave(leaveMessage)
        tps.leave()
    }
</script>

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
                        {#if $chatConnected === false}
                            <i class="fas fa-slash fa-stack-1x" />
                        {/if}
                    </span>
                </Text>
                <Text adorn>
                    PubSub
                    <span class="fa-stack">
                        <i class="fas fa-wifi fa-stack-1x" />
                        {#if $tpsConnected === false}
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
        {#if $chatConnected}
            <Button on:tap={leave} variant="outline" color="primary">
                Disconnect
            </Button>
        {:else}
            <Button on:tap={join} variant="outline" color="secondary">
                Connect
            </Button>
        {/if}
        </Flex>
    </Action>
</Paper>
