import http from "./http.js"

const apiURL = "https://api.axel669.net/hermod"

function get(route, options) {
    return http.get(`${apiURL}${route}`, options)
}
function postJSON(route, data, options) {
    return http.postJSON(`${apiURL}${route}`, data, options)
}

async function login(key) {
    const result = await postJSON(
        "/login",
        { key }
    )

    if (result === true) {
        return
    }
    console.log("Login failed")
}

async function currentUser() {
    return await get("/user")
}

async function readSettings() {
    return await get("/settings")
}
async function saveSettings(settings) {
    return await postJSON("/settings", settings)
}

export default {
    login,
    currentUser,
    readSettings,
    saveSettings,
}
