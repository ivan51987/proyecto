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
        pt.*,
        json_agg(
          json_build_object(
            'id', ha.id,
            'accion', ha.accion,
            'fecha', ha.fecha,
            'detalle', ha.detalles,
            'tipo_tutoria', ha.tipo_tutoria,
            'corregido', ha.corregido,
            'docente_id', ha.usuario_id
          )
          ORDER BY ha.fecha ASC
        ) AS observacionesHistorial
      FROM proyectos pt
      INNER JOIN proyecto_tribunal pt2 ON pt.id = pt2.proyecto_id
      INNER JOIN historial_acciones ha ON pt.id = ha.proyecto_id
      inner join solicitudes_tutoria st on pt.id = st.proyecto_id
      WHERE pt2.docentes_id = $1
      AND ha.accion IN (
        'Solicitud tutor',
        'Observación de Perfil',
        'Aprobar Perfil'
      )
      GROUP BY pt.id`,
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

        const observacionesHistorialConNombre =
          proyecto.observacioneshistorial.map((obs) => {
            const docente = usersData.find(
              (user) => user.id === obs.docente_id && user.role === "docente"
            );
            return {
              ...obs,
              nombre_docente: docente ? docente.fullName : null,
            };
          });

        return {
          ...proyecto,
          observacionesHistorial: observacionesHistorialConNombre,
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
    id,
  } = req.body;

  try {
    if (observaciones_estado === "perfil_aprobado") {
      await db.query(
        `INSERT INTO public.perfiles_proyecto
      (proyecto_id, documento, estado, observaciones, "version", fecha_envio, fecha_revision, revisado_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
        [
          id,
          "debe ir la imagen del perfil",
          observaciones_estado,
          observaciones_detalle,
          1,
          observaciones_fecha,
          observaciones_fecha,
          req.user.id,
        ]
      );
    }

    await db.query(
      "UPDATE proyectos SET estado = $1, actualizado_en = $2 WHERE id = $3",
      [observaciones_estado, observaciones_actualizado_en, id]
    );

    await db.query(
      `INSERT INTO historial_acciones
      (usuario_id, proyecto_id, accion, fecha, detalles, tipo_tutoria, corregido)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        req.user.id,
        id,
        observaciones_accion,
        observaciones_fecha,
        observaciones_detalle,
        observaciones_tipo_tutoria,
        observaciones_corregido,
      ]
    );

    res.json({ message: "Evaluacion de perfil del proyecto." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 11. Listar proyectos que ya estan en etapa de observacion de borrador
exports.listarProyectosHistorialObservarBorrador = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos_historial_observar } = await db.query(
      `SELECT 
        pt.*,
        json_agg(
          json_build_object(
            'id', ha.id,
            'accion', ha.accion,
            'fecha', ha.fecha,
            'detalle', ha.detalles,
            'tipo_tutoria', ha.tipo_tutoria,
            'corregido', ha.corregido,
            'docente_id', ha.usuario_id
          )
          ORDER BY ha.fecha ASC
        ) AS observacionesHistorial
      FROM proyectos pt
      INNER JOIN proyecto_tribunal pt2 ON pt.id = pt2.proyecto_id
      INNER JOIN historial_acciones ha ON pt.id = ha.proyecto_id
      INNER JOIN borradores_proyecto p ON pt.id = p.proyecto_id
      WHERE pt2.docentes_id = $1
      AND ha.accion IN (
        'Aprobar Perfil',
        'Observación de borrador',
        'Aprobar borrador'
      )
      GROUP BY pt.id`,
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

        const observacionesHistorialConNombre =
          proyecto.observacioneshistorial.map((obs) => {
            const docente = usersData.find(
              (user) => user.id === obs.docente_id && user.role === "docente"
            );
            return {
              ...obs,
              nombre_docente: docente ? docente.fullName : null,
            };
          });

        return {
          ...proyecto,
          observacionesHistorial: observacionesHistorialConNombre,
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
    id,
  } = req.body;

  try {
    if (observaciones_estado === "borrador_aprobado") {
      await db.query(
        `INSERT INTO public.borradores_proyecto
      (proyecto_id, documento, estado, observaciones, "version", fecha_envio, fecha_revision, revisado_por)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
        [
          id,
          "debe ir la imagen del perfil",
          observaciones_estado,
          observaciones_detalle,
          1,
          observaciones_fecha,
          observaciones_fecha,
          req.user.id,
        ]
      );
    }

    await db.query(
      "UPDATE proyectos SET estado = $1, actualizado_en = $2 WHERE id = $3",
      [observaciones_estado, observaciones_actualizado_en, id]
    );

    await db.query(
      `INSERT INTO historial_acciones
      (usuario_id, proyecto_id, accion, fecha, detalles, tipo_tutoria, corregido)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        req.user.id,
        id,
        observaciones_accion,
        observaciones_fecha,
        observaciones_detalle,
        observaciones_tipo_tutoria,
        observaciones_corregido,
      ]
    );

    res.json({ message: "Evaluacion de perfil del proyecto." });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
      return res
        .status(404)
        .json({ success: false, message: "No se encontraron proyectos asignados al aprobador." });
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
                  nombre_estudiante: estudiante.fullName
                }
              : null,
          };
        }
      );

      return res.json(proyectosConEstudiante);
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Falta la aprobación de todos los tribunales para continuar." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

