const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { jwtSecret, jwtExpiration } = require('../config/auth');

// Leer datos de usuario y roles
const usersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8')
);

const rolesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/roles.json'), 'utf8')
);

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario
    const user = usersData.find(user => user.username === username);
        
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Verificar que el rol del usuario existe y obtener sus permisos
    if (!rolesData[user.role]) {
      return res.status(400).json({
        success: false,
        error: 'Rol de usuario no válido'
      });
    }

    const userPermissions = rolesData[user.role].permissions;

    // Crear payload para JWT con rol y permisos
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: userPermissions
      }
    };

    // Generar token
    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            permissions: userPermissions
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};

//datos actual del usuario
exports.getMe = async (req, res) => {
  try {
    const user = usersData.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // No enviar la contraseña
    const { password, ...userData } = user;
    
    res.json({
      success: true,
      data: userData
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Error del servidor'
    });
  }
};