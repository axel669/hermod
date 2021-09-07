import path from "path"

const basePath = path.resolve(process.cwd(), "src")
export default {
    resolveId: (id) => {
        if (id.startsWith("@/") === true) {
            const filePath = path.resolve(
                basePath,
                id.slice(2)
            )
            if (path.extname(filePath) === "") {
                return  `${filePath}.js`
            }
            return filePath
        }
        return undefined
    }
}
