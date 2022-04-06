import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import {terser} from "rollup-plugin-terser"
import html from "@rollup/plugin-html"

import copy from "./plugins/copy.js"
import simpleLocation from "./plugins/simple-location"

import appInfo from "./app-info.js"
import template from "./html-template.js"

export default {
    input: "./src/main.js",
    output: {
        file: `./build/app-${Date.now()}.js`,
        format: "iife",
    },
    plugins: [
        svelte(),
        resolve(),
        simpleLocation,
        commonjs(),
        terser(),
        html({
            filename: "./build/index.html",
            title: appInfo.name,
            template,
        }),
        copy("static", "build")
    ]
}
