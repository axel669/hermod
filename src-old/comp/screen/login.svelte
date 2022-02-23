<script>
    import user from "@/state/user"

    const scope = [
        "openid",
        "user:read:email",
        "channel:read:redemptions",
        "chat:read",
    ].join(" ")
    let form = null

    const autoRelog = false
    // $: autoRelog = (
    //     form !== null
    //     && user === null
    //     && sessionStorage.relog === "true"
    // )
    // $: if (autoRelog) {
    //     form.submit()
    // }
</script>

<style>
    input[type="submit"] {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        padding: 12px;
        font-size: var(--text-size-header);
        background-color: #9146FF;
        color: white;
        border-width: 0px;
        border-radius: 4px;
        cursor: pointer;
        font-family: var(--font);
        font-weight: 500;
    }
</style>

<form action="https://id.twitch.tv/oauth2/authorize" bind:this={form}>
    <input type="hidden" name="client_id" value="mrz3t77h5octc2glld7a2qaw8vuo7q" />
    <input type="hidden" name="redirect_uri" value={location.origin} />
    <input type="hidden" name="response_type" value="token id_token" />
    <input type="hidden" name="scope" value={scope} />
    <input type="submit" value="Login with Twitch" disabled={autoRelog} />
</form>
