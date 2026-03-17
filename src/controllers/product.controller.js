const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      status,
    } = req.body;

    if (!title || !description || price == null || !code || stock == null || !category) {
      return res.status(400).json({
        status: 'error',
        message: 'title, description, price, code, stock y category son obligatorios',
      });
    }

    const existing = await Product.findOne({ code });
    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Ya existe un producto con ese código',
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      thumbnail: thumbnail || '',
      code,
      stock,
      category,
      status: status !== undefined ? status : true,
    });

    return res.status(201).json({
      status: 'success',
      payload: product,
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al crear producto',
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const deleted = await Product.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
    }

    return res.json({
      status: 'success',
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error al eliminar producto',
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
};

