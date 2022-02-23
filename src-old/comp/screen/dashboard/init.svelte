<script>
    import Adornment from "svelte-doric/core/adornment"
    import Button from "svelte-doric/core/button"
    import Spinner from "svelte-doric/core/circle-spinner"
    import Text from "svelte-doric/core/text"
    import TextInput from "svelte-doric/core/text-input"

    import FlexLayout from "svelte-doric/core/layout/flex"

    import pluginSettings from "@/plugin/settings"
    import settings from "@/state/settings"
    import crypto from "@/state/crypto"
    import worker from "@/state/worker"

    import fulla from "@/comms/fulla"

    let loading = false
    let password = null
    let error = ""

    const loadSettings = async () => {
        loading = true
        error = ""
        try {
            await crypto.generateKey(password)

            const raw = await fulla.load()

            if (raw === "null") {
                console.log("creating settings")
                settings.load({})
                await fulla.save(
                    await crypto.encrypt({})
                )
                return
            }

            const info = await crypto.decrypt(raw)

            const pluginList = await Promise.all(
                info.plugins.map(
                    plugin => worker.loadScript(plugin.url)
                )
            )

            const loadedSettings = pluginList.reduce(
                (settings, {result}) => ({
                    ...settings,
                    [result.name]: result.settings
                }),
                $pluginSettings
            )

            pluginSettings.set(loadedSettings)
            settings.load(info)
        }
        catch (err) {
            error = "Invalid master password"
        }
        loading = false
    }
</script>

<style>
    screen-wrapper {
        margin: auto;
        width: min(100%, 640px);
        display: block;
    }
</style>

<screen-wrapper>
    <FlexLayout direction="column">
        <div>
            <Text color="primary" block>
                What is the master password?
            </Text>
            <Text variant="secondary">
                The master password is a password that is used to securely store
                the settings for the bot (since there is a password in it).
            </Text>

            <Text color="primary" block>
                What if I haven't registered already?
            </Text>
            <Text variant="secondary">
                If you have not used the bot before, then entering a new
                master password will automatically setup your account using
                that password, and you will be able to use it to login anytime.
            </Text>
        </div>
        <TextInput
            type="password"
            bind:value={password}
            label="Master Password"
            variant="outline"
            {error}
        >
            <Adornment position="end">
                {#if loading}
                    <Spinner size={28} />
                {/if}
            </Adornment>
        </TextInput>

        <Button
            on:tap={loadSettings}
            disabled={loading}
            variant="outline"
            color="primary"
        >
            Load Settings
        </Button>
    </FlexLayout>
</screen-wrapper>
