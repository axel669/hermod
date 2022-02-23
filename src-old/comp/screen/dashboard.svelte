<script>
    import Adornment from "svelte-doric/core/adornment"
    import Icon from "svelte-doric/core/icon"
    import Tabs from "svelte-doric/core/tabs"
    import TabPanel from "svelte-doric/core/tab-panel"
    import TitleBar from "svelte-doric/core/title-bar"

    import Flex from "svelte-doric/core/layout/flex"

    import BotConfig from "./dashboard/bot-config.svelte"
    import BotStatus from "./dashboard/bot-status.svelte"
    import Commands from "./dashboard/commands.svelte"
    import Plugins from "./dashboard/plugins.svelte"

    import Init from "./dashboard/init.svelte"

    import user from "@/state/user"
    import crypto from "@/state/crypto"
    import fulla from "@/comms/fulla"

    import settings from "@/state/settings"
    import connected from "@/state/connected"
    const pubsub = "wss://pubsub-edge.twitch.tv"

    let tabGroup = "bot"
    let options = [
        {label: "Bot", value: "bot"},
        {label: "Plugins", value: "plugins"},
        {label: "Commands", value: "commands"}
    ]
</script>

<style>
    app-wrapper {
        display: block;
        width: min(100%, 640px);
        margin: auto;
    }

    center-icon {
        display: flex;
        padding: 4px;
        align-items: center;
    }
</style>

<app-wrapper>
    <TitleBar sticky>
        Welcome, {user.info.preferred_username}

        <svelte:fragment slot="adornments">
            <Adornment position="extension">
                <Tabs bind:tabGroup {options} />
            </Adornment>

            <Adornment position="action">
                <center-icon>
                    <Icon name={$connected ? "wifi" : "wifi_off"} />
                </center-icon>
            </Adornment>
        </svelte:fragment>
    </TitleBar>

    <TabPanel value="bot" {tabGroup}>
        <Flex direction="column">
            <BotConfig />
            <BotStatus />
        </Flex>
    </TabPanel>

    <TabPanel value="plugins" {tabGroup}>
        <Plugins />
    </TabPanel>

    <TabPanel value="commands" {tabGroup}>
        <Commands />
    </TabPanel>
</app-wrapper>
