const users = require('../models/user.model')
const response = require("express");
const bcrypt = require('bcrypt');
const userValid = require('../validations/user.validation')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const productValid = require("../validations/product.validation");
require('dotenv').config()
const register = async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const {error, value} = userValid.validate(req.body, {
            abortEarly: false
        });
        console.log(error)
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/"/g, ''),
                data: null
            });
        }else {
            const user = await db.userModel.create({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, salt),
                // role: req.body.role,
            })
            user.password = undefined;
            return res.status(200).send({
                success: true,
                message: "Registered Successful",
                data: user
            });
        }
    } catch (e) {
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
const index = async (req,res)=> {
    try {
        const user = await db.userModel.findAll();
        return res.status(200).send({
            success: true,
            message: "All User Details",
            data: user
        });
    } catch (e) {
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
const login = async (req,res,next)=>{
    try{
        const { email, password } = req.body;
        console.log(req.body)
        const userLogin = await db.userModel.findOne({
            where: {
                email: email
            }
        });
        if (userLogin){
            const isSame = await bcrypt.compare(req.body.password,userLogin.password);
            if (isSame){
                let token = jwt.sign({ "email" : userLogin.email },process.env.JWT_TOKEN, {expiresIn: '24h'});
                // if (userLogin.role === 'admin') {
                //     const allUsers = await db.orderModel.findAll()
                //     return res.status(200).send({
                //         success: true,
                //         message: 'Login Successful',
                //         data: allUsers,
                //         token: token,
                //     });
                // }
                userLogin.password = undefined;
                    return res.status(200).send({
                        success: true,
                        message: 'Login Successful',
                        data: userLogin,
                        token: token,
                    });
            }
            else {
                return res.status(400).send({
                    success: false,
                    message: "Incorrect Password!!!",
                    data: null
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                message: 'User not found',
                data: null
            });
        }
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}


const deleteUsers = async (req,res)=> {
    try {
        const id = req.params.id
        const deleteUser = await db.userModel.destroy({
            where: {
                id
            }
        })
        return res.status(200).send({
            success: true,
            message: 'User Deleted',
            data: deleteUser
        })
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}

const updateUsers = async (req,res)=>{
    try{
        const {error, value} = userValid.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/"/g, ''),
                data: null
            });
        } else {
            const id = req.params.id
            const data =  req.body
            const updateUser = await db.userModel.update(data, {
                where: {
                    id
                }
            })
            updateUser.password = undefined;
            return res.status(200).send({
                success: true,
                message: 'User Updated',
                data: updateUser
            })
        }
    }catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}

module.exports={
    login,register,deleteUsers,updateUsers
}