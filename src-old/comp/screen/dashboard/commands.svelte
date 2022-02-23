<script>
    import ActionArea from "svelte-doric/core/action-area"
    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/card"
    import Dialog from "svelte-doric/core/dialog"
    import Confirm from "svelte-doric/core/dialog/confirm"
    import Icon from "svelte-doric/core/icon"
    import RadioButtons from "svelte-doric/core/radio/buttons"
    import Text from "svelte-doric/core/text"

    import Flex from "svelte-doric/core/layout/flex"
    import Grid from "svelte-doric/core/layout/grid"

    import NewCommand from "./commands/new-command.svelte"
    import SettingsEditor from "./commands/settings-editor.svelte"

    import update from "@axel669/immutable-update"
    import sort from "@axel669/array-sort"

    import settings from "@/state/settings"
    import worker from "@/state/worker"

    import pluginSettings from "@/plugin/settings"

    // $: console.log($pluginSettings)

    let newCommand = null
    let editCommand = null
    let confirm = null
    const addCommand = async () => {
        const command = await newCommand.show({
            title: "New Command",
        })

        if (command === undefined) {
            return
        }

        settings.update({
            "commands.$apply": (commands) => [
                ...commands,
                {
                    ...command,
                    enabled: false,
                    settings: null
                }
            ]
        })
    }
    const remove = async (command) => {
        const shouldRemove = await confirm.show({
            title: "Delete Command?",
            message: `Are you sure you want to delete ${command.name}?`
        })

        if (shouldRemove !== true) {
            return
        }

        settings.update({
            "commands.$apply": (list) => list.filter(cmd => cmd !== command)
        })
    }
    const edit = async (command) => {
        const changed = await editCommand.show({
            command
        })

        if (changed === undefined) {
            return
        }

        settings.updateCommand(
            command,
            {...command, ...changed}
        )
    }

    // const filters = [
    //     { label: "All", value: null, color: "secondary" },
    //     { label: "Chat Commands", value: "chat", color: "secondary" },
    //     { label: "Timers", value: "timer", color: "secondary" },
    // ]
    // let filter = null
    const commandSort = sort.map(
        item => item.name,
        sort.string
    )
    $: commands = ($settings.commands ?? []).sort(commandSort)
    // $: commandList = commands.filter(
    //     cmd => (filter === null || cmd.type === filter)
    // )
    // $: console.log(commands)
</script>

<style>
    command-info {
        display: grid;
        /* grid-template-columns: 48px auto 48px; */
        padding: 4px;
        height: 24px;
    }

    command-name {
        display: flex;
        align-items: center;
        font-size: var(--text-size-header);
    }
</style>

<Dialog component={NewCommand} bind:this={newCommand} persistent />
<Dialog component={SettingsEditor} bind:this={editCommand} persistent />
<Dialog component={Confirm} bind:this={confirm} persistent />

<Flex direction="column">
    <Button on:tap={addCommand} color="primary" variant="outline">
        <Icon name="add" />New Command
    </Button>
    <Grid cols={2} padding="0px" gap="4px">
        {#each commands as command (command)}
            <Button
            color={command.enabled ? "secondary" : "danger"}
            variant="outline"
            on:tap={() => edit(command)}
            >
                {command.name}
            </Button>
            <!-- <Card color={command.enabled ? "secondary" : "danger"}>
                <svelte:fragment slot="title">
                    <command-name>
                        <Icon name={command.type} /> {command.name}
                    </command-name>
                </svelte:fragment>
                <ActionArea on:tap={() => edit(command)}>
                    <command-info>
                        <Button on:tap={() => edit(command)} color="primary">
                            <Icon name="edit" />
                        </Button>

                        <div>
                            <Text block variant="secondary">
                                Enabled: {command.enabled}
                            </Text>
                            <Text block variant="secondary">
                                Plugin: {command.plugin}
                            </Text>
                        </div>

                        <Button on:tap={() => remove(command)} color="danger">
                            <Icon name="delete" />
                        </Button>
                    </command-info>
                </ActionArea>
            </Card> -->
            <!-- <Card color={command.enabled ? "secondary" : "danger"}>
                <svelte:fragment slot="title">
                    <command-name>
                        <Icon name={command.type} /> {command.name}
                    </command-name>
                </svelte:fragment>
                <command-info>
                    <Button on:tap={() => edit(command)} color="primary">
                        <Icon name="edit" />
                    </Button>

                    <div>
                        <Text block variant="secondary">
                            Enabled: {command.enabled}
                        </Text>
                        <Text block variant="secondary">
                            Plugin: {command.plugin}
                        </Text>
                    </div>

                    <Button on:tap={() => remove(command)} color="danger">
                        <Icon name="delete" />
                    </Button>
                </command-info>
            </Card> -->
        {/each}
    </Grid>
</Flex>
