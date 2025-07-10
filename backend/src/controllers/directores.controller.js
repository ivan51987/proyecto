const { log } = require("console");
const db = require("../config/db");
const fs = require("fs");
const path = require("path");

// 1. Registrar conclusión del proyecto
exports.registrarConclusion = async (req, res) => {
  const { proyectoId, fechaConclusion } = req.body;

  if (!proyectoId) {
    return res.status(400).json({ error: "El campo proyectoId es obligatorio." });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Actualiza el proyecto como concluido
    await client.query(`
      UPDATE proyectos 
      SET estado = 'concluido',
          fecha_conclusion = $2,
          hora_conclusion = $3,
          preguntas_correctas = $4, 
          preguntas_incorrectas = $5,
          nota_final = $6,
          observacion_conclusion = $7
      WHERE id = $1
    `, [proyectoId, fechaConclusion || new Date(), horaConclusion, preguntasCorrectas, preguntasIncorrectas, notaFinal, observacionConclusion]);

    // Registra en historial
    await client.query(`
      INSERT INTO historial_acciones (usuario_id, proyecto_id, accion, fecha)
      VALUES ($1, $2, 'Conclusión del proyecto registrada', CURRENT_TIMESTAMP)
    `, [req.user.id, proyectoId]);

    await client.query('COMMIT');

    res.json({ message: "Proyecto marcado como concluido exitosamente." });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error al registrar conclusión:", err.message);
    res.status(500).json({ error: "Ocurrió un error al registrar la conclusión del proyecto." });
  } finally {
    client.release();
  }
};


// 2. Asignar fecha y hora de defensa
exports.asignarDefensa = async (req, res) => {
  const { proyectoId, fecha, hora, lugar } = req.body;
  try {
    await db.query(`
      INSERT INTO defensas (proyecto_id, fecha, hora, lugar)
      VALUES ($1, $2, $3, $4)
    `, [proyectoId, fecha, hora, lugar]);

    await db.query(`
      INSERT INTO historial_acciones (usuario_id, proyecto_id, accion, fecha)
      VALUES ($1, $2, 'Defensa asignada', CURRENT_TIMESTAMP)
    `, [req.user.id, proyectoId]);

    res.json({ message: "Defensa asignada correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Asignar tribunal evaluador
exports.asignarTribunal = async (req, res) => {
  const { proyectoId, estudianteId, docentesIds } = req.body;
  
  try {
    for (const usuarioId of docentesIds) {
      await db.query(`
        INSERT INTO proyecto_tribunal (proyecto_id, docentes_id, rol, estudiante_id, created_at)
        VALUES ($1, $2, 'Tribunal', $3, NOW())
      `, [proyectoId, usuarioId, estudianteId]);
    }

    res.json({ message: "Tribunal asignado con éxito." });
  } catch (err) {
    console.error("Error al asignar tribunal:", err);
    res.status(500).json({ error: "Ocurrió un error al asignar el tribunal." });
  }
};


// 4. Generar reportes (de proyectos concluidos)
exports.generarReporte = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT p.id, p.titulo, u.nombre, u.apellido, p.estado, p.fecha_inicio
      FROM proyectos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN usuarios u ON e.usuario_id = u.id
      WHERE p.estado = 'concluido'
    `);

    await db.query(`
      INSERT INTO reportes (usuario_id, tipo, contenido, fecha_creacion)
      VALUES ($1, 'reporte_proyectos_concluidos', $2, CURRENT_TIMESTAMP)
    `, [req.user.id, JSON.stringify(rows)]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Listar Proyectos
exports.listarProyectos = async (req, res) => {
  try {
    // Leer JSON de usuarios
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    // Consultar proyectos en progreso
    const { rows: proyectos } = await db.query(`
      SELECT p.id as proyecto_id, p.estudiante_id, p.tutor_id, p.area, p.titulo
      FROM proyectos p 
      WHERE p.estado = 'en_progreso'
        AND NOT EXISTS (
          SELECT 1
          FROM proyecto_tribunal pt
          WHERE pt.proyecto_id = p.id
        )
    `);

    // Combinar datos del proyecto con datos del estudiante
    const proyectosConEstudiante = proyectos.map((proyecto) => {
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
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
    });

    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Listar Proyectos para defensas
exports.listarProyectosDefensas = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    // Consultar proyectos en progreso
    const { rows: proyectos } = await db.query(`
      SELECT p.id as proyecto_id, p.estudiante_id, p.tutor_id, p.area, p.titulo
      FROM proyectos p 
      WHERE p.estado = 'en_progreso'
        AND NOT EXISTS (
          SELECT 1
          FROM proyecto_tribunal pt
          WHERE pt.proyecto_id = p.id and pt.para_defender = 'SI'
        )
    `);

    // Combinar datos del proyecto con datos del estudiante
    const proyectosConEstudiante = proyectos.map((proyecto) => {
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
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
    });

    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};