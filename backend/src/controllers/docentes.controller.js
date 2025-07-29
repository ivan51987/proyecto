const db = require("../config/db");
const fs = require("fs");
const path = require("path");
// 1. Proporcionar observaciones sobre un borrador
exports.proporcionarObservaciones = async (req, res) => {
  const { borradorId, observaciones } = req.body;
  try {
    await db.query(
      `
      UPDATE borradores_projecto
      SET observaciones = $1, estado = 'observado'
      WHERE id = $2
    `,
      [observaciones, borradorId]
    );

    res.json({ message: "Observaciones guardadas correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Notificar observaciones al estudiante (simulado vía tabla notificaciones)
exports.notificarObservaciones = async (req, res) => {
  const { estudianteId, mensaje } = req.body;
  try {
    await db.query(
      `
      INSERT INTO notificaciones (usuario_id, mensaje, leido, fecha_envio)
      VALUES ($1, $2, false, CURRENT_TIMESTAMP)
    `,
      [estudianteId, mensaje]
    );

    res.json({ message: "Notificación enviada." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Evaluar defensa final
exports.evaluarDefensa = async (req, res) => {
  const { defensaId, tribunalId, nota, comentario } = req.body;

  try {
    await db.query(
      `
      INSERT INTO evaluaciones_defensa (defensa_id, tribunal_id, nota, comentario)
      VALUES ($1, $2, $3, $4)
    `,
      [defensaId, tribunalId, nota, comentario]
    );

    res.json({ message: "Evaluación registrada." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Aceptar solicitud de tutoría
exports.aceptarORechazarSolicitudTutoria = async (req, res) => {
  const { proyecto_id, estado, tutor_id, id, fecha_respuesta, respuesta } =
    req.body;

  if (estado === "aceptada") {
    await db.query("UPDATE proyectos SET tutor_id = $1 WHERE id = $2", [
      tutor_id,
      proyecto_id,
    ]);
  }
  try {
    await db.query(
      "UPDATE solicitudes_tutoria SET estado = $1, fecha_respuesta=$2, detalle_respuesta=$3 WHERE id = $4",
      [estado, fecha_respuesta, respuesta, id]
    );
    res.json({ message: `Solicitud ${estado} correctamente.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Guiar al estudiante en el desarrollo del proyecto
exports.listarProyectosAsignados = async (req, res) => {
  try {
    const tutorIdRes = await db.query(
      "SELECT id FROM tutores WHERE usuario_id = $1",
      [req.user.id]
    );
    const tutorId = tutorIdRes.rows[0].id;

    const result = await db.query(
      `
      SELECT p.id, p.titulo, p.descripcion, u.nombre, u.apellido
      FROM proyectos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN solicitudes_tutoria s ON s.estudiante_id = e.id
      WHERE s.tutor_id = $1 AND s.estado = 'aceptado'
    `,
      [tutorId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Evaluar perfil del proyecto
exports.evaluarPerfil = async (req, res) => {
  const { perfilId, estado, observaciones } = req.body;
  try {
    await db.query(
      `
      UPDATE perfiles_proyecto
      SET estado = $1, observaciones = $2
      WHERE id = $3
    `,
      [estado, observaciones, perfilId]
    );

    res.json({ message: "Perfil evaluado correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Listar de proyectos solicitud de tutoria
exports.listarProyectosSolicitudTutoria = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos_solicitud_tutoria } = await db.query(
      `select st.*, p.titulo, p.area, p.descripcion
      from solicitudes_tutoria st 
      inner join proyectos p on p.id = st.proyecto_id
       where st.tutor_id = $1`,
      [req.user.id]
    );

    const proyectosConEstudiante = proyectos_solicitud_tutoria.map(
      (proyecto) => {
        const estudiante = usersData.find(
          (user) =>
            user.id === proyecto.estudiante_id && user.role === "estudiante"
        );

        return {
          ...proyecto,
          estudiante: estudiante
            ? {
              nombre_estudiante: estudiante.fullName,
              email: estudiante.email,
              carrera: estudiante.carrera,
            }
            : null,
        };
      }
    );
    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Listar proyectos que estan asinados a un tribunal
exports.listarProyectosAsignadoTribunal = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos_asignada_tribunal } = await db.query(
      `select p.*, st.tipo_tutoria
      from proyecto_tribunal pt 
      inner join proyectos p on pt.proyecto_id =p.id
      inner join solicitudes_tutoria st on p.id= st.proyecto_id
      where pt.docentes_id = $1`,
      [req.user.id]
    );

    const proyectosConEstudiante = proyectos_asignada_tribunal.map(
      (proyecto) => {
        const estudiante = usersData.find(
          (user) =>
            user.id === proyecto.estudiante_id && user.role === "estudiante"
        );

        const tutor = usersData.find(
          (user) => user.id === proyecto.tutor_id && user.role === "docente"
        );

        return {
          ...proyecto,
          estudiante: estudiante
            ? {
              nombre_estudiante: estudiante.fullName,
              email: estudiante.email,
              carrera: estudiante.carrera,
            }
            : null,
          tutor: tutor
            ? {
              nombre_tutor: tutor.fullName,
            }
            : null,
        };
      }
    );
    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Listar proyectos que estan asinados a un tribunal
exports.listarProyectosHistorialObservar = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos_historial_observar } = await db.query(
      `SELECT 
        p.id AS proyecto_id,
        p.titulo,
        pp.estado,
        p.fecha_inicio,
        p.descripcion,
        p.area,
        pp.id AS perfil_id,
        pt.docentes_id,
        p.estudiante_id,
        p.tutor_id,
        p.tipotutoria 
      FROM proyecto_tribunal pt
      INNER JOIN proyectos p ON pt.proyecto_id = p.id
      LEFT JOIN perfiles_proyecto pp 
        ON pp.proyecto_id = p.id AND pp.revisado_por = pt.docentes_id
      WHERE       
      pt.docentes_id = $1
        AND (pp.estado IS NULL OR pp.estado = 'perfil_pendiente' or pp.estado='perfil_observado');`,
      [req.user.id]
    );

    const proyectosConEstudiante = proyectos_historial_observar.map(
      (proyecto) => {
        const estudiante = usersData.find(
          (user) =>
            user.id === proyecto.estudiante_id && user.role === "estudiante"
        );

        const tutor = usersData.find(
          (user) => user.id === proyecto.tutor_id && user.role === "docente"
        );

        return {
          ...proyecto,
          estudiante: estudiante
            ? {
              nombre_estudiante: estudiante.fullName,
              email: estudiante.email,
              carrera: estudiante.carrera,
            }
            : null,
          tutor: tutor
            ? {
              nombre_tutor: tutor.fullName,
            }
            : null,
        };
      }
    );

    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. Registrar evaluacion de perfil del proyecto
exports.registrarEvaluacionPerfil = async (req, res) => {
  const {
    observaciones_estado,
    observaciones_accion,
    observaciones_actualizado_en,
    observaciones_corregido,
    observaciones_detalle,
    observaciones_fecha,
    observaciones_tipo_tutoria,
    proyecto_id,
    estudiante_id,
    tutor_id
  } = req.body;
    
  const observacion_perfil=observaciones_estado === "perfil_aprobado"?'aprobacion':'observacion';
  try {
    if (observaciones_estado === "perfil_aprobado") {
      await db.query(
        `UPDATE public.perfiles_proyecto
          SET 
            documento = $1,
            estado = $2,
            observaciones = $3,
            "version" = $4,
            fecha_envio = $5,
            fecha_revision = $6
          WHERE revisado_por = $7 and proyecto_id = $8`,
        [
          "debe ir la imagen del perfil", 
          observaciones_estado,          
          observaciones_detalle,         
          1,                             
          observaciones_fecha,           
          observaciones_fecha,           
          req.user.id,                   
          proyecto_id                             
        ]
      );
      
      await db.query(
        `INSERT INTO public.borradores_proyecto
        (proyecto_id, documento, estado, observaciones, "version", fecha_envio, fecha_revision, revisado_por)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          proyecto_id,
          "debe ir la imagen del perfil", 
          observaciones_estado,          
          observaciones_detalle,         
          1,                             
          observaciones_fecha,           
          observaciones_fecha,           
          req.user.id                             
        ]
      );
    }else {
      await db.query(
        "UPDATE perfiles_proyecto SET estado = $1, fecha_revision = $2 WHERE  proyecto_id= $3 and revisado_por=$4",
        [observaciones_estado, observaciones_actualizado_en, proyecto_id, req.user.id]
      );
    }


    await db.query(
      "UPDATE proyectos SET estado = $1, actualizado_en = $2 WHERE id = $3",
      [observaciones_estado, observaciones_actualizado_en, proyecto_id]
    );

    await db.query(
      `INSERT INTO historial_acciones
      (usuario_id, proyecto_id, accion, fecha, detalles, tipo_tutoria, corregido, tutor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        req.user.id,
        proyecto_id,
        observaciones_accion,
        observaciones_fecha,
        observaciones_detalle,
        observaciones_tipo_tutoria,
        observaciones_corregido,
        tutor_id
      ]
    );

    await db.query(
      `INSERT INTO notificaciones
      (usuario_id, mensaje, tipo, leido, fecha_envio, relacion_id, relacion_tipo)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
      [estudiante_id, observaciones_detalle, observacion_perfil, false, proyecto_id, observaciones_tipo_tutoria]
    );

    res.status(201).json({
      message: "Evaluacion de perfil del proyecto.",
      registrado:true,
      tipo_tutoria: observaciones_tipo_tutoria
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      registrado:false
    });
  }
};

// 11. Listar proyectos que ya estan en etapa de observacion de borrador
exports.listarProyectosHistorialObservarBorrador = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos_historial_borrador } = await db.query(
      `
        SELECT 
          p.id AS proyecto_id,
          p.titulo,
          bp.estado,
          p.fecha_inicio,
          p.descripcion,
          bp.id AS perfil_id,
          pt.docentes_id,
          p.estudiante_id,
          p.tutor_id,
          p.area 
        FROM proyecto_tribunal pt
        INNER JOIN proyectos p ON pt.proyecto_id = p.id
        LEFT JOIN borradores_proyecto bp  
          ON bp.proyecto_id = p.id AND bp.revisado_por = pt.docentes_id
        WHERE 
          pt.docentes_id = $1
          AND (bp.estado IS NULL OR bp.estado = 'perfil_aprobado' or bp.estado='borrador_observado')`,
      [req.user.id]
    );

    const proyectosConEstudiante = proyectos_historial_borrador.map(
      (proyecto) => {
        const estudiante = usersData.find(
          (user) =>
            user.id === proyecto.estudiante_id && user.role === "estudiante"
        );

        const tutor = usersData.find(
          (user) => user.id === proyecto.tutor_id && user.role === "docente"
        );
 

        return {
          ...proyecto,
          estudiante: estudiante
            ? {
              nombre_estudiante: estudiante.fullName,
              email: estudiante.email,
              carrera: estudiante.carrera,
            }
            : null,
          tutor: tutor
            ? {
              nombre_tutor: tutor.fullName,
            }
            : null,
        };
      }
    );

    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 12. Registrar evaluacion de borrador del proyecto
exports.registrarEvaluacionBorrador = async (req, res) => {
  const {
    observaciones_estado,
    observaciones_accion,
    observaciones_actualizado_en,
    observaciones_corregido,
    observaciones_detalle,
    observaciones_fecha,
    observaciones_tipo_tutoria,
    proyecto_id,
    estudiante_id,
    tutor_id
  } = req.body;
  
  const observacion_perfil=observaciones_estado === "perfil_aprobado"?'aprobacion':'observacion';
  
  try {
    if (observaciones_estado === "borrador_aprobado") {
      await db.query(
        `UPDATE public.borradores_proyecto
          SET 
            documento = $1,
            estado = $2,
            observaciones = $3,
            "version" = $4,
            fecha_envio = $5,
            fecha_revision = $6
          WHERE revisado_por = $7 and proyecto_id = $8`,
        [
          "debe ir la imagen del perfil", 
          observaciones_estado,          
          observaciones_detalle,         
          1,                             
          observaciones_fecha,           
          observaciones_fecha,           
          req.user.id,                   
          proyecto_id                             
        ]
      );
    }else {
      await db.query(
        "UPDATE public.borradores_proyecto SET estado = $1, fecha_revision = $2 WHERE  proyecto_id= $3 and revisado_por=$4",
        [observaciones_estado, observaciones_actualizado_en, proyecto_id, req.user.id]
      );
    }

    await db.query(
      "UPDATE proyectos SET estado = $1, actualizado_en = $2 WHERE id = $3",
      [observaciones_estado, observaciones_actualizado_en, proyecto_id]
    );

    await db.query(
      `INSERT INTO historial_acciones
      (usuario_id, proyecto_id, accion, fecha, detalles, tipo_tutoria, corregido, tutor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        req.user.id,
        proyecto_id,
        observaciones_accion,
        observaciones_fecha,
        observaciones_detalle,
        observaciones_tipo_tutoria,
        observaciones_corregido,
        tutor_id
      ]
    );

    await db.query(
      `INSERT INTO notificaciones
      (usuario_id, mensaje, tipo, leido, fecha_envio, relacion_id, relacion_tipo)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
      [estudiante_id, observaciones_detalle, observacion_perfil, false, proyecto_id, observaciones_tipo_tutoria]
    );

    res.status(201).json({
      message: "Evaluacion de borrador del proyecto.",
      registrado:true,
      tipo_tutoria: observaciones_tipo_tutoria
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      registrado:false
    });
  }
};

// 13. Listar proyectos que fue aprobado el borrador
exports.listarProyectosAprobadorBorrador = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const id_proyecto_borrador = await db.query(
      `SELECT b.proyecto_id
       FROM borradores_proyecto b 
       WHERE b.revisado_por = $1`,
      [req.user.id]
    );

    if (id_proyecto_borrador.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron proyectos asignados al aprobador.",
      });
    }

    const proyectoId = id_proyecto_borrador.rows[0].proyecto_id;

    const total_proyectos_borrador = await db.query(
      `SELECT COUNT(*) AS total
       FROM borradores_proyecto b
       INNER JOIN proyectos p ON b.proyecto_id = p.id
       WHERE b.proyecto_id = $1`,
      [proyectoId]
    );

    const total = parseInt(total_proyectos_borrador.rows[0].total);

    if (total == 3) {
      const datos_proyectos_borrador = await db.query(
        `SELECT p.estudiante_id, p.titulo
         FROM borradores_proyecto b
         INNER JOIN proyectos p ON b.proyecto_id = p.id
         WHERE b.proyecto_id = $1
         GROUP BY p.estudiante_id, p.titulo`,
        [proyectoId]
      );

      const proyectosConEstudiante = datos_proyectos_borrador.rows.map(
        (proyecto) => {
          const estudiante = usersData.find(
            (user) =>
              user.id === proyecto.estudiante_id && user.role === "estudiante"
          );

          return {
            ...proyecto,
            estudiante: estudiante
              ? {
                nombre_estudiante: estudiante.fullName,
              }
              : null,
          };
        }
      );

      return res.json(proyectosConEstudiante);
    } else {
      return res.status(404).json({
        success: false,
        message: "Falta la aprobación de todos los tribunales para continuar.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.listarHistorialProyecto = async (req, res) => {
  const idProyecto = req.query.id_proyecto;

  if (!idProyecto) {
    return res.status(400).json({ error: "Se requiere el parámetro id_proyecto" });
  }

  try {
    const usersFile = path.join(__dirname, "../data/users.json");
    const usersData = JSON.parse(fs.readFileSync(usersFile, "utf8"));

    const { rows: historial } = await db.query(
      `SELECT ha.fecha, ha.corregido, ha.tipo_tutoria, ha.usuario_id, ha.tutor_id, ha.accion, ha.detalles, ha.tipo_tutoria
       FROM public.historial_acciones ha 
       WHERE ha.proyecto_id = $1
       ORDER BY ha.fecha ASC`,
      [idProyecto]
    );

    const historialFormateado = historial.map((registro) => {
      const userById = (id) => usersData.find((u) => u.id === id);

      const estudiante = userById(registro.usuario_id);
      const tutor = userById(registro.tutor_id);
      const docente = estudiante && (estudiante.role === "docente" || estudiante.role === "director") ? estudiante : null;

      return {
        ...registro,
        estudiante: estudiante && estudiante.role === "estudiante"
          ? { nombre_estudiante: estudiante.fullName }
          : null,
        docente: docente
          ? { nombre_docente: docente.fullName }
          : null,
        tutor: tutor && tutor.role === "docente"
          ? { nombre_tutor: tutor.fullName }
          : null,
      };
    });

    res.json(historialFormateado);
  } catch (err) {
    console.error("Error al listar historial:", err);
    res.status(500).json({ error: "Error interno al obtener historial del proyecto" });
  }
};


