import user from "./user"

const hex = {
    fromArray: source =>
        [...new Uint8Array(source)]
            .map(
                (value) => value.toString(16).padStart(2, "0")
            )
            .join(""),
    toArray: source => new Uint8Array(
        source.match(/[0-9a-f]{2}/gi)
            .map(value => parseInt(value, 16))
    )
}
const userID = (user === null) ? "some random text" : user.info.sub.toString()
const encoder = new TextEncoder()
const decoder = new TextDecoder("utf-8")
const keyAlgorithm = {
    name: "PBKDF2",
    hash: "SHA-512",
    salt: encoder.encode(userID),
    iterations: 1024
}
const keyOptions = {
    name: 'AES-GCM',
    length: 256
}
const encryptionOptions = {
    name: "AES-GCM",
    iv: encoder.encode(userID)
}

let key = null

export default {
    generateKey: async (password) => {
        key = await crypto.subtle.deriveKey(
            keyAlgorithm,
            await crypto.subtle.importKey(
                "raw",
                encoder.encode(password),
                keyAlgorithm.name,
                false,
                ["deriveKey"]
            ),
            keyOptions,
            false,
            ["encrypt", "decrypt"]
        )
    },
    encrypt: async (settings) => {
        const encryptedBuffer = await crypto.subtle.encrypt(
            encryptionOptions,
            key,
            encoder.encode(
                JSON.stringify(settings)
            )
        )
        return hex.fromArray(encryptedBuffer)
    },
    decrypt: async (message) => {
        const settingsBuffer = await crypto.subtle.decrypt(
            encryptionOptions,
            key,
            hex.toArray(message)
        )
        return JSON.parse(
            decoder.decode(settingsBuffer)
        )
    }
}
