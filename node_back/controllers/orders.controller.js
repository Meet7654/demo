const orders = require('../models/order.model')
const response = require("express");
const bcrypt = require('bcrypt');
const orderValid = require('../validations/order.validation')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {Sequelize} = require("sequelize");
const userValid = require("../validations/user.validation");
const Op = Sequelize.Op;
require('dotenv').config()
const index = async (req,res)=> {
    try {
        let {page_no = 1, limit = 20 , field_name, orderBy,search_name} = req.query;

        let fieldName = field_name ? field_name : 'orders.updated_at';
        let orderName = orderBy ? orderBy : 'ASC';
        let offset = (Number(page_no) - 1) * Number(limit);
        let searchName = search_name  ? search_name : '';
        if (req.user.role === 'admin') {
            const {count:total_user,rows:user} = (await db.orderModel.findAndCountAll({
                include: [{model: db.productModel,attributes:['name','image','price','quantity']}, {model: db.userModel,attributes:['first_name','last_name','email','role']}],
                order: [[db.productModel,fieldName,orderName] && [db.userModel,fieldName,orderName] && [orders,fieldName,orderName]],
                limit: Number(limit),
                offset: offset,
                where : {
                    [Op.or]: [
                        { 'user_id': { [Op.like]: `%${searchName}%` } },
                        { '$product.name$': { [Op.like]: `%${searchName}%` } },
                        { '$user.email$': { [Op.like]: `%${searchName}%` } }
                    ]
                }

            }));
            if (!user.length) {
                return res.status(200).send({
                    success: true,
                    message: "No Data Found",
                    data: null
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "All Order Details",
                    data: {count: {total_user, page_no: Number(page_no)}, user,}
                });
            }
        } else {
            const {count:total_user,rows:user} = (await db.orderModel.findAndCountAll({
                include: [{model: db.productModel,attributes:['name','image','price','quantity']}, {model: db.userModel,attributes:['first_name','last_name','email','role']}],
                order: [[db.productModel,fieldName,orderName] && [db.userModel,fieldName,orderName] && [orders,fieldName,orderName]],
                limit: Number(limit),
                offset: offset,
                where: {
                    [Op.or]: [
                        { '$product.name$': { [Op.like]: `%${searchName}%` } },
                        { '$product.price$': { [Op.like]: `%${searchName}%` } }
                    ],user_id:req.user.id

                }
            }));
            if (!user.length) {
                return res.status(200).send({
                    success: true,
                    message: "No Data Found",
                    data: null
                });
            } else {
                return res.status(200).send({
                    success: true,
                    message: "All User Details",
                    data: {count: {total_user, page_no: Number(page_no)}, user,}
                });
            }
        }
    } catch (e) {
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
const addOrder = async (req,res)=>{
    try {

        const salt = await bcrypt.genSalt(10);
        const {error, value} = orderValid.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/"/g, ''),
                data: null
            });
        }else {
            if (req.user.role==='user') {
                const id = req.body.product_id
                let product_list = await db.productModel.findOne({
                    where:{
                        id
                    }
                });
                if (req.body.product_quantity <= product_list.quantity) {
                    const order = await db.orderModel.create({
                        user_id: req.user.id,
                        product_id: req.body.product_id,
                        product_quantity: req.body.product_quantity,
                        total_price: product_list.price * req.body.product_quantity
                    })
                    if (order) {
                        const data = product_list.quantity - order.product_quantity
                        const updateProduct = await db.productModel.update({
                            quantity: data
                        }, {
                            where: {
                                id: id
                            }
                        })
                    }
                    return res.status(200).send({
                        success: true,
                        message: "Added Order Details",
                        data: order
                    });

                }
                else {
                    return res.status(400).send({
                        success: false,
                        message: "Out of Stock",
                        data: null
                    });
                }
            }
            else{
                return res.status(400).send({
                    success: false,
                    message: "Admin can't add order",
                    data: null
                });
            }
        }
    } catch (e) {
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
const deleteOrders = async (req,res)=> {
    try {
        const id = req.params.id
        const deleteOrder = await db.orderModel.destroy({
            where: {
                id
            }
        })
        return res.status(200).send({
            success: true,
            message: 'Order Deleted',
            data: deleteOrder
        })
    } catch (e) {

        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}

const updateOrders = async (req,res)=>{
    try{
        const {error, value} = orderValid.validate(req.body, {
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
            const updateOrder = await db.orderModel.update(data, {
                where: {
                    id
                }
            })
            return res.status(200).send({
                success: true,
                message: 'Order Updated',
                data: updateOrder
            })
        }
    }catch (e) {

        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
module.exports={
    index,deleteOrders,updateOrders,addOrder
}