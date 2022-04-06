import {
    TextInput,
} from "svelte-doric"

import Bool from "./editors/bool.svelte"

const componentMap = {
    text: TextInput,
    bool: Bool,
}

export default componentMap
