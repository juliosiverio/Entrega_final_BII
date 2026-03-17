const Handlebars = require('handlebars');

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('multiply', function(a, b) {
  return a * b;
});

Handlebars.registerHelper('calculateTotal', function(products) {
  if (!products || products.length === 0) return 0;
  
  return products.reduce((total, item) => {
    if (item.product && item.product.price) {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0).toFixed(2);
});

module.exports = Handlebars;
