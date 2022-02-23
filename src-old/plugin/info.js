import pattern from "url-pattern"

const baseURL = "https://cdn.jsdelivr.net/gh"
const releasePattern = new pattern(
    "https\\://github.com/(:author)/(:command)/releases/tag/*"
)

export const parseURL = (url) => {
    const patternInfo = releasePattern.match(url)

    if (patternInfo === null) {
        return
    }

    const { author, command, _: version } = patternInfo

    return {author, command, version}
}

export const genScriptURL = (info) =>
    `${baseURL}/${info.author}/${info.command}@${info.version}/command.js`
