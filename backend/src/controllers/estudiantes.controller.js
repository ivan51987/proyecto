const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
// 1. Buscar tutor disponible
exports.buscarTutores = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { especialidad, nombre, curso } = req.query;

    const result = usersData.filter((user) => {
      if (user.role !== "tutor") return false;

      const matchEspecialidad = especialidad
        ? user.especialidad.toLowerCase().includes(especialidad.toLowerCase())
        : true;

      const matchNombre = nombre
        ? user.fullName.toLowerCase().includes(nombre.toLowerCase())
        : true;

      const matchCurso = curso
        ? user.cursosAsignados.some((c) =>
            c.toLowerCase().includes(curso.toLowerCase())
          )
        : true;

      return matchEspecialidad && matchNombre && matchCurso;
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Enviar solicitud de tutoría
exports.enviarSolicitudTutoria = async (req, res) => {
  const { tutorId, tipoTutoria, detalles } = req.body;
  const archivo = req.file;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const buscarRegistroExistente = await client.query(
      `SELECT COUNT(st.id)
       FROM solicitudes_tutoria st  
       WHERE st.estudiante_id = $1 AND st.tutor_id = $2`,
      [req.user.id, tutorId]
    );

    const cantidad = parseInt(buscarRegistroExistente.rows[0].count, 10);
    if (cantidad > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe una solicitud pendiente con este tutor" });
    }

    const resultadoIdEstudiante = await client.query(
      `SELECT p.id
       FROM proyectos p 
       WHERE p.estudiante_id = $1`,
      [req.user.id]
    );

    if (resultadoIdEstudiante.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: "No se encontró un proyecto para el estudiante" });
    }

    const idProyecto = resultadoIdEstudiante.rows[0].id;

    await client.query(
      `INSERT INTO historial_acciones (usuario_id, proyecto_id, tutor_id, accion, fecha)
       VALUES ($1, $2, $3, 'Solicitud tutor', CURRENT_TIMESTAMP)`,
      [req.user.id, idProyecto, tutorId]
    );

    const result = await client.query(
      `INSERT INTO solicitudes_tutoria 
       (estudiante_id, tutor_id, tipo_tutoria, detalle, estado, fecha_solicitud)
       VALUES ($1, $2, $3, $4, 'pendiente', CURRENT_DATE)
       RETURNING id`,
      [req.user.id, tutorId, tipoTutoria, detalles]
    );

    const solicitudId = result.rows[0].id;

    if (archivo) {
      await client.query(
        `INSERT INTO documentos (solicitud_id, estudiante_id, proyecto_id, nombre_archivo, ruta_archivo)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          solicitudId,
          req.user.id,
          idProyecto,
          archivo.originalname,
          archivo.path,
        ]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Solicitud enviada correctamente" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error en enviarSolicitudTutoria:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// 3. Registrar proyecto
exports.crearProyecto = async (req, res) => {
  const { titulo, descripcion, area, fecha_inicio } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO proyectos (estudiante_id, titulo, descripcion, area, fecha_inicio, estado)
      VALUES ($1, $2, $3, $4, $5, 'en_progreso')
    `,
      [req.user.id, titulo, descripcion, area, fecha_inicio]
    );
    
    await client.query("COMMIT");

    res.json({ message: "Proyecto creado exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Presentar perfil del proyecto
exports.presentarPerfil = async (req, res) => {
  const { proyectoId } = req.body;

  const archivo = req.file; // Asumiendo que el archivo se subió con multer o similar

  if (!archivo) {
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  try {
    await db.query(
      `
      INSERT INTO perfiles_proyecto (proyecto_id, documento, estado)
      VALUES ($1, $2, 'pendiente')
    `,
      [proyectoId, archivo.path]
    );
    res.json({ message: "Perfil enviado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Corregir observaciones del perfil
exports.corregirPerfil = async (req, res) => {
  const { perfilId, nuevoDocumento } = req.body;
  try {
    await db.query(
      `
      UPDATE perfiles_proyecto
      SET documento = $1, estado = 'corregido'
      WHERE id = $2
    `,
      [nuevoDocumento, perfilId]
    );

    res.json({ message: "Perfil corregido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Entregar borrador final
exports.entregarBorrador = async (req, res) => {
  const { proyectoId, documento, version } = req.body;
  try {
    await db.query(
      `
      INSERT INTO borradores_projecto (proyecto_id, documento, version, estado, fecha_envio)
      VALUES ($1, $2, $3, 'entregado', CURRENT_DATE)
    `,
      [proyectoId, documento, version]
    );

    res.json({ message: "Borrador entregado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Corregir borrador según observaciones
exports.corregirBorrador = async (req, res) => {
  const { borradorId, documentoCorregido } = req.body;
  try {
    await db.query(
      `
      UPDATE borradores_projecto
      SET documento = $1, estado = 'corregido'
      WHERE id = $2
    `,
      [documentoCorregido, borradorId]
    );

    res.json({ message: "Borrador corregido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Ver historial de acciones
exports.historialAcciones = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT ha.accion, ha.fecha, p.titulo
      FROM historial_acciones ha
      JOIN proyectos p ON ha.proyecto_id = p.id
      WHERE ha.usuario_id = $1
      ORDER BY ha.fecha DESC
    `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
