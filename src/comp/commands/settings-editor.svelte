<script>
    import { writable } from "svelte/store"

    import {
        Checkbox,
        Paper,
        Select,
        TextInput,
        TitleBar,
    } from "svelte-doric"
    import { Flex, Grid } from "svelte-doric/layout"

    import componentMap from "./component-map.js"

    export let type

    export let settings
    export let config
    export let userLevel = "anyone"
    export let enabled
    export let redeem
    export let freq = 60

    let inputFreq = freq.toString()

    const iden = (real) => real

    const options = [
        { label: "Anyone", value: "anyone" },
        { label: "Subscribers", value: "subs" },
        { label: "VIPs", value: "vip" },
        { label: "Moderators", value: "mods" },
        { label: "Broadcaster", value: "caster" },
    ]

    $: config = iden(config, settings)
    $: error = (freq < 15) ? "Must be at least 15 seconds." : null
    $: freq = parseInt(inputFreq)
</script>

<style>
    user-level-selected {
        display: inline;
        flex-grow: 1;
    }
</style>

<Paper card width="initial">
    <TitleBar compact>
        Settings
    </TitleBar>
    <Flex direction="column">
        {#if type === "redeem"}
            <TextInput label="Redeem Name" bind:value={redeem} />
        {/if}
        {#if type === "timer"}
            <TextInput
                label="Frequency (in seconds)"
                type="number"
                extra="{error ?? ""} 60 -> every minute"
                error={error !== null}
                bind:value={inputFreq}
            />
        {/if}
        <!-- <Grid cols={2} padding="0px"> -->
        <Checkbox bind:checked={enabled} color="secondary">
            Enabled
        </Checkbox>

        {#if type === "chat"}
            <Select
            bind:value={userLevel}
            label="User Level"
            {options}
            let:selected>
                <user-level-selected slot="selected">
                    User Level: {selected.label}
                </user-level-selected>
            </Select>
        {/if}
        <!-- </Grid> -->

        {#each settings as input}
            <svelte:component
                this={componentMap[input.type]}
                label={input.label}
                bind:value={config[input.name]}
            />
        {/each}
    </Flex>
</Paper>
