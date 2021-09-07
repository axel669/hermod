<script>
    import Config from "./bot-config/config.svelte"

    import user from "@/state/user"
    import settings from "@/state/settings"

    const username = user.info.preferred_username
    const client = new tmi.Client({
        connection: {
            secure: true
        },
        identity: {
            username,
            password: `oauth:${user.token.access}`,
        },
        channels: [username]
    })

    const validOauthPW = (pw) => (
        pw.trim() !== ""
        && pw.startsWith("oauth:")
        && pw.length > 6
    )

    $: configured = (
        $settings.bot !== undefined
        && $settings.bot.username.trim() !== ""
        && validOauthPW($settings.bot.password)
    )

    const saveBotLogin = (evt) => {
        settings.update.botLogin(evt.detail)
    }
</script>

{#if configured === false}
    <Config on:save={saveBotLogin} text="Configure Bot Login" />
{:else}
    <Config on:save={saveBotLogin} text="Update Bot Login" />
{/if}
