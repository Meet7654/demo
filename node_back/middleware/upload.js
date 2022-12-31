const express = require('express')
const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req,file,next){
            console.log(file)
            next(null,"uploads")
        },
        filename: function (req,file,next) {
            console.log(file)
            next(null,file.fieldname + "_" + Date.now() + ".jpg")
        }
    })
}).single("image")

module.exports = upload