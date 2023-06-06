const { sendResponse } = require('../controllers/helper')
const UserModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const AuthController = {
    login: async (req, res) => {
        const { email, password } = req.body
        const obj = { email, password }

        UserModel.findOne({ email })
            .then(async (user) => {
                const isConfirm = await bcrypt.compare(obj.password, user.password)
                if (isConfirm) {
                    const token = jwt.sign({ ...user }, process.env.SECURITY_KEY, {
                        expiresIn: "1h"
                    })
                    res.send(sendResponse(true, { user, token }, "Login Successfully")).status(400)
                } else {
                    res.send(sendResponse(true, null, "Credential Error")).status(400)
                }
            })
            .catch(error => {
                res.send(sendResponse(false, error, "User doesn't exist")).status(400)
            })
    },
    signup: async (req, res) => {
        const { username, email, password, isAdmin } = req.body;
        const obj = { username, email, password, isAdmin }
        const arr = ["username", "email", "password", "isAdmin"]
        const errArr = [];

        arr.forEach((index) => {
            if (!obj[index]) {
                errArr.push(index)
            }
        })

        if (errArr.length > 0) {
            res.send(sendResponse(false, null, "Please fill all required fields", errArr)).status(400)
        }
        else {
            const hashPassword = await bcrypt.hash(obj.password, 10);
            obj.password = hashPassword

            const existingUser = await UserModel.findOne({ email })
            if (existingUser) {
                res.send(sendResponse(false, null, "This email is already exist")).status(403)
            }
            else {
                UserModel.create(obj)
                    .then(result => {
                        res.send(sendResponse(true, result, "User Successfully")).status(201)
                    })
                    .catch(error => {
                        res.send(sendResponse(false, error, "Internal Server Error")).status(400)
                    })
            }
        }
    },
    protectedAuth: async (req, res, next) => {
        let token = req.headers.authorization
        token = token.split(" ")[1]
        // console.log(token);

        jwt.verify(token, process.env.SECURITY_KEY, (err, decode) => {
            if (err) {
                res.send(sendResponse(true, null, "Unauthorized")).status(403)
            } else {
                console.log(decode)
                next();
            }
        })
    },
    isAuth: async (req, res) => {
        let token = req.headers.authorization
        token = token.split(" ")[1]

        jwt.verify(token, process.env.SECURITY_KEY, (err, decode) => {
            if (err) {
                res.send(sendResponse(true, null, "Unauthorized")).status(403)
            } else {
                res.send(sendResponse(true, decode._doc, "Authorized")).status(200)
            }
        })
    },
    adminProtectedAuth: async (req, res, next) => {
        let token = req.headers.authorization
        token = token.split(" ")[1]
        if (!token) {
            res.send(sendResponse(false, null, "Authorization key required")).status(403)
        } else {
            await jwt.verify(token, process.env.SECURITY_KEY, (err, decode) => {
                if (err) {
                    res.send(sendResponse(false, null, "Unauthorized")).status(403)
                } else {
                    if (decode._doc.isAdmin) {
                        next();
                    } else {
                        res.send(sendResponse(false, null, "You don't have rights for this action")).status(403)
                    }
                }
            })
        }
    },

}

module.exports = AuthController