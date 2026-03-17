const express = require('express');
const passport = require('passport');
const { authorization } = require('../middlewares/authorization');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const cartController = require('../controllers/cart.controller');

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.product');

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    res.json({
      status: 'success',
      payload: cart,
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener carrito',
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = new Cart({
      products: [],
    });

    await newCart.save();

    res.status(201).json({
      status: 'success',
      payload: newCart,
    });
  } catch (error) {
    console.error('Error al crear carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear carrito',
      error: error.message,
    });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += parseInt(quantity, 10);
    } else {
      cart.products.push({
        product: pid,
        quantity: parseInt(quantity, 10),
      });
    }

    await cart.save();

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(`/carts/${cid}`);
    }

    const updatedCart = await Cart.findById(cid).populate('products.product');

    res.json({
      status: 'success',
      payload: updatedCart,
    });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al agregar producto al carrito',
      error: error.message,
    });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );

    await cart.save();

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(`/carts/${cid}`);
    }

    const updatedCart = await Cart.findById(cid).populate('products.product');

    res.json({
      status: 'success',
      payload: updatedCart,
    });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar producto del carrito',
      error: error.message,
    });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: 'error',
        message: 'products debe ser un arreglo',
      });
    }

    for (const item of products) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Cada producto debe tener product y quantity',
        });
      }

      const productExists = await Product.findById(item.product);
      if (!productExists) {
        return res.status(404).json({
          status: 'error',
          message: `Producto con ID ${item.product} no encontrado`,
        });
      }
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    cart.products = products.map((item) => ({
      product: item.product,
      quantity: parseInt(item.quantity, 10),
    }));

    await cart.save();

    const updatedCart = await Cart.findById(cid).populate('products.product');

    res.json({
      status: 'success',
      payload: updatedCart,
    });
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar carrito',
      error: error.message,
    });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'La cantidad debe ser un número mayor a 0',
      });
    }

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado en el carrito',
      });
    }

    cart.products[productIndex].quantity = parseInt(quantity, 10);

    await cart.save();

    const updatedCart = await Cart.findById(cid).populate('products.product');

    res.json({
      status: 'success',
      payload: updatedCart,
    });
  } catch (error) {
    console.error('Error al actualizar cantidad del producto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar cantidad del producto',
      error: error.message,
    });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }

    cart.products = [];

    await cart.save();

    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      return res.redirect(`/carts/${cid}`);
    }

    res.json({
      status: 'success',
      payload: cart,
      message: 'Todos los productos han sido eliminados del carrito',
    });
  } catch (error) {
    console.error('Error al eliminar productos del carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar productos del carrito',
      error: error.message,
    });
  }
});

// Solo el USER puede agregar al carrito y comprar
router.post(
  '/:cid/purchase',
  passport.authenticate('current', { session: false }),
  authorization(['user']),
  cartController.finalizePurchase,
);

module.exports = router;
