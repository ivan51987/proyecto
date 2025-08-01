const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const PDFDocument = require('pdfkit');

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
  const { proyectoId, estudianteId, docentesIds, tipotutoria } = req.body;

  try {
    for (const usuarioId of docentesIds) {
      const perfil = await db.query(`
      INSERT INTO public.perfiles_proyecto
      (proyecto_id, estado, fecha_envio, revisado_por)
      VALUES ($1, $2, NOW(), $3)
    `, [proyectoId, 'perfil_pendiente', usuarioId]);

      if (perfil.rowCount === 0) {
        return res.status(500).json({ message: `No se pudo registrar el perfil del docente ID ${usuarioId}` });
      }

      const tribunal = await db.query(`
      INSERT INTO proyecto_tribunal (proyecto_id, docentes_id, rol, estudiante_id, created_at)
      VALUES ($1, $2, 'Tribunal', $3, NOW())
    `, [proyectoId, usuarioId, estudianteId]);

      if (tribunal.rowCount === 0) {
        return res.status(500).json({ message: `No se pudo registrar el tribunal del docente ID ${usuarioId}` });
      }

      const notificacion = await db.query(
        `INSERT INTO public.notificaciones
      (usuario_id, mensaje, tipo, leido, fecha_envio, relacion_id, relacion_tipo)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
        [usuarioId, 'asignar a los tribunal', 'asignar', false, proyectoId, 'asignar tribunal']
      );

      if (notificacion.rowCount === 0) {
        return res.status(500).json({ message: 'No se pudo registrar la notificación' });
      }
    }

    const historial = await db.query(`
    INSERT INTO public.historial_acciones
    (usuario_id, proyecto_id, tipo_tutoria, accion, detalles, fecha)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `, [req.user.id, proyectoId, tipotutoria, 'asignacion de tribunales', 'registro de tribunales que van a revisar el proyecto']);

    if (historial.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo guardar el historial de la asignación.' });
    }

    res.status(201).json({
      message: 'Tribunal asignado con éxito a los.' + docentesIds.length,
      registrado: true
    });

  } catch (err) {
    res.status(500).json({
      message: 'Ocurrió un error al asignar el tribunal.',
      registrado: false
    });
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
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos } = await db.query(`
      SELECT p.id as proyecto_id, p.estudiante_id, p.tutor_id, p.area, p.titulo, p.tipotutoria
      FROM proyectos p 
      WHERE p.estado = 'en_progreso'
        AND NOT EXISTS (
          SELECT 1
          FROM proyecto_tribunal pt
          WHERE pt.proyecto_id = p.id
        )
    `);

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

// 6. Listar Proyectos para defensas
exports.listarProyectosParaDefender = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    // Consultar proyectos en progreso
    const { rows: proyectos } = await db.query(`
      WITH docentes_en_columnas AS (
        SELECT 
          p.id AS proyecto_id,
          p.titulo,
          p.tipotutoria,
          p.fecha_inicio,
          p.descripcion,
          p.estudiante_id,
          p.tutor_id,
          p2.docentes_id,
          ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p2.docentes_id) AS fila_docente
        FROM proyectos p
        INNER JOIN proyecto_tribunal p2 ON p.id = p2.proyecto_id
        WHERE (
          SELECT COUNT(DISTINCT bp2.revisado_por)
          FROM borradores_proyecto bp2
          WHERE bp2.proyecto_id = p.id AND bp2.estado = 'borrador_aprobado'
        ) = 3 and p.estado = 'borrador_aprobado'
      )
      SELECT 
        proyecto_id,
        titulo,
        fecha_inicio,
        descripcion,
        estudiante_id,
        tutor_id,
        tipotutoria, 
        MAX(CASE WHEN fila_docente = 1 THEN docentes_id::text END) AS docente_1_id,
        MAX(CASE WHEN fila_docente = 2 THEN docentes_id::text END) AS docente_2_id,
        MAX(CASE WHEN fila_docente = 3 THEN docentes_id::text END) AS docente_3_id
      FROM docentes_en_columnas
      GROUP BY proyecto_id, titulo, fecha_inicio, descripcion, estudiante_id, tutor_id, tipotutoria;
    `);

    const proyectosConEstudiante = proyectos.map((proyecto) => {
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
      );

      const docente1 = usersData.find(
        (user) => user.id === proyecto.docente_1_id && user.role === "docente"
      );
      const docente2 = usersData.find(
        (user) => user.id === proyecto.docente_2_id && user.role === "docente"
      );
      const docente3 = usersData.find(
        (user) => user.id === proyecto.docente_3_id && user.role === "docente"
      );

      return {
        ...proyecto,
        estudiante: estudiante
          ? {
            nombre: estudiante.fullName,
            email: estudiante.email,
            carrera: estudiante.carrera,
          }
          : null,
        docentes: [
          docente1 && {
            nombre: docente1.fullName,
            email: docente1.email,
            area: docente1.area,
          },
          docente2 && {
            nombre: docente2.fullName,
            email: docente2.email,
            area: docente2.area,
          },
          docente3 && {
            nombre: docente3.fullName,
            email: docente3.email,
            area: docente3.area,
          },
        ].filter(Boolean),
      };
    });


    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Registrar defensa
exports.registrarDefensa = async (req, res) => {
  try {
    const {
      proyectoId,
      fechaDefensa,
      horaDefensa,
      lugarDefensa,
      estudianteId,
      tribunal1Id,
      tribunal2Id,
      tribunal3Id,
      tutorId,
      tipoTutoria
    } = req.body;

    if (!proyectoId || !fechaDefensa || !horaDefensa || !lugarDefensa || !estudianteId || !tribunal1Id || !tribunal2Id || !tribunal3Id || !tutorId) {
      return res.status(400).json({ message: 'Faltan datos requeridos.', registrado: false });
    }
    const actualizarEstado = await db.query(`
      UPDATE proyectos
      SET estado = 'programada_defensa'
      WHERE id = $1
    `, [proyectoId]);

    if (actualizarEstado.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar el estado del proyecto', registrado: false });
    }

    const notificacion = await db.query(
      `INSERT INTO public.notificaciones
      (usuario_id, mensaje, tipo, leido, fecha_envio, relacion_id, relacion_tipo)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6)`,
      [req.user.id, 'fecha de defensa programada', 'asignar', false, estudianteId, 'asignar fecha defensa']
    );

    if (notificacion.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo registrar la notificación', registrado: false });
    }

    const historial = await db.query(`
    INSERT INTO public.historial_acciones
      (usuario_id, proyecto_id, tipo_tutoria, accion, detalles, fecha)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [req.user.id, proyectoId, tipoTutoria, 'asignacion de tribunales', 'registro de fecha para defensa']);

    if (historial.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo guardar el historial de la asignación.', registrado: false });
    }

    const defensa = await db.query(`
      INSERT INTO public.defensas (proyecto_id, fecha, hora, lugar, estado, usuario_registro, estudiante_id, tribunal_1, tribunal_2, tribunal_3, tutor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [proyectoId, fechaDefensa, horaDefensa, lugarDefensa, 'programada', req.user.id, estudianteId, tribunal1Id, tribunal2Id, tribunal3Id, tutorId]);

    if (defensa.rowCount === 0) {
      return res.status(500).json({ message: 'No se pudo registrar la defensa.', registrado: false });
    }
    res.status(201).json({
      message: 'Defensa registrada exitosamente.',
      registrado: true
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Lista defensas programadas
exports.listarDefensasProgramadas = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    // Consultar proyectos en progreso
    const { rows: proyectos } = await db.query(`
      WITH docentes_en_columnas AS (
        SELECT 
          p.id AS proyecto_id,
          p.titulo,
          p.tipotutoria,
          d.fecha,
          d.hora,
          d.lugar,
          p.descripcion,
          p.estudiante_id,
          p.tutor_id,
          p2.docentes_id,
          ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY p2.docentes_id) AS fila_docente
        FROM proyectos p
        INNER JOIN proyecto_tribunal p2 ON p.id = p2.proyecto_id
        INNER JOIN defensas d ON p.id = d.proyecto_id
        WHERE (
          SELECT COUNT(DISTINCT bp2.revisado_por)
          FROM borradores_proyecto bp2
          WHERE bp2.proyecto_id = p.id AND bp2.estado = 'borrador_aprobado'
        ) = 3 and p.estado = 'programada_defensa' AND d.estado = 'programada'
      )
      SELECT 
        proyecto_id,
        titulo,
        fecha,
        hora,
        lugar,
        descripcion,
        estudiante_id,
        tutor_id,
        tipotutoria, 
        MAX(CASE WHEN fila_docente = 1 THEN docentes_id::text END) AS docente_1_id,
        MAX(CASE WHEN fila_docente = 2 THEN docentes_id::text END) AS docente_2_id,
        MAX(CASE WHEN fila_docente = 3 THEN docentes_id::text END) AS docente_3_id
      FROM docentes_en_columnas
      GROUP BY proyecto_id, titulo, fecha, hora, lugar, descripcion, estudiante_id, tutor_id, tipotutoria;
    `);

    const proyectosConEstudiante = proyectos.map((proyecto) => {
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
      );

      const docente1 = usersData.find(
        (user) => user.id === proyecto.docente_1_id && user.role === "docente"
      );
      const docente2 = usersData.find(
        (user) => user.id === proyecto.docente_2_id && user.role === "docente"
      );
      const docente3 = usersData.find(
        (user) => user.id === proyecto.docente_3_id && user.role === "docente"
      );

      return {
        ...proyecto,
        estudiante: estudiante
          ? {
            nombre: estudiante.fullName,
            email: estudiante.email,
            carrera: estudiante.carrera,
          }
          : null,
        docentes: [
          docente1 && {
            nombre: docente1.fullName,
            email: docente1.email,
            area: docente1.area,
          },
          docente2 && {
            nombre: docente2.fullName,
            email: docente2.email,
            area: docente2.area,
          },
          docente3 && {
            nombre: docente3.fullName,
            email: docente3.email,
            area: docente3.area,
          },
        ].filter(Boolean),
      };
    });


    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Lista de seguimiento de proyectos
exports.listaSeguimientoProyectos = async (req, res) => {
  try {
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos } = await db.query(`
      WITH tribunal_ordenado AS (
          SELECT 
            proyecto_id,
            docentes_id,
            rol,
            ROW_NUMBER() OVER (PARTITION BY proyecto_id ORDER BY docentes_id) AS orden
          FROM public.proyecto_tribunal
        )
        SELECT 
          p.id AS proyecto_id,
          p.titulo,
          p.descripcion,
          p.estudiante_id,
          p.tutor_id,
          p.estado,
          p.actualizado_en AS ultimo_avance,
          p.area,
          p.fecha_inicio,
          p.tipotutoria,
          t1.docentes_id AS docente_1_id,
          t2.docentes_id AS docente_2_id,
          t3.docentes_id AS docente_3_id
        FROM public.proyectos p
        LEFT JOIN tribunal_ordenado t1 ON p.id = t1.proyecto_id AND t1.orden = 1
        LEFT JOIN tribunal_ordenado t2 ON p.id = t2.proyecto_id AND t2.orden = 2
        LEFT JOIN tribunal_ordenado t3 ON p.id = t3.proyecto_id AND t3.orden = 3;
    `);

    const proyectosConEstudiante = proyectos.map((proyecto) => {
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
      );

      const docente1 = usersData.find(
        (user) => user.id === proyecto.docente_1_id && user.role === "docente"
      );
      const docente2 = usersData.find(
        (user) => user.id === proyecto.docente_2_id && user.role === "docente"
      );
      const docente3 = usersData.find(
        (user) => user.id === proyecto.docente_3_id && user.role === "docente"
      );

      const tutor = usersData.find(
        (user) => user.id === proyecto.tutor_id && user.role === "docente"
      );

      return {
        ...proyecto,
        estudiante: estudiante
          ? {
            nombre: estudiante.fullName,
            email: estudiante.email,
            carrera: estudiante.carrera,
          }
          : null,
        tutor: tutor
          ? {
            nombre: tutor.fullName,
            email: tutor.email,
            area: tutor.area,
          }
          : null,
        docentes: [
          docente1 && {
            nombre: docente1.fullName,
            email: docente1.email,
            area: docente1.area,
          },
          docente2 && {
            nombre: docente2.fullName,
            email: docente2.email,
            area: docente2.area,
          },
          docente3 && {
            nombre: docente3.fullName,
            email: docente3.email,
            area: docente3.area,
          },
        ].filter(Boolean),
      };
    });

    res.json(proyectosConEstudiante);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. Lista historico de proyectos
exports.listaHistoricoProyectos = async (req, res) => {
  try {
    const { proyecto_id } = req.query;
    console.log("Proyecto ID:", proyecto_id);

    if (!proyecto_id) {
      return res.status(400).json({ error: "Se requiere el parámetro proyecto_id" });
    }

    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const { rows: proyectos } = await db.query(`
      SELECT *
      FROM public.historial_acciones ha
      WHERE ha.proyecto_id = $1
      ORDER BY ha.fecha ASC;
    `, [proyecto_id]);

    const proyectosConDetalles = proyectos.map((proyecto) => {
      const usuario = usersData.find((user) => user.id === proyecto.usuario_id);

      const tutor = usersData.find(
        (user) => user.id === proyecto.tutor_id && user.role === "docente"
      );

      let estudiante = null;
      let docente = null;
      let director = null;

      if (usuario) {
        switch (usuario.role) {
          case "estudiante":
            estudiante = {
              nombre: usuario.fullName,
              email: usuario.email,
              carrera: usuario.carrera,
            };
            break;
          case "docente":
            tutor = {
              nombre: usuario.fullName,
              email: usuario.email,
              area: usuario.area,
            };
            docente = {
              nombre: usuario.fullName,
              email: usuario.email,
              area: usuario.area,
            };
            break;
          case "director":
            director = {
              nombre: usuario.fullName,
              email: usuario.email,
              area: usuario.area,
            };
            break;
        }
      }

      return {
        ...proyecto,
        estudiante,
        tutor: tutor
          ? {
            nombre: tutor.fullName,
            email: tutor.email,
          }
          : null,
        docente,
        director,
      };
    });

    res.json(proyectosConDetalles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//11 reportes
exports.generarReporteProyectos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    console.log("Fechas de reporte:", fechaInicio, fechaFin);
    
    const { rows: resultado } = await db.query(`
      SELECT 
        p.titulo,
        p.estudiante_id,
        p.tipotutoria,
        p.tutor_id,
        tribunal.tribunal_1_id::uuid,
        tribunal.tribunal_2_id::uuid,
        tribunal.tribunal_3_id::uuid
      FROM public.proyectos p
      INNER JOIN public.defensas d ON p.id = d.proyecto_id
      LEFT JOIN (
        SELECT 
          proyecto_id,
          MAX(CASE WHEN rn = 1 THEN docentes_id::text END)::uuid AS tribunal_1_id,
          MAX(CASE WHEN rn = 2 THEN docentes_id::text END)::uuid AS tribunal_2_id,
          MAX(CASE WHEN rn = 3 THEN docentes_id::text END)::uuid AS tribunal_3_id
        FROM (
          SELECT 
            proyecto_id,
            docentes_id,
            ROW_NUMBER() OVER (PARTITION BY proyecto_id ORDER BY docentes_id) AS rn
          FROM public.proyecto_tribunal
        ) sub
        GROUP BY proyecto_id
      ) tribunal ON p.id = tribunal.proyecto_id
      WHERE d.fecha BETWEEN $1 AND $2;
    `, [fechaInicio, fechaFin]);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    res.setHeader('Content-disposition', 'attachment; filename=reporte_proyectos.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    const logoPath = path.join(__dirname, 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 30, { width: 60 });
    }

    doc.fontSize(18).text('Reporte de Proyectos', 110, 40, { align: 'left' });
    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`, 110, 65);
    doc.moveDown(2);

    const tableTop = 120;
    const itemHeight = 20;
    const colX = [40, 180, 370, 460];

    doc
      .fontSize(9)
      .text('Participante', colX[0], tableTop)
      .text('Nombre del Proyecto de Grado', colX[1], tableTop)
      .text('Tutor', colX[2], tableTop)
      .text('Tribunales', colX[3], tableTop);

    doc.moveTo(40, tableTop + 18).lineTo(550, tableTop + 18).stroke();

    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );
    let y = tableTop + 25;

    resultado.forEach((proyecto) => {
      const tutor = usersData.find(
        (user) => user.id === proyecto.tutor_id && user.role === "docente"
      );
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
      );
      const docente1 = usersData.find(
        (user) => user.id === proyecto.tribunal_1_id && user.role === "docente"
      );
      const docente2 = usersData.find(
        (user) => user.id === proyecto.tribunal_2_id && user.role === "docente"
      );
      const docente3 = usersData.find(
        (user) => user.id === proyecto.tribunal_3_id && user.role === "docente"
      );

      const tribunales = [
        docente1?.fullName || 'N/A',
        docente2?.fullName || 'N/A',
        docente3?.fullName || 'N/A',
      ].join(', ');


      const startY = y;


      const maxWidth = [130, 180, 90, 120];


      doc.fontSize(9);
      doc.text(estudiante?.fullName || '---', colX[0], y, { width: maxWidth[0] });
      doc.text(proyecto.titulo || '---', colX[1], y, { width: maxWidth[1], continued: false });
      doc.text(tutor?.fullName || '---', colX[2], y, { width: maxWidth[2] });
      doc.text(tribunales, colX[3], y, { width: maxWidth[3] });


      const heights = [
        doc.heightOfString(estudiante?.fullName || '---', { width: maxWidth[0] }),
        doc.heightOfString(proyecto.titulo || '---', { width: maxWidth[1] }),
        doc.heightOfString(tutor?.fullName || '---', { width: maxWidth[2] }),
        doc.heightOfString(tribunales, { width: maxWidth[3] }),
      ];
      const maxHeight = Math.max(...heights);

      y += maxHeight + 5;
    });


    const footerText = 'Generado por el sistema';

    const drawFooter = () => {
      const footerY = doc.page.height - 30;
      doc.fontSize(9)
        .fillColor('gray')
        .text(footerText, 40, footerY, {
          align: 'right',
          width: doc.page.width - 10,
        });
    };


    drawFooter();

    doc.on('pageAdded', drawFooter);

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).send('Error al generar el PDF');
  }
};
// 12. Listar los datos para reportes
exports.listarProyectoParaReportes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
  
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: 'Debe proporcionar fechaInicio y fechaFin' });
    }

    const { rows: resultado } = await db.query(`
      SELECT 
        p.titulo,
        p.estudiante_id,
        p.tipotutoria,
        p.tutor_id,
        tribunal.tribunal_1_id::uuid,
        tribunal.tribunal_2_id::uuid,
        tribunal.tribunal_3_id::uuid
      FROM public.proyectos p
      INNER JOIN public.defensas d ON p.id = d.proyecto_id
      LEFT JOIN (
        SELECT 
          proyecto_id,
          MAX(CASE WHEN rn = 1 THEN docentes_id::text END)::uuid AS tribunal_1_id,
          MAX(CASE WHEN rn = 2 THEN docentes_id::text END)::uuid AS tribunal_2_id,
          MAX(CASE WHEN rn = 3 THEN docentes_id::text END)::uuid AS tribunal_3_id
        FROM (
          SELECT 
            proyecto_id,
            docentes_id,
            ROW_NUMBER() OVER (PARTITION BY proyecto_id ORDER BY docentes_id) AS rn
          FROM public.proyecto_tribunal
        ) sub
        GROUP BY proyecto_id
      ) tribunal ON p.id = tribunal.proyecto_id
      WHERE d.fecha BETWEEN $1 AND $2;
    `, [fechaInicio, fechaFin]);
    const usersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );
    const proyectosConDetalles = resultado.map((proyecto) => {
      const tutor = usersData.find(
        (user) => user.id === proyecto.tutor_id && user.role === "docente"
      );
      const estudiante = usersData.find(
        (user) => user.id === proyecto.estudiante_id && user.role === "estudiante"
      );
      const docente1 = usersData.find(
        (user) => user.id === proyecto.tribunal_1_id && user.role === "docente"
      );
      const docente2 = usersData.find(
        (user) => user.id === proyecto.tribunal_2_id && user.role === "docente"
      );
      const docente3 = usersData.find(
        (user) => user.id === proyecto.tribunal_3_id && user.role === "docente"
      );

      return {
        titulo: proyecto.titulo,
        estudiante: estudiante?.fullName || 'N/A',
        tutor: tutor?.fullName || 'N/A',
        tipotutoria: proyecto.tipotutoria,
        tribunales: [
          {
            id: proyecto.tribunal_1_id,
            fullName: docente1?.fullName || 'N/A'
          },
          {
            id: proyecto.tribunal_2_id,
            fullName: docente2?.fullName || 'N/A'
          },
          {
            id: proyecto.tribunal_3_id,
            fullName: docente3?.fullName || 'N/A'
          }
        ]
      };
    });

    return res.json(proyectosConDetalles);

  } catch (error) {
    console.error('Error al listar los datos para el reporte:', error);
    res.status(500).send('Error al listar los datos para el reporte');
  }
};



