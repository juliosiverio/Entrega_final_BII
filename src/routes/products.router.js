const express = require('express');
const passport = require('passport');
const { authorization } = require('../middlewares/authorization');
const router = express.Router();
const Product = require('../models/Product');
const productController = require('../controllers/product.controller');

router.get('/', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query,
    } = req.query;

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    if (isNaN(limitNum) || limitNum < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro limit debe ser un número mayor a 0',
      });
    }

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'El parámetro page debe ser un número mayor a 0',
      });
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

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const queryParams = new URLSearchParams();
    
    if (limit) queryParams.set('limit', limit);
    if (query) queryParams.set('query', query);
    if (sort) queryParams.set('sort', sort);

    const prevLink = hasPrevPage
      ? `${baseUrl}?${queryParams.toString()}&page=${pageNum - 1}`
      : null;

    const nextLink = hasNextPage
      ? `${baseUrl}?${queryParams.toString()}&page=${pageNum + 1}`
      : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? pageNum - 1 : null,
      nextPage: hasNextPage ? pageNum + 1 : null,
      page: pageNum,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos',
      error: error.message,
    });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    res.json({
      status: 'success',
      payload: product,
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener producto',
      error: error.message,
    });
  }
});

// Solo el ADMIN puede crear productos
router.post(
  '/',
  passport.authenticate('current', { session: false }),
  authorization(['admin']),
  productController.createProduct,
);

// Solo el ADMIN puede borrar productos
router.delete(
  '/:pid',
  passport.authenticate('current', { session: false }),
  authorization(['admin']),
  productController.deleteProduct,
);

module.exports = router;
