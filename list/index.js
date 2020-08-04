#!/usr/bin/env node
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")

const lstat = fs.promises.lstat
const targetDir = process.argv[2] || process.cwd()

fs.readdir(targetDir, async (err, filenames) => {
    if (err) {
        console.log(err)
    }
    const statPromises = filenames.map((filename) => {
        return lstat(path.join(targetDir, filename)) // lstat returns a promise. The argument for lstat should either be a relative or abs path. If we just pass
        // it a string, it will look inside the current directory. So, without path.join, we will be looking for files in ../ (if we do nls ..) inside ./. Hence, an error occurs.
    })
    const allStats = await Promise.all(statPromises) //await for all promises to be resolved (they run in parallel)
    for (let stat of allStats) {
        const index = allStats.indexOf(stat)
        if (stat.isFile()) {
            console.log(filenames[index])
        } else {
            console.log(chalk.blue(filenames[index]))
        }
    }
})