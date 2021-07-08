import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import del from "rollup-plugin-delete"
import html from "@rollup/plugin-html"
import replace from "@rollup/plugin-replace"

import copy from "./plugins/copy.js"

import appInfo from "./app-info.js"
import template from "./html-template.js"

export default {
    input: "./src/main.js",
    output: {
        file: `./build/app-d${Date.now()}.js`,
        format: "iife",
    },
    plugins: [
        del({ targets: "./build/*" }),
        svelte(),
        resolve(),
        commonjs(),
        replace({
            preventAssignment: true,
            values: {
                "TWITCH_TOKEN": JSON.stringify(process.env.twitch_bot_token),
            }
        }),
        html({
            filename: "./build/index.html",
            title: appInfo.name,
            template,
        }),
        copy("static", "build")
    ]
}
