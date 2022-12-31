const products = require('../models/product.model')
const response = require("express");
const bcrypt = require('bcrypt');
const productValid = require('../validations/product.validation')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const orderValid = require("../validations/order.validation");
const orders = require("../models/order.model");
const {Sequelize} = require("sequelize");
require('dotenv').config()
const Op = Sequelize.Op;
const index = async (req,res)=> {
    try {

        let {options, page_no, limit, search_name} = req.query;
        console.log(req.query.orderBy)
        let fieldName, orderName;
        if (!limit) limit = 10;
        if (!page_no) page_no = 1;
        // if (options) {
        //     options = JSON.parse(options);
        // } else {
        //     options = {};
        // }
        console.log(typeof page_no, typeof limit)
        console.log( page_no, limit)

        let offset = (page_no -1 ) * limit;
        console.log(offset)
        let searchName = search_name  ? search_name : '';
        let orderBy = JSON.parse(req.query.orderBy);
        console.log(orderBy)
        fieldName = orderBy.column || 'updated_at';
        orderName = orderBy.dir || 'asc';
        const {count:total_product,rows:product} = (await db.productModel.findAndCountAll({
                order: [[products,fieldName,orderName]],
                limit: Number(limit),
                offset: offset,
                where : {
                    [Op.and]: [
                        { 'name': { [Op.like]: `%${searchName}%` } }
                    ]
                }
            }));
            return res.status(200).send({
                success: true,
                message: "All Product Details",
                data: {count: {total_product, page_no: Number(page_no), limit: limit}, product}
            });
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}

const getProductById = async (req, res) => {
    try {
        let product_id = req.params.product_id;
        let getProducts = await db.productModel.findOne({
            where:{
                id : product_id
            }
        })
        return res.status(200).send({
            success: true,
            message: "Product Details",
            data: getProducts
        });
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            success: false,
            message: e,
            data: null
        });
    }
}
const addProduct = async (req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const {error, value} = productValid.validate(req.body, {
            abortEarly: false
        });
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/"/g, ''),
                data: null
            });
        }else {
            if (req.user.role === 'admin') {
                const product = await db.productModel.create({
                    name: req.body.name,
                    image: req.file.filename,
                    price: req.body.price,
                    quantity: req.body.quantity,
                })
                return res.status(200).send({
                    success: true,
                    message: "Added Product Details",
                    data: product
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: "Only Admins can add product",
                    data: null
                });
            }
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
// const deleteProducts = async (req,res)=> {
//     try {
//         const id = req.params.id
//         const deleteProduct = await db.productModel.destroy({
//             where: {
//                 id
//             }
//         })
//         return res.status(200).send({
//             success: true,
//             message: 'Product Deleted',
//             data: deleteProduct
//         })
//     } catch (e) {
//         console.log(e)
//         return res.status(400).send({
//             success: false,
//             message: e,
//             data: null
//         });
//     }
// }

// const updateProducts = async (req,res)=>{
//     try{
//         const {error, value} = productValid.validate(req.body, {
//             abortEarly: false
//         });
//         if (error) {
//             return res.status(400).send({
//                 success: false,
//                 message: error.details[0].message.replace(/"/g, ''),
//                 data: null
//             });
//         } else {
//             const id = req.params.id
//             const data =  req.body
//             const updateProduct = await db.productModel.update(data, {
//                 where: {
//                     id
//                 }
//             })
//             return res.status(200).send({
//                 success: true,
//                 message: 'Product Updated',
//                 data: updateProduct
//             })
//         }
//     }catch (e) {
//         console.log(e)
//         return res.status(400).send({
//             success: false,
//             message: e,
//             data: null
//         });
//     }
// }

module.exports={
    index,addProduct,getProductById
}