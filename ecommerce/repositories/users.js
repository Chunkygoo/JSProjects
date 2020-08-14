const fs = require("fs")
const crypto = require("crypto")
const util = require("util")
const scrypt = util.promisify(crypto.scrypt)

class userRepo {
    constructor(filename) {
        if (!filename) {
            throw new Error("File unavailable")
        }
        this.filename = filename
        try {
            fs.accessSync(this.filename)
        } catch (err) {
            fs.writeFileSync(this.filename, "[]")
        }
    }

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: "utf8"
            })
        )
    }

    async create(record) {
        record.id = this.randomId()
        const salt = crypto.randomBytes(8).toString('hex')
        const hash = await scrypt(record.password, salt, 64)
        const hashedRecord = {
            ...record,
            password: `${hash.toString("hex")}.${salt}`
        }
        const records = await this.getAll()
        records.push(hashedRecord)
        await this.writeAll(records)
        return hashedRecord
    }

    async comparePassword(saved, supplied) {
        const [hash, salt] = saved.split(".")
        const hashedSupplied = await scrypt(supplied, salt, 64)
        return hash === hashedSupplied
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex')
    }

    async getOne(id) {
        const records = await this.getAll()
        return records.find(record => record.id === id)
    }

    async delete(id) {
        const records = await this.getAll()
        const filteredRecords = records.filter(record => record.id !== id)
        await this.writeAll(filteredRecords)
    }

    async update(id, attr) {
        const records = await this.getAll()
        const record = records.find(record => record.id === id)
        if (!record) {
            throw new Error("Id not found")
        }
        Object.assign(record, attr)
        await this.writeAll(records)
    }

    async getOneBy(filter) {
        const records = await this.getAll()
        for (let record of records) {
            let found = true
            for (let key in filter) {
                if (record[key] !== filter[key]) {
                    found = false
                }
            }
            if (found) {
                return record
            }
        }
    }
}

module.exports = new userRepo("users.json")