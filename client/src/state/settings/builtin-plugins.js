const builtIns = {
    text: {
        triggers: ["chat", "redeem", "timer"],
        settings: [
            { label: "Response", type: "text", name: "text" },
            { label: "Reply to Message", type: "bool", name: "reply" },
        ],
        author: "<hermod>",
        version: "0.1",
        name: "Text Response",
        id: "text",
        label: "Text Reponse",
    },
    speech: {
        triggers: ["chat", "redeem"],
        settings: [
            { label: "Text to Say", type: "text", name: "text" },
        ],
        author: "<hermod>",
        version: "0.1",
        name: "Text to Speech",
        id: "speech",
        label: "Text to Speech",
    },
}

export default builtIns
