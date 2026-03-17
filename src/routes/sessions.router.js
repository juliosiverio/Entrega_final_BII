const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Cart = require('../models/Cart');
const UserDTO = require('../dto/UserDTO');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'devSecretKeyChangeMe';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      age,
      password,
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
      role: 'user',
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
      message: 'Usuario registrado correctamente',
      payload: userResponse,
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
});

// Login de usuario -> genera JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'email y password son obligatorios',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      status: 'success',
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
});

// Estrategia "current" usando Passport + JWT
router.get(
  '/current',
  passport.authenticate('current', { session: false }),
  (req, res) => {
    const userSafeData = new UserDTO(req.user);
    res.json({
      status: 'success',
      payload: userSafeData,
    });
  },
);

module.exports = router;

