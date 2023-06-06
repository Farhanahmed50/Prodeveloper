const express = require('express');
const courseModel = require('../models/courseModel')
const { sendResponse } = require('../controllers/helper')

const app = express.Router();

// app.get("/", async (req, res) => {
//     try {
//         const result = await courseModel.find()
//         if (!result) {
//             res.send(sendResponse(false, null, "No Data Found")).status(404)
//         }
//         else {
//             res.send(sendResponse(true, result)).status(200)
//         }
//     } catch (error) {

//         res.send({
//             status: false,
//             data: null,
//             message: "Internal Server Error"
//         }).status(400)
//         res.send(sendResponse(false)).status(400)
//     }
// })

app.get("/", async (req, res) => {
    try {
        const { page, limit } = req.query;

        const courses = await courseModel.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        const count = await courseModel.countDocuments();

        res.send(sendResponse(true, courses, {
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        })).status(200)

    } catch (err) {
        res.send({
            status: false,
            data: null,
            message: "Internal Server Error"
        }).status(400)
    }
})

app.get("/byId/:id", async (req, res) => {
    const id = req.params.id
    try {
        const student = await courseModel.findById(id)
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
            const student = await courseModel.find({ [field.fieldType]: [field.value] })
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

app.post("/searchby", async (req, res) => {
    const { pageNo, pageSize, searchEntity, searchVal } = req.body
    try {
        const count = await courseModel.countDocuments({ [searchEntity]: searchVal });
        if (pageNo > Math.ceil(count / pageSize)) {
            res.send(sendResponse(false, null, "Page No is greater then total document pages"))
        } else {
            const result = await courseModel
                .find({ [searchEntity]: searchVal })
                .skip((pageNo - 1) * pageSize)
                .limit(pageSize)
    
            if (result) {
                res.send(sendResponse(true, result, {
                    totalPages: Math.ceil(count / pageSize),
                    totalDocuments : count,
                    currentPage: pageNo,
                }))
            } else {
                res.send(sendResponse(false, null, "No data found"))
            }
        }
    } catch (error) {
        res.send(sendResponse(false, null, "Internal Server Error")).status()
    }

})



app.post("/", async (req, res) => {
    const { name, duration, fees, shortName } = req.body;
    const errArr = []
    try {
        if (!name) {
            errArr.push("Required Course Name")
        }
        if (!duration) {
            errArr.push("Required Duration")
        }
        if (!fees) {
            errArr.push("Required fees")
        }
        if (errArr.length > 0) {
            res.send(sendResponse(false, errArr, "Required All Fields")).status(400)
            return
        }
        else {
            const obj = { name, duration, fees, shortName }
            let student = new courseModel(obj);
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
        const result = await courseModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const updateResult = await courseModel.findByIdAndUpdate(id, req.body, {
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
        const result = await courseModel.findById(id);
        if (!result) {
            res.send(sendResponse(false, null, "No Data Found")).status(404)
        } else {
            const deltResult = await courseModel.findByIdAndDelete(id);

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