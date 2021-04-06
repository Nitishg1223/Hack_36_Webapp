const path = require('path');

const express = require('express');

const router = express.Router();

const Controller = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', Controller.getIndex);

router.get('/products', Controller.getProducts);

router.get('/products/:productId', Controller.getProduct);

router.get('/cart',isAuth, Controller.getCart);

router.post('/cart',isAuth, Controller.postCart);

router.post('cart-delete-item',isAuth, Controller.postcartDeleteProduct);

router.post('/create-order',isAuth, Controller.postOrder);

router.get('/orders', isAuth, Controller.getOrders);

router.get('/checkout', Controller.getCheckout);


module.exports = router;

