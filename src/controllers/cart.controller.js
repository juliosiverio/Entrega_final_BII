const cartService = require('../services/cart.service');

const finalizePurchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCart(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    const { ticket, unprocessedProducts } = await cartService.processPurchase(
      cart,
      req.user.email,
    );

    return res.json({
      status: 'success',
      message: 'Compra procesada',
      ticket,
      not_processed: unprocessedProducts.map((p) => p.product._id),
    });
  } catch (error) {
    console.error('Error al procesar compra:', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Error al procesar compra',
    });
  }
};

module.exports = {
  finalizePurchase,
};

