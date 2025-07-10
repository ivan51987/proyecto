const db = require("../config/db");

exports.seguimientoTiempoReal = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.id AS proyecto_id,
        p.titulo,
        u_est.nombre || ' ' || u_est.apellido AS estudiante,
        u_tut.nombre || ' ' || u_tut.apellido AS tutor,
        p.estado AS estado_proyecto,
        pp.estado AS estado_perfil,
        bp.estado AS estado_borrador,
        d.fecha AS fecha_defensa,
        d.hora AS hora_defensa
      FROM proyectos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN usuarios u_est ON e.usuario_id = u_est.id
      LEFT JOIN solicitudes_tutoria s ON s.estudiante_id = e.id AND s.estado = 'aceptado'
      LEFT JOIN tutores t ON s.tutor_id = t.id
      LEFT JOIN usuarios u_tut ON t.usuario_id = u_tut.id
      LEFT JOIN perfiles_proyecto pp ON pp.proyecto_id = p.id
      LEFT JOIN borradores_projecto bp ON bp.proyecto_id = p.id
      LEFT JOIN defensas d ON d.proyecto_id = p.id
      ORDER BY p.id;
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
