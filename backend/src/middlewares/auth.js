const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token") || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No hay token, autorización denegada",
    });
  }

  try {
    // Verificamos el token
    const decoded = jwt.verify(token, jwtSecret);

    // `decoded` debería tener estructura como:
    // {
    //   user: { id: 3, rol: "director" }
    // }

    req.user = decoded.user; // id y rol disponibles aquí
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Token no válido",
    });
  }
};
