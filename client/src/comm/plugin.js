import pattern from "url-pattern"

const baseURL = "https://cdn.jsdelivr.net/gh"
const releasePattern = new pattern(
    "https\\://github.com/(:author)/(:name)/releases/tag/*"
)

export const parseURL = (url) => {
    const patternInfo = releasePattern.match(url)

    if (patternInfo === null) {
        return
    }

    const { author, name, _: version } = patternInfo

    return {author, name, version}
}

export const genGithubURL = ({ author, name, version }) =>
    `https\\://github.com/${author}/${name}/releases/tag/${version}`
export const genScriptURL = (info) =>
    `${baseURL}/${info.author}/${info.name}@${info.version}/command.js`
