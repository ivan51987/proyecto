const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
//cors
app.use(cors({
  origin: 'http://localhost:4000', // O usa "*" si estás en desarrollo
  credentials: true
}))
// Rutas
app.use('/api', require('./src/routes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error del servidor'
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));