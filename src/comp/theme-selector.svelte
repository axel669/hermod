<script>
    import {
        Icon,
        Select,
        Tabs,
        Text,
    } from "svelte-doric"

    import theme from "@/state/theme"

    const iconMap = {
        light: "sun",
        dark: "moon",
        tron: "laptop",
    }
    const themes = [
        { label: "Light", icon: "sun", value: "light" },
        { label: "Dark", icon: "moon", value: "dark" },
        { label: "Tron", icon: "laptop", value: "tron" },
    ]

    $: icon = iconMap[$theme]
</script>

<Select options={themes} bind:value={$theme} label="Theme" {icon} variant="normal">
    <Text slot="selected">
    </Text>
</Select>
