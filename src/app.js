const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const methodOverride = require('method-override');
require('dotenv').config();

const connectDB = require('./config/database');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/users.router');
const sessionsRouter = require('./routes/sessions.router');

require('./config/passport');

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());

require('./views/helpers/handlebars-helpers');

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

app.use('/', viewsRouter);

app.get('/', (req, res) => {
  res.redirect('/products');
});

app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Página no encontrada',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📍 URL local: http://localhost:${PORT}`);
  }
});

module.exports = app;
