<script>
    import {createEventDispatcher} from "svelte"

    import Button from "svelte-doric/core/button"
    import Card from "svelte-doric/core/Card"
    import Popover from "svelte-doric/core/popover"
    import TextInput from "svelte-doric/core/text-input"

    import ActionLayout from "svelte-doric/core/layout/action"
    import FlexLayout from "svelte-doric/core/layout/flex"
    import GridLayout from "svelte-doric/core/layout/grid"

    export let text

    let visible = false
    const open = () => visible = true
    const close = () => visible = false

    let username = ""
    let password = ""
    const dispatch = createEventDispatcher()
    const save = () => {
        dispatch(
            "save",
            {username, password}
        )
        close()
    }
</script>

<Popover {visible}>
    <Button color="primary" variant="fill" on:tap={open}>
        {text}
    </Button>
    <svelte:fragment slot="content">
        <Card>
            <svelte:fragment slot="title">
                Bot Login Config
            </svelte:fragment>

            <ActionLayout>
                <form autocomplete="off">
                    <FlexLayout direction="column">
                        <TextInput
                            bind:value={username}
                            variant="outline"
                            label="Bot Username"
                        />
                        <TextInput
                            bind:value={password}
                            type="password"
                            variant="outline"
                            label="OAuth Pasword"
                            autocomplete="new-password"
                        />
                    </FlexLayout>
                </form>

                <GridLayout cols={2}>
                    <Button color="danger" variant="fill" on:tap={close}>
                        Cancel
                    </Button>
                    <Button color="secondary" variant="fill" on:tap={save}>
                        Save
                    </Button>
                </GridLayout>
            </ActionLayout>
        </Card>
    </svelte:fragment>
</Popover>
