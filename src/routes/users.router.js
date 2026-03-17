const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Cart = require('../models/Cart');

const router = express.Router();

// Crear usuario (Create)
router.post('/', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'first_name, last_name, email, age y password son obligatorios',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'El email ya está registrado',
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const cart = await Cart.create({ products: [] });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: cart._id,
      role: role || 'user',
    });

    const userResponse = {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      age: newUser.age,
      role: newUser.role,
      cart: newUser.cart,
    };

    res.status(201).json({
      status: 'success',
      payload: userResponse,
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear usuario',
      error: error.message,
    });
  }
});

// Obtener todos los usuarios (Read - list)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('cart');

    res.json({
      status: 'success',
      payload: users,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios',
      error: error.message,
    });
  }
});

// Obtener un usuario por ID (Read - detail)
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid).select('-password').populate('cart');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      status: 'success',
      payload: user,
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuario',
      error: error.message,
    });
  }
});

// Actualizar usuario (Update)
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const {
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    } = req.body;

    const updateData = {};

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (role !== undefined) updateData.role = role;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      uid,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select('-password').populate('cart');

    if (!updatedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      status: 'success',
      payload: updatedUser,
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar usuario',
      error: error.message,
    });
  }
});

// Eliminar usuario (Delete)
router.delete('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedUser = await User.findByIdAndDelete(uid);

    if (!deletedUser) {
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
    }

    res.json({
      status: 'success',
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar usuario',
      error: error.message,
    });
  }
});

module.exports = router;

