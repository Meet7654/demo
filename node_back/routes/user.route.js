const express = require('express')
const router = express.Router()
const usersController = require("../controllers/users.controller");
const ordersController = require("../controllers/orders.controller");
const productsController = require("../controllers/product.controller");
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
// const {authMiddleware} = require('../_middleware/auth')

// ORDERS TABLE

router.get('/get-order',auth,ordersController.index);
router.post('/add-order',auth,ordersController.addOrder);
// router.post('/update-order/:id',ordersController.updateOrders);
// router.delete('/delete-order/:id',ordersController.deleteOrders);

// USERS TABLE

router.post('/register',usersController.register);
router.post('/login',usersController.login);
// router.post('/update-user/:id',usersController.updateUsers);
// router.delete('/delete-user/:id',usersController.deleteUsers);

// PRODUCTS TABLE

router.post('/add-product',auth,upload,productsController.addProduct);
router.get('/get-product',auth,productsController.index);
router.get('/get-product-id/:product_id',auth,productsController.getProductById);
// router.post('/update-user/:id',productsController.updateProducts);
// router.delete('/delete-user/:id',productsController.deleteProducts);


module.exports = router