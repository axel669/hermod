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
    import { Flex } from "svelte-doric/layout"

    import bridge from "@/comm/bridge"

    import Command from "./commands/command.svelte"
    import NewTextCommand from "./commands/new-text-command.svelte"
    import NewRedeemCommand from "./commands/new-redeem-command.svelte"
    import NewTimerCommand from "./commands/new-timer-command.svelte"

    import twitchAPI from "@/comm/twitch"
    import user from "@/state/user"
    import {commandList} from "@/state/settings"

    let cmdType = null
    const cmdTypes = [
        { label: "Chat", value: "chat", icon: "message" },
        { label: "Redeem", value: "redeem", icon: "circle" },
        { label: "Timer", value: "timer", icon: "hourglass" },
    ]

    $: if (cmdType !== null) {
        create(cmdType)
        cmdType = null
    }

    const newCommandEntry = {
        chat: null,
        redeem: null,
        timer: null,
    }
    const create = async (type) => {
        const newcmd = await newCommandEntry[type].show()

        if (newcmd === null) {
            return
        }

        const id = `${type}:${newcmd.name}`
        bridge.emit(
            "settings.change",
            {
                [`commands.${id}.$set`]: {
                    ...newcmd,
                    id,
                    type,
                }
            }
        )
    }
</script>

<Dialog
    persistent
    bind:this={newCommandEntry.chat}
    component={NewTextCommand}
/>
<Dialog
    persistent
    bind:this={newCommandEntry.redeem}
    component={NewRedeemCommand}
/>
<Dialog
    persistent
    bind:this={newCommandEntry.timer}
    component={NewTimerCommand}
/>
<Paper footer>
    <Flex direction="column">
        {#each $commandList as command}
            <Command {command} />
        {:else}
            <div>
                No commands :(
            </div>
        {/each}
    </Flex>

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
