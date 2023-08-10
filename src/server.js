import express from "express";
import compression from "compression";
import cors from "cors"
import helmet from "helmet"
import path from "path"
import fs from "fs"
const port = 3000;
// middleware
const app = express()
app.use(compression())
app.use(cors())
app.use(express.json())
app.use(express.static("./src/static"))
app.set("view engine", "pug")
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"]
        }
    }
}))

// routing
app.get("/", (_req, res) => {
    const usersBuffer = fs.readFileSync(path.resolve("src", "personals/users.json"))
    const usersJSON = JSON.parse(usersBuffer)
    return res.render("index.pug", {users: usersJSON})
})

app.get("/profile/:username", (req, res) => {
    const userBuffer = fs.readFileSync(path.resolve("src", `personals/${req.params.username}.json`))
    const userJSON = JSON.parse(userBuffer)
    return res.render("profile.pug", {name: req.params.username, tagline: userJSON.tagline, bio: userJSON.bio, items: userJSON.fanlistings})
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})