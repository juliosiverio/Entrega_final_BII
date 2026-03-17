const Ticket = require('../models/Ticket');

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getCart(id) {
    return this.dao.getById(id);
  }

  async processPurchase(cart, userEmail) {
    let totalAmount = 0;
    const unprocessedProducts = [];

    for (const item of cart.products) {
      const product = item.product;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        totalAmount += product.price * item.quantity;
      } else {
        unprocessedProducts.push(item);
      }
    }

    if (totalAmount > 0) {
      const ticket = await Ticket.create({
        amount: totalAmount,
        purchaser: userEmail,
      });

      cart.products = unprocessedProducts;
      await cart.save();

      return { ticket, unprocessedProducts };
    }

    throw new Error('No hay stock suficiente para procesar ningún producto');
  }
}

module.exports = CartRepository;

