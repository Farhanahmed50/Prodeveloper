const express = require("express");
const { sendResponse } = require('../controllers/helper')
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const AuthController = require("../controllers/authController");

const app = express.Router();

app.get('/',(req, res) => {
    try {
        UserModel.find()
        .then(result => {
            res.send(sendResponse(true, result, "Get Data Successfully"))
        })
        .catch(error => {
            res.send(sendResponse(true, null, "No Data Found", error))
        })
    } catch (error) {
        
    }
})
app.post('/signup', AuthController.signup)
app.post('/login', AuthController.login)
app.get('/isAuth', AuthController.isAuth)
app.get("/userRoute", AuthController.protectedAuth, (req, res) => {
    res.send("User Valid")
})
app.get("/adminRoute", AuthController.adminProtectedAuth, (req, res) => {
    res.send("Admin Valid")
})

app.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await UserModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const updateResult = await UserModel.findByIdAndUpdate(id, req.body, {
                new: true
            });
            if (!updateResult) {
                res.send(sendResponse(false, null, "Error")).status(404)
            } else {
                res.send(sendResponse(true, updateResult, "Update Successfully")).status(200)
            }
        }
    } catch (error) {
        res.send(sendResponse(false, error, "Internal Server Error")).status(500)
    }
})
app.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const result = await UserModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const deltResult = await UserModel.findByIdAndDelete(id);
            
            if (!deltResult) {
                res.send(sendResponse(false, null, "Something went wrong")).status(400)
            } else {
                res.send(sendResponse(true, deltResult, "Deleted Successfully")).status(200)
            }
        }
    } catch (error) {
        
        res.send(sendResponse(false, error, "Internal Server Error")).status(500)
    }
})
// app.get('/',(req, res) => {})
// app.get('/',(req, res) => {})
// app.get('/',(req, res) => {})


module.exports = app 