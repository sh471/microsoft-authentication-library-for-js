import typescript from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";

const libraryHeader = `/*! ${pkg.name} v${pkg.version} ${new Date().toISOString().split('T')[0]} */`;
const useStrictHeader = `'use strict';`;
const fileHeader = `${libraryHeader}\n${useStrictHeader}`;

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: pkg.main,
                format: "cjs",
                banner: fileHeader,
                sourcemap: "inline"
            },
            {
                file: pkg.module,
                format: "es",
                banner: fileHeader,
                sourcemap: "inline"
            },
            {
                file: "./lib/msal-common.js",
                format: "umd",
                name: "Msal",
                banner: fileHeader,
                sourcemap: "inline"
            }
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
        ],
        plugins: [
            typescript({
                typescript: require('typescript')
            }),
        ]
    },
    // Minified version of msal
    {
        input: "src/index.ts",
        output: [
            {
                file: "./lib/msal-common.min.js",
                format: "umd",
                name: "Msal",
                banner: useStrictHeader,
                sourcemap: "inline"
            }
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
        ],
        plugins: [
            typescript({
                typescript: require('typescript')
            }),
            uglify({
                output: {
                    preamble: libraryHeader
                }
            })
        ]
    }
]
