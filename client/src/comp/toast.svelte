<script context="module">
    import { writable } from "svelte/store"
    import { slide } from "svelte/transition"

    const message = writable("")
    let timeout = null
    const toast = (msg) => {
        message.set(msg)
        clearTimeout(timeout)
        timeout = setTimeout(
            () => message.set(""),
            5000
        )
    }

    export { toast }
</script>

<script>
    import {
        Portal
    } from "svelte-doric"

    const close = () => message.set("")
</script>

<style>
    toast-area {
        position: fixed;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 320px;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        padding: 12px;
        border-radius: 4px;
        z-index: 1000;
        border: 1px solid var(--text-normal);
    }
    /* toast-area:empty {
        display: none;
    } */
</style>

<Portal>
    {#if $message}
        <toast-area transition:slide on:tap={close}>
            {$message}
        </toast-area>
    {/if}
</Portal>
