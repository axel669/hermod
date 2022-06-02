import http from "./http.js"

const apiURL = "https://api.axel669.net/hermod"

function get(route, options) {
    return http.get(`${apiURL}${route}`, options)
}
function postJSON(route, data, options) {
    return http.postJSON(`${apiURL}${route}`, data, options)
}

async function query(queries) {
    const response = await postJSON("/core", queries)

    return Object.fromEntries(
        Object.entries(response).map(
            function([key, item]) {
                if(item.error !== undefined) {
                    return [key, new Error(item.error)]
                }
                return [key, item.value]
            }
        )
    )
}

window.query = query

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

async function readVars() {
    return await get("/variables")
}
async function saveVars(vars) {
    return await postJSON("/variables", vars)
}

export default {
    login,
    currentUser,
    readSettings,
    saveSettings,
    readVars,
    saveVars,
    query,
}
