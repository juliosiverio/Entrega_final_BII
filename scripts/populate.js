require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

const products = [
  {
    title: 'Notebook Gamer',
    description: 'Notebook de alto rendimiento para gaming',
    price: 1200,
    thumbnail: 'https://via.placeholder.com/300x200?text=Notebook',
    code: 'NB-GAMER-001',
    stock: 15,
    category: 'Electrónica',
    status: true,
  },
  {
    title: 'Mouse Inalámbrico',
    description: 'Mouse ergonómico con conexión inalámbrica',
    price: 25,
    thumbnail: 'https://via.placeholder.com/300x200?text=Mouse',
    code: 'MOU-WIRE-002',
    stock: 50,
    category: 'Periféricos',
    status: true,
  },
  {
    title: 'Teclado Mecánico',
    description: 'Teclado mecánico con switches RGB',
    price: 80,
    thumbnail: 'https://via.placeholder.com/300x200?text=Teclado',
    code: 'TEC-MECH-003',
    stock: 30,
    category: 'Periféricos',
    status: true,
  },
  {
    title: 'Monitor 27" 4K',
    description: 'Monitor 4K con tecnología HDR',
    price: 450,
    thumbnail: 'https://via.placeholder.com/300x200?text=Monitor',
    code: 'MON-4K-004',
    stock: 20,
    category: 'Monitores',
    status: true,
  },
  {
    title: 'Auricular Bluetooth',
    description: 'Auricular con cancelación de ruido',
    price: 120,
    thumbnail: 'https://via.placeholder.com/300x200?text=Auricular',
    code: 'AUR-BT-005',
    stock: 0,
    category: 'Audio',
    status: false,
  },
  {
    title: 'Webcam HD',
    description: 'Cámara web de alta definición',
    price: 60,
    thumbnail: 'https://via.placeholder.com/300x200?text=Webcam',
    code: 'WEB-HD-006',
    stock: 40,
    category: 'Periféricos',
    status: true,
  },
  {
    title: 'SSD 1TB',
    description: 'Disco sólido de 1TB de capacidad',
    price: 100,
    thumbnail: 'https://via.placeholder.com/300x200?text=SSD',
    code: 'SSD-1TB-007',
    stock: 25,
    category: 'Almacenamiento',
    status: true,
  },
  {
    title: 'Placa de Video RTX 3080',
    description: 'Tarjeta gráfica de alto rendimiento',
    price: 800,
    thumbnail: 'https://via.placeholder.com/300x200?text=GPU',
    code: 'GPU-RTX-008',
    stock: 5,
    category: 'Componentes',
    status: true,
  },
  {
    title: 'Memoria RAM 16GB',
    description: 'Módulo de memoria DDR4 16GB',
    price: 70,
    thumbnail: 'https://via.placeholder.com/300x200?text=RAM',
    code: 'RAM-16GB-009',
    stock: 0,
    category: 'Componentes',
    status: false,
  },
  {
    title: 'Fuente de Poder 750W',
    description: 'Fuente de poder certificada 80 Plus Gold',
    price: 130,
    thumbnail: 'https://via.placeholder.com/300x200?text=Fuente',
    code: 'PSU-750W-010',
    stock: 18,
    category: 'Componentes',
    status: true,
  },
];

const populateDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} productos insertados`);

    const exampleCart = new Cart({
      products: [
        { product: createdProducts[0]._id, quantity: 1 },
        { product: createdProducts[1]._id, quantity: 2 },
      ],
    });
    await exampleCart.save();
    console.log(`✅ Carrito de ejemplo creado con ID: ${exampleCart._id}`);

    console.log('\n📊 Resumen:');
    console.log(`- Productos creados: ${createdProducts.length}`);
    console.log(`- Carrito de ejemplo: ${exampleCart._id}`);
    console.log('\n✅ Base de datos poblada exitosamente');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

populateDatabase();
