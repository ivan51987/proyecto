const db = require("../config/db");
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
  const { tutorId, tipotutoria, detalles } = req.body;
    
  const archivo = req.file;

  try {

    const buscarRegistroExistente = await db.query(
      `SELECT COUNT(st.id)
       FROM solicitudes_tutoria st  
       WHERE st.estudiante_id = $1 AND st.tutor_id = $2`,
      [req.user.id, tutorId]
    );

    const cantidad = parseInt(buscarRegistroExistente.rows[0].count, 10);
    if (cantidad > 0) {
      return res
        .status(400)
        .json({ 
          message: "Ya existe una solicitud pendiente con este tutor",
          registrado: false,
        });
    }

    const resultadoIdEstudiante = await db.query(
      `SELECT p.id
       FROM proyectos p 
       WHERE p.estudiante_id = $1
       and p.estado = 'asignar_tribunal'`,
      [req.user.id]
    );

    if (resultadoIdEstudiante.rowCount === 0) {
      return res
        .status(404)
        .json({ 
          message: "No se encontró un proyecto para el estudiante",
          registrado: false,
        });
    }

    const idProyecto = resultadoIdEstudiante.rows[0].id;

    await db.query(
      `INSERT INTO historial_acciones (usuario_id, proyecto_id, tutor_id, accion, detalles, tipo_tutoria, fecha)
       VALUES ($1, $2, $3, 'Solicitud tutor', $4, $5, CURRENT_TIMESTAMP)`,
      [req.user.id, idProyecto, tutorId, detalles, tipotutoria]
    );

    const result = await db.query(
      `INSERT INTO solicitudes_tutoria 
       (estudiante_id, tutor_id, tipo_tutoria, detalle, estado, fecha_solicitud)
       VALUES ($1, $2, $3, $4, 'pendiente', CURRENT_DATE)
       RETURNING id`,
      [req.user.id, tutorId, tipotutoria, detalles]
    );

    const solicitudId = result.rows[0].id;

    if (archivo) {
      await db.query(
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
    res.status(201).json({
      registrado: true,
      message: "Solicitud enviada correctamente",
      solicitudId
    });
  } catch (err) {
    res.status(500).json({
      registrado: false,
      message: "Ocurrió un error al enviar la solicitud",
      detalle: err.message
    });
  }
};

// 3. Registrar proyecto
exports.crearProyecto = async (req, res) => {
  const { titulo, descripcion, area, fecha_inicio, tipoTutoria } = req.body;

  const usersData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8"));
  const director = usersData.find(user => user.role === "director");
  const id_docente = director ? director.id : null;
  try {
    const result = await db.query(
      `INSERT INTO public.proyectos (estudiante_id, titulo, descripcion, area, fecha_inicio, estado, tipoTutoria)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'en_progreso', $5)
     RETURNING id`,
      [req.user.id, titulo, descripcion, area, tipoTutoria]
    );

    if (result.rows.length === 0) {
      return res.status(500).json({ message: 'No se pudo registrar el proyecto' });
    }

    const nuevoProyectoId = result.rows[0].id;

    const notificacion = await db.query(
      `INSERT INTO public.notificaciones
     (usuario_id, mensaje, tipo, leido, fecha_envio, relacion_id, relacion_tipo)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
      [id_docente, titulo, 'solicitud', false, nuevoProyectoId, tipoTutoria]
    );

    if (notificacion.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo registrar la notificación' });
    }

    const historial = await db.query(
      `INSERT INTO public.historial_acciones
     (usuario_id, proyecto_id, accion, detalles, tipo_tutoria, fecha, corregido)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)`,
      [req.user.id, nuevoProyectoId, 'registro', 'registro de ' + tipoTutoria, tipoTutoria, false]
    );

    if (historial.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo registrar en el historial' });
    }

    res.status(201).json({
      message: "Proyecto creado exitosamente",
      registrado:true,
      tipo_tutoria: tipoTutoria
    });

  } catch (error) {
    res.status(500).json({
      message: 'Ocurrió un error al registrar el proyecto',
      registrado:false
    });
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

// 9. Proyecto registrado
exports.proyectoRegistrado = async (req, res) => {
  try {
    const result = await db.query(
      `
      select p.titulo, p.descripcion, p.fecha_inicio, p.area, p.tipotutoria 
      from public.proyectos p 
      where p.estado = 'asignar_tribunal'
      and p.estudiante_id =$1
    `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};