require("dotenv").config()
const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const indexRouter = require("./routes/index")
const loginRouter = require("./routes/login")
const signupRouter = require("./routes/signup")

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

//Database setup
const mongoose = require("mongoose")

const mongoDB = process.env.MONGO_KEY

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/login", loginRouter)
app.use("/signup", signupRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

module.exports = app
