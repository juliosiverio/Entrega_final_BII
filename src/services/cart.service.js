const CartRepository = require('../repositories/CartRepository');
const CartDAO = require('../dao/db/cart.dao');

const cartService = new CartRepository(new CartDAO());

module.exports = cartService;

