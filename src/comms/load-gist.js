import pattern from "url-pattern"

const urlPattern = new pattern("https\\://gist.github.com/(:user)/(:gistID)")

const loadGist = async (gistURL) => {
    const sourceInfo = urlPattern.match(gistURL)

    const res = await fetch(`https://api.github.com/gists/${sourceInfo.gistID}`)
    return await res.json()
}

export default loadGist
