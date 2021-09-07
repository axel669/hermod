const server = require("static-server")

const preview = new server({
	rootPath: "build",
	port: 1337,
})

preview.start(
	() => console.log("started")
)
