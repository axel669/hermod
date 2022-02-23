<script>
    import {
        Button,
        Footer,
        Paper,
        Select,
        Text,
        TitleBar,
    } from "svelte-doric"
    import { Dialog } from "svelte-doric/dialog"

    import pubsub from "pubsub-js"

    import NewTextCommand from "./commands/new-text-command.svelte"

    import twitchAPI from "@/comm/twitch"
    import user from "@/state/user"
    import settings from "@/state/settings"

    let cmdType = null
    const cmdTypes = [
        { label: "Chat", value: "chat" },
        { label: "Redeem", value: "redeem" },
        { label: "Timer", value: "timer" },
    ]

    $: if (cmdType !== null) {
        create(cmdType)
        cmdType = null
    }

    const newCommand = {
        chat: null,
        redeem: null,
        timer: null,
    }
    const create = async (type) => {
        const newInfo = await newCommand[type].show()
        console.log(newInfo)

        if (newInfo === null) {
            return
        }

        pubsub.publish(
            "settings.change",
            {
                "commands.$push": {
                    trigger: type,
                    info: newInfo,
                    settings: null,
                }
            }
        )
    }
</script>

<Dialog persistent bind:this={newCommand.chat} component={NewTextCommand} />
<Paper footer>
    {#each $settings.commands as command}
        <div>
            {command.info.plugin} - {command.info.command}
        </div>
    {:else}
        <div>
            No commands :(
        </div>
    {/each}

    <Footer>
        <Select
        bind:value={cmdType}
        color="primary"
        options={cmdTypes}
        label="New Command Type"
        slot="middle"
        let:selected
        >
            <Text slot="selected">
                {selected?.label ?? "New Command"}
            </Text>
        </Select>
    </Footer>
</Paper>
