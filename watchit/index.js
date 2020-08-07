#!/usr/bin/env node

const chokidar = require('chokidar')
const debounce = require('lodash.debounce')
const prog = require('caporal')
const fs = require('fs')
const { spawn } = require('child_process')
const chalk = require("chalk")

prog
    .version("0.0.1")
    .argument("[filename]", "Name of file to execute")
    .action(async ({ filename }) => {
        const file = filename || "index.js"
        try {
            await fs.promises.access(file)
        } catch (err) {
            throw new Error(`Could not find ${file}`)
        }

        let proc
        const start = debounce(() => {
            if (proc) {
                proc.kill()
            }
            console.log(chalk.blue("==============Starting new process=============="))
            proc = spawn("node", [file], { stdio: "inherit" })
        }, 1000)

        chokidar.watch(".")
            .on('add', start)
            .on('change', start)
            .on('unlink', start)
    })

prog.parse(process.argv)

