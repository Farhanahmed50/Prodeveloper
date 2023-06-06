const express = require('express');
const studentRoutes = require('./routes/studentRoutes')
const instituteRoutes = require('./routes/instituteRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const courseRoutes = require('./routes/courseRoutes')
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config();


const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use("/api/student", studentRoutes)
app.use("/api/institute", instituteRoutes)
app.use("/api/teacher", teacherRoutes)
app.use("/api/course", courseRoutes)
app.use("/api/user", userRoutes)


app.get("/", (req, res) => {
    res.send("working")
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected Successfully")
        app.listen(PORT, () => {
            console.log("Server has been started on port :", PORT)
        })
    })
    .catch(error => {
        console.log(error)
    })