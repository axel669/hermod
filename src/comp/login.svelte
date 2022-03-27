<script>
    import { Button, Icon } from "svelte-doric"

    let form = null
    const clientID = "mrz3t77h5octc2glld7a2qaw8vuo7q"
    const redirectURI = location.origin
    const responseType = "token"
    const scope = [
        "openid",
        "user:read:email",
        "channel:read:redemptions",
        "channel:read:subscriptions",
        "chat:read",
        "chat:edit",
    ].join(" ")

    const login = () => form.submit()
</script>

<style>
    form {
        --button-primary: #9146FF;
        --button-primary-text: var(--text-normal);

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<form action="https://id.twitch.tv/oauth2/authorize" bind:this={form}>
    <input type="hidden" name="client_id" value={clientID} />
    <input type="hidden" name="redirect_uri" value={redirectURI} />
    <input type="hidden" name="response_type" value={responseType} />
    <input type="hidden" name="scope" value={scope} />
    <Button on:tap={login} variant="fill" color="primary" round="40px">
        <Icon name="twitch:brands" />
        Login with Twitch
    </Button>
</form>
