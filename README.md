# Entrega Final - Backend E-commerce

## 🔗 Acceso a la Base de Datos

### Configuración Implementada: MongoDB Local

Este proyecto está configurado para usar **MongoDB local** con MongoDB Compass como cliente de visualización. La conexión implementada es:
```
MONGO_URI=mongodb://localhost:27017/ecommerce
```

**Para la corrección del proyecto:**

Se implementó el uso de MongoDB local, por lo que el profesor deberá tener MongoDB instalado localmente en su computadora. Se proporcionan las siguientes instrucciones para la evaluación:

1. **Instalación de MongoDB** (si no está instalado):
   - Descargar desde: https://www.mongodb.com/try/download/community
   - Instalar MongoDB Community Server
   - Instalar MongoDB Compass (opcional, pero recomendado para visualizar la base de datos)

2. **Iniciar MongoDB:**
   - En Windows: MongoDB debería iniciarse automáticamente como servicio
   - Verificar que esté corriendo en el puerto 27017

3. **Configuración de variables de entorno:**
   - Crear archivo `.env` en la raíz del proyecto:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   PORT=8080
   ```

4. **Instalación de dependencias:**
   ```bash
   npm install
   ```

5. **Poblado de la base de datos:**
   ```bash
   npm run populate
   ```
   Este script crea:
   - La base de datos `ecommerce` (si no existe)
   - 10 productos de ejemplo con diferentes categorías y estados
   - 1 carrito de ejemplo con productos asociados

6. **Inicio del servidor:**
   ```bash
   npm start
   ```

7. **Verificación del funcionamiento:**
   - Abrir navegador en: `http://localhost:8080`
   - Probar endpoints API y vistas implementadas

**Nota:** La base de datos se crea automáticamente cuando se ejecuta `npm run populate` o cuando el servidor se conecta por primera vez.

### Verificación de Base de Datos con MongoDB Compass

Si se tiene MongoDB Compass instalado, se puede:
1. Conectar a: `mongodb://localhost:27017`
2. Visualizar la base de datos `ecommerce`
3. Revisar las colecciones `products` y `carts`
4. Verificar los datos insertados mediante el script de población

---

## Descripción

Este proyecto implementa un sistema completo de backend para gestión de productos y carritos de compras utilizando MongoDB como sistema de persistencia principal. Se desarrolló un sistema que incluye paginación profesional, filtros avanzados, ordenamiento y una gestión completa de carritos utilizando los conceptos avanzados vistos en el curso.

El proyecto cuenta con endpoints RESTful estructurados y vistas interactivas con Handlebars para mejorar la experiencia de usuario. Se implementó el uso de populate en Mongoose para obtener información completa de los productos asociados a los carritos.

## Características Implementadas

- ✅ Sistema de persistencia con MongoDB y Mongoose
- ✅ Endpoints para productos con paginación profesional, filtros y ordenamiento
- ✅ Endpoints completos para gestión de carritos (CRUD completo)
- ✅ Vistas con Handlebars para visualización interactiva de productos y carritos
- ✅ Implementación de populate en carritos para obtener productos completos
- ✅ Sistema de paginación con links de navegación prev/next
- ✅ Filtros por categoría y disponibilidad
- ✅ Ordenamiento ascendente/descendente por precio

## Tecnologías Utilizadas

- Node.js con Express para el servidor backend
- MongoDB con Mongoose para la persistencia de datos
- Handlebars como motor de plantillas para las vistas
- Method-override para manejo de métodos HTTP (PUT, DELETE)

## Instalación

Para instalar las dependencias del proyecto, se debe ejecutar:

```bash
npm install
```

## Configuración

### Variables de Entorno

Se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

**Para desarrollo local (MongoDB instalado localmente):**
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=8080
```

**Explicación:**
- URL base de MongoDB: `mongodb://localhost:27017/`
- URL con base de datos: `mongodb://localhost:27017/ecommerce`
- El nombre de la base de datos `ecommerce` se agrega al final de la URL base
- La base de datos se crea automáticamente cuando Mongoose se conecta por primera vez

**Nota importante:** 
- La URL base de MongoDB local es: `mongodb://localhost:27017/`
- Para este proyecto se implementó el uso de: `mongodb://localhost:27017/ecommerce`
- La base de datos `ecommerce` se crea automáticamente cuando Mongoose se conecta por primera vez
- No es necesario crearla manualmente en MongoDB

### Configuración Alternativa: MongoDB Atlas

Si se desea usar MongoDB Atlas (recomendado para despliegue en producción), se pueden seguir estos pasos:

1. **Crear cuenta en MongoDB Atlas**
   - Acceder a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Registrarse con email o cuenta de Google (plan gratuito disponible)

2. **Crear un cluster**
   - Seleccionar "Build a Database"
   - Elegir plan gratuito (M0 Free)
   - Seleccionar región cercana
   - Dar nombre al cluster (ej: "Cluster0")

3. **Crear usuario de base de datos**
   - En "Database Access", crear un nuevo usuario
   - Username: elegir un nombre (ej: "admin" o "usuario_app")
   - Password: generar contraseña segura (guardarla para el connection string)
   - Privileges: "Atlas admin" o "Read and write to any database"
   - Guardar el usuario

4. **Configurar Network Access**
   - En "Network Access", agregar IP
   - Para desarrollo: agregar `0.0.0.0/0` (permite cualquier IP)
   - Para producción: agregar IPs específicas del servidor de hosting

5. **Obtener Connection String**
   - En "Database", hacer clic en "Connect"
   - Seleccionar "Connect your application"
   - Driver: "Node.js", Version: más reciente
   - Copiar el connection string que aparece
   - Reemplazar `<password>` con la contraseña del usuario creado
   - Reemplazar `<dbname>` con `ecommerce` o mantener el nombre predeterminado

**Ejemplo de connection string completo:**
```
mongodb+srv://admin:MiPassword123@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

**Estructura del connection string:**
- `mongodb+srv://` - Protocolo de conexión
- `admin` - Usuario creado en MongoDB Atlas
- `MiPassword123` - Contraseña del usuario (cambiar por la real)
- `cluster0.xxxxx.mongodb.net` - URL del cluster (única para cada cluster)
- `ecommerce` - Nombre de la base de datos (se crea automáticamente)
- `?retryWrites=true&w=majority` - Parámetros de conexión

6. **Configurar en el proyecto**
   - Copiar el connection string completo en el archivo `.env` como valor de `MONGO_URI`

## Poblar Base de Datos

Una vez configurada la conexión a MongoDB (local o Atlas), se debe poblar la base de datos con datos de ejemplo.

Para agregar productos de ejemplo a la base de datos, se implementó un script que puede ejecutarse con:

```bash
npm run populate
```

**Importante:** Se debe asegurar que:
- La conexión a MongoDB esté configurada correctamente en el archivo `.env`
- MongoDB esté corriendo (si es local) o la conexión a Atlas esté disponible
- El connection string incluya el nombre de la base de datos `ecommerce`

Este script crea:
- 10 productos de ejemplo con diferentes categorías y estados
- 1 carrito de ejemplo con 2 productos

La base de datos y las colecciones se crearán automáticamente la primera vez que se ejecute el script.

## Ejecución

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

El servidor iniciará en el puerto configurado (por defecto 8080) y estará disponible en `http://localhost:8080`

## Estructura de la API

### Endpoints de Productos

#### `GET /api/products`

Endpoint principal que permite obtener productos con paginación, filtros y ordenamiento profesional.

**Parámetros Query (todos opcionales):**
- `limit`: Número de productos por página (default: 10)
- `page`: Número de página a mostrar (default: 1)
- `sort`: Ordenamiento por precio - `asc` para ascendente o `desc` para descendente
- `query`: Filtro de búsqueda
  - Para disponibilidad: `available`, `true`, `unavailable`, `false`
  - Para categoría: nombre de la categoría (búsqueda case-insensitive)

**Ejemplo de uso:**
```
GET /api/products?limit=5&page=1&sort=asc&query=Electrónica
```

**Formato de respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=5&sort=asc&query=Electrónica&page=2"
}
```

#### `GET /api/products/:pid`

Permite obtener un producto específico por su ID.

### Endpoints de Carritos

#### `GET /api/carts/:cid`

Obtiene un carrito por su ID con todos los productos completos mediante populate. Se implementó populate para que los productos en el carrito, que almacenan solo el ID, se obtengan completos al solicitar el carrito.

#### `POST /api/carts`

Crea un nuevo carrito vacío.

#### `POST /api/carts/:cid/products/:pid`

Agrega un producto al carrito. Si el producto ya existe en el carrito, incrementa su cantidad.

**Body (opcional):**
```json
{
  "quantity": 2
}
```

#### `DELETE /api/carts/:cid/products/:pid`

Elimina un producto específico del carrito.

#### `PUT /api/carts/:cid`

Actualiza todos los productos del carrito con un arreglo completo de productos.

**Body:**
```json
{
  "products": [
    { "product": "product_id_1", "quantity": 2 },
    { "product": "product_id_2", "quantity": 1 }
  ]
}
```

#### `PUT /api/carts/:cid/products/:pid`

Actualiza únicamente la cantidad de un producto específico en el carrito.

**Body:**
```json
{
  "quantity": 5
}
```

#### `DELETE /api/carts/:cid`

Elimina todos los productos del carrito (vacía el carrito completamente).

## Vistas Implementadas

### `GET /products`

Vista principal que muestra todos los productos con paginación visual. Se implementó:
- Grid responsive con tarjetas de productos
- Formulario de filtros interactivo
- Sistema de paginación con botones anterior/siguiente
- Botones para ver detalles de cada producto
- Botón para agregar productos directamente al carrito

### `GET /products/:pid`

Vista de detalle de un producto específico que muestra:
- Información completa del producto (descripción, precio, categoría, stock, etc.)
- Botón para agregar al carrito
- Navegación para volver a la lista de productos

### `GET /carts/:cid`

Vista del carrito que muestra:
- Tabla con todos los productos del carrito
- Información completa de cada producto (gracias al populate implementado)
- Cantidad y subtotal por producto
- Total general del carrito
- Botones para eliminar productos individuales
- Botón para vaciar todo el carrito

## Estructura del Proyecto

```
.
├── src/
│   ├── app.js                    # Servidor Express principal
│   ├── config/
│   │   └── database.js           # Configuración de conexión a MongoDB
│   ├── models/
│   │   ├── Product.js            # Modelo de Producto con Mongoose
│   │   └── Cart.js               # Modelo de Carrito con referencia a Product
│   ├── routes/
│   │   ├── products.router.js    # Rutas API de productos con paginación
│   │   ├── carts.router.js       # Rutas API de carritos con populate
│   │   └── views.router.js       # Rutas de vistas Handlebars
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars   # Layout principal con estilos CSS
│       ├── helpers/
│       │   └── handlebars-helpers.js  # Helpers personalizados
│       ├── index.handlebars      # Vista principal de productos
│       ├── productDetail.handlebars   # Vista de detalle de producto
│       ├── cart.handlebars       # Vista del carrito
│       └── error.handlebars      # Vista de manejo de errores
├── scripts/
│   └── populate.js               # Script para poblar la BD con datos de ejemplo
├── package.json
└── README.md
```

## Consideraciones de Implementación

- **Populate en Carritos**: Se implementó populate en el modelo de Cart para que al obtener un carrito, los productos se traigan completos. En la base de datos solo se almacenan los IDs, pero al solicitarlos se desglosan todos los datos mediante populate.

- **Paginación Profesional**: La paginación incluye información completa sobre páginas totales, página actual, páginas anterior/siguiente, y links directos de navegación.

- **Filtros Flexibles**: El sistema permite filtrar por categoría (búsqueda flexible) o por disponibilidad (productos disponibles/no disponibles).

- **Ordenamiento por Precio**: Se puede ordenar los productos de manera ascendente o descendente por precio.

- **Gestión Completa de Carritos**: Se implementaron todos los endpoints necesarios para una gestión completa: crear, leer, actualizar cantidades, actualizar todo el carrito, eliminar productos individuales y vaciar el carrito.

---

## 📝 Información para Corrección

### Instrucciones para el Profesor

Este proyecto utiliza **MongoDB local**. Para corregir el proyecto, se proporcionan las siguientes instrucciones:

#### Requisitos Previos:
- MongoDB Community Server instalado y corriendo
- Node.js instalado
- MongoDB Compass (opcional, para visualizar la base de datos)

#### Pasos de Corrección:

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd "Entrega final BK"
   ```

2. **Configurar variables de entorno:**
   - Crear archivo `.env` en la raíz del proyecto:
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   PORT=8080
   ```

3. **Instalar dependencias:**
   ```bash
   npm install
   ```

4. **Verificar que MongoDB esté corriendo:**
   - En Windows: Verificar el servicio MongoDB en "Servicios"
   - O probar conectarse con MongoDB Compass a `mongodb://localhost:27017`

5. **Poblar la base de datos:**
   ```bash
   npm run populate
   ```
   Debería mostrar:
   - ✅ MongoDB conectado
   - ✅ Colecciones limpiadas
   - ✅ 10 productos insertados
   - ✅ Carrito de ejemplo creado

6. **Iniciar el servidor:**
   ```bash
   npm start
   ```

7. **Probar la aplicación:**
   - Vista de productos: `http://localhost:8080/products`
   - API productos: `http://localhost:8080/api/products?limit=5&page=1`
   - API productos con filtros: `http://localhost:8080/api/products?limit=5&page=1&sort=asc&query=Electrónica`
   - API carritos: `http://localhost:8080/api/carts`
   - Vista de carrito: `http://localhost:8080/carts/[ID_DEL_CARRITO]`

8. **Verificar en MongoDB Compass (opcional):**
   - Conectar a: `mongodb://localhost:27017`
   - Verificar base de datos `ecommerce`
   - Verificar colecciones `products` (10 documentos) y `carts` (1 documento)
#   E n t r e g a _ f i n a l _ B I I  
 