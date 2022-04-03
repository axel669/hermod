import { writable } from "svelte/store"

const theme = writable(
    localStorage.theme ?? "light"
)
theme.subscribe(
    currentTheme => localStorage.theme = currentTheme
)

export default theme
