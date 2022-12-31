const express = require('express');
const {Sequelize} = require('sequelize');
const {sequelizeJoi} = require("sequelize-joi");
const usersRoute = require('./routes/user.route')
const productModel = require('./models/product.model')
const sequelize = require("sequelize");
const cors = require('cors');
const app = express();
let mysql = require('mysql');
const orderModel = require("./models/order.model");
const userModel = require("./models/user.model");

require('dotenv').config();
const PORT = process.env.PORT

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,PUT,PATCH");
    res.setHeader('Access-Control-Allow-Headers', '*');


    if (req.method == "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(cors());

app.use('/uploads',express.static('uploads'));//for image
app.listen(PORT, ()=> {
    console.log(`Server Running on port ${PORT}`)
})

app.use(express.json());
app.use('/api/users/', usersRoute)

module.exports = db = {};
initialize();

async function initialize() {

    const sequelize = new Sequelize({
        dialect: 'mysql',
        host:'localhost',
        database: 'e_comm',
        username: 'root',
        password: '123'
    });
    if (sequelize) {
        console.log('Sequelize Database connected successfully');
    }

    db.productModel = productModel(sequelize);
    db.orderModel = orderModel(sequelize);
    db.userModel = userModel(sequelize);

    db.userModel.hasMany(db.orderModel, {foreignKey: 'user_id'});
    db.orderModel.belongsTo(db.userModel, {foreignKey: 'user_id'});

    db.productModel.hasMany(db.orderModel, {foreignKey: 'product_id'});
    db.orderModel.belongsTo(db.productModel, {foreignKey: 'product_id'});

    sequelizeJoi(sequelize);
    // await sequelize.sync({force: false})
}

