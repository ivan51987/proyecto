const fs = require("fs");
const path = require("path");

// Leer el archivo roles.json
const rolesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/roles.json"), "utf8")
);

module.exports = (permission) => {
  return (req, res, next) => {
    // Verificar si el usuario tiene un rol
    const { role } = req.user;

    if (!role) {
      return res.status(403).json({
        success: false,
        error: "El usuario no tiene rol asignado",
      });
    }

    // Verificar si el rol existe
    if (!rolesData[role]) {
      return res.status(403).json({
        success: false,
        error: "Rol no válido",
      });
    }

    // Verificar si el rol tiene el permiso necesario
    const permissions = rolesData[role].permissions;
    if (!permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: "No tienes permiso para realizar esta acción",
      });
    }

    next();
  };
};
