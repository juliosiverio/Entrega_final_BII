const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

router.get('/products', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query,
    } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    let cartId = req.query.cartId;
    if (!cartId) {
      const defaultCart = await Cart.findOne().sort({ createdAt: -1 });
      if (defaultCart) {
        cartId = defaultCart._id.toString();
      } else {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        cartId = newCart._id.toString();
      }
    }

    const filter = {};
    if (query) {
      if (query.toLowerCase() === 'available' || query.toLowerCase() === 'true') {
        filter.status = true;
        filter.stock = { $gt: 0 };
      } else if (query.toLowerCase() === 'unavailable' || query.toLowerCase() === 'false') {
        filter.$or = [
          { status: false },
          { stock: 0 },
        ];
      } else {
        filter.category = { $regex: query, $options: 'i' };
      }
    }

    let sortOption = {};
    if (sort) {
      if (sort.toLowerCase() === 'asc') {
        sortOption = { price: 1 };
      } else if (sort.toLowerCase() === 'desc') {
        sortOption = { price: -1 };
      }
    }

    const skip = (pageNum - 1) * limitNum;

    const [products, totalDocs] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limitNum);
    const hasPrevPage = pageNum > 1;
    const hasNextPage = pageNum < totalPages;

    const queryParams = new URLSearchParams();
    if (limit) queryParams.set('limit', limit);
    if (query) queryParams.set('query', query);
    if (sort) queryParams.set('sort', sort);
    if (cartId) queryParams.set('cartId', cartId);

    const prevLink = hasPrevPage ? `?${queryParams.toString()}&page=${pageNum - 1}` : null;
    const nextLink = hasNextPage ? `?${queryParams.toString()}&page=${pageNum + 1}` : null;

    res.render('index', {
      products,
      cartId,
      pagination: {
        totalPages,
        prevPage: hasPrevPage ? pageNum - 1 : null,
        nextPage: hasNextPage ? pageNum + 1 : null,
        page: pageNum,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      },
      queryParams: {
        limit,
        query: query || '',
        sort: sort || '',
      },
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).render('error', {
      message: 'Error al cargar los productos',
      error: error.message,
    });
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid).lean();

    if (!product) {
      return res.status(404).render('error', {
        message: 'Producto no encontrado',
      });
    }

    let cartId = req.query.cartId;
    if (!cartId) {
      const defaultCart = await Cart.findOne().sort({ createdAt: -1 });
      if (defaultCart) {
        cartId = defaultCart._id.toString();
      } else {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        cartId = newCart._id.toString();
      }
    }

    res.render('productDetail', {
      product,
      cartId,
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).render('error', {
      message: 'Error al cargar el producto',
      error: error.message,
    });
  }
});

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.product').lean();

    if (!cart) {
      return res.status(404).render('error', {
        message: 'Carrito no encontrado',
      });
    }

    res.render('cart', {
      cart,
      cartId: cid,
    });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).render('error', {
      message: 'Error al cargar el carrito',
      error: error.message,
    });
  }
});

module.exports = router;
