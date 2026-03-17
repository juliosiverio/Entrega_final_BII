const Cart = require('../../models/Cart');

class CartDAO {
  async getById(id) {
    return Cart.findById(id).populate('products.product');
  }
}

module.exports = CartDAO;

