<script>
    import {
        Adornment,
        Avatar,
        Button,
        Icon,
        Paper,
        Tabs,
        TabPanel,
        TitleBar,
    } from "svelte-doric"

    import "@/state/command-timers"

    import ThemeSelector from "./theme-selector.svelte"

    import Bot from "./bot.svelte"
    import Commands from "./commands.svelte"
    import Plugins from "./plugins.svelte"

    import Toast from "./toast.svelte"

    import http from "@/comm/http"
    import user from "@/state/user"

    const logout = async () => {
        const success = await http.get(
            "https://api.axel669.net/cerberus/logout"
        )
        if (success !== true) {
            return
        }
        $user = false
    }

    let tabGroup = "bot"
    const options = [
        { label: "Bot", value: "bot" },
        { label: "Plugins", value: "plugins" },
        { label: "Commands", value: "commands" },
    ]
</script>

<style>
    multi-button {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
</style>

<Toast />

<Paper center square width="min(720px, 100%)">
    <TitleBar sticky>
        <Avatar image={$user.profileImage} />
        &nbsp;
        {$user.displayName}

        <Adornment slot="action">
            <multi-button>
                <ThemeSelector />
                <Button on:tap={logout}>
                    <Icon name="arrow-right-from-bracket" />
                </Button>
            </multi-button>
        </Adornment>

        <Adornment slot="extension" flush>
            <Tabs bind:tabGroup {options} />
        </Adornment>
    </TitleBar>

    <TabPanel {tabGroup} value="bot">
        <Bot />
    </TabPanel>

    <TabPanel {tabGroup} value="plugins">
        <Plugins />
    </TabPanel>

    <TabPanel {tabGroup} value="commands">
        <Commands />
    </TabPanel>
</Paper>
