const fs = require("fs-extra")
const path = require("path")

export default (from, to) => ({
    buildEnd: (error) => {
        if (error !== undefined) {
            return
        }

        const source = path.resolve(from)
        const dest = path.resolve(to)

        if (fs.pathExistsSync(source) === false) {
            console.log("Skip copying files, source not found")
            return
        }

        fs.ensureDirSync(dest)
        fs.copySync(source, dest)
    }
})
