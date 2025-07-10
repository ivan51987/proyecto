const fs = require("fs");
const path = require("path");

exports.materias = async (req, res) => {
  try {
    const docentesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );

    const cursosUnicos = new Map();

    // Recolectar cursos únicos
    docentesData.forEach((tutor) => {
      tutor.cursosAsignados.forEach((curso) => {
        const key = curso.codigo;
        if (!cursosUnicos.has(key)) {
          cursosUnicos.set(key, curso.nombre);
        }
      });
    });
    // Crear la lista de cursos
    const cursos = Array.from(cursosUnicos.entries()).map(
      ([codigo, nombre]) => ({
        codigo,
        nombre,
      })
    );
   // console.log(cursos);
    

    res.json(cursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.docentes = async (req, res) => {
  try {
    const docentesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8")
    );
    // Filtrar docentes que tienen cursos asignados
    const docentesConCursos = docentesData.filter(d => d.role === 'docente');
    
    res.json(docentesConCursos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
