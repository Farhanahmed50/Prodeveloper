const express = require('express');
const teacherModel = require('../models/teacherModel')
const { sendResponse } = require('../controllers/helper')

const app = express.Router();

app.get("/", async (req, res) => {
    try {
        const result = await teacherModel.find().populate("course")
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        }
        else {
            res.send(sendResponse(true, result)).status(200)
        }
    } catch (error) {
        
        res.send({
            status: false,
            data: null,
            message: "Internal Server Error"
        }).status(400)
        res.send(sendResponse(false)).status(400)
    }
})

app.get("byId/:id", async (req, res) => {
    const id = req.params.id
    try {
        const student = await teacherModel.findById(id)
        if (!student) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            res.send(sendResponse(true, student, "Data Get Successfully")).status(200)
        }
    } catch (error) {
        res.send(sendResponse(false, null, "Internal Server Error")).status(400)
    }
})

app.get("/search", async (req, res) => {
    const field = req.query
    const errArr = []
    try {
        if (!field.fieldType) {
            errArr.push("Field Type is required")
        }
        if (!field.value) {
            errArr.push("Value is required")
        }
        else {
            const student = await teacherModel.find({ [field.fieldType]: [field.value] })
            if (!student) {
                res.send(sendResponse(false, null, "No Data Found")).status(404)
            } else {
                res.send(sendResponse(true, student, "Data Get Successfully")).status(200)
            }
        }
    } catch (error) {
        res.send(sendResponse(false, null, "Internal Server Error")).status(400)
    }
})



app.post("/", async (req, res) => {
    const { name, email, contact, course } = req.body;
    const errArr = []
    try {
        if (!name) {
            errArr.push("Required Name")
        }
        if (!email) {
            errArr.push("Required Email")
        }
        if (!contact) {
            errArr.push("Required Contact")
        }
        if (!course) {
            errArr.push("Required Course")
        }
        if (errArr.length > 0) {
            res.send(sendResponse(false, errArr, "Required All Fields")).status(400)
            return
        }
        else {
            const obj = { name, email, contact, course }
            let student = new teacherModel(obj);
            await student.save()
            if (!student) {
                res.send(sendResponse(false, null, "Internal Server Error")).status(400)
            } else {
                res.send(sendResponse(true, student, "Saved Successfully")).status(200)
            }
        }
    } catch (error) {
        
        res.send(sendResponse(false, null, "Internal Server Error")).status(400)
    }

})

app.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await teacherModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const updateResult = await teacherModel.findByIdAndUpdate(id, req.body, {
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
        const result = await teacherModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const deltResult = await teacherModel.findByIdAndDelete(id);
            
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

module.exports = app