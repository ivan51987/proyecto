const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

module.exports = (req, res, next) => {
  // Obtener token del header
  const token = req.header("x-auth-token");

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No hay token, autorización denegada",
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Token no válido",
    });
  }
};
