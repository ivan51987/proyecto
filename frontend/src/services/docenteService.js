import { API_CONFIG } from "../config/api.config";

const tutoriaService = {
  async registrarSolicitud(formData) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/estudiantes/enviar-solicitud`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en registrarSolicitud:", error);
      throw error;
    }
  },

  async listarProyectosSolicitudTutoria() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/solicitud-proyecto-tutoria`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(
        "Error en lista proyectos solicitud tutoria:",
        error.message
      );
      throw error;
    }
  },
  async actualizarSolicitudTutoria(respuestaTutoria) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/solicitud`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(respuestaTutoria),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Error en asignarTribunal:", error.message);
      throw error;
    }
  },

  async listarProyectosAsignadosTribunal() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/proyectos-asignados-tribunal`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(
        "Error en lista proyectos asignados tribunal:",
        error.message
      );
      throw error;
    }
  },

  async listarProyectosHistorialObservar() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/proyectos-historial-observar`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      
      return data;
    } catch (error) {
      console.error(
        "Error en lista proyectos asignados tribunal:",
        error.message
      );
      throw error;
    }
  },

  async registrarEvaluacionPerfil(payload) {
    const token = localStorage.getItem("token");
     
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/registrar-perfil-proyecto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en registrarSolicitud:", error);
      throw error;
    }
  },

  async registrarEvaluacionBorrador(payload) {
    const token = localStorage.getItem("token");
     
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/registrar-borrador-proyecto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en registrarSolicitud:", error);
      throw error;
    }
  },
  async listarProyectosHistorialObservarBorrador() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/docentes/proyectos-historial-observar-borrador`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
           
      return data;
    } catch (error) {
      console.error(
        "Error en lista proyectos observador borrador:",
        error.message
      );
      throw error;
    }
  },

  async  lsitarProyectosParaEvaluarDefensa(){
    try {
      const token =localStorage.getItem("token");
      const response= await fetch(
        `${API_CONFIG.BASE_URL}/docentes/proyectos-aprobador-borrador`,
        {
          method:"GET",
          headers:{
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      )

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en listar proyectos para evaluar", error.message);
      throw error
    }
  }
};

export default tutoriaService;
