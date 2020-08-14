const express = require("express")
const bodyParser = require("body-parser")
const cookieSession = require("cookie-session")
const repo = require("./repositories/users")

const app = express()

app.use(bodyParser.urlencoded({ extended: true })) //bodyParser is a middleware that checks the method type, takes the information with the "name" property sent from
// the client (browser) and put it in the .body property so that it is available on req.body
app.use(cookieSession({
    keys: ["odfnondcodomcd"]
}))

app.get("/signup", (req, res) => {
    res.send(`
        <div>
            Your cookie id is ${req.session.userId}
            <form method = "POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="passwordConfirmation">
                <button> Sign Up </button>
            </form>
        </div>
    `)
})

app.get("/signout", async (req, res) => {
    req.session = null
    res.send("You are logged out")
})

app.get("/signin", (req, res) => {
    res.send(`
        <div>
            <form method = "POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <button> Sign In </button>
            </form>
        </div>
    `)
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body
    const user = await repo.getOneBy({ email: email })
    if (!user) {
        res.send("Email unavailable")
        return
    }
    const validPassword = repo.comparePassword(user.password, password)
    if (!validPassword) {
        res.send("Wrong password")
        return
    }
    req.session.userId = user.id
    res.send("Signed in successfully")
})

app.post("/signup", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body
    const existingUser = await repo.getOneBy({ email: email })
    if (existingUser) {
        return res.send("This email is already in use")
    }
    if (password !== passwordConfirmation) {
        return res.send("Password Confirmation failed")
    }
    const user = await repo.create({ email: email, password: password })
    req.session.userId = user.id
    res.send("Account created!")
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})