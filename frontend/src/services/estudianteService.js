import { API_CONFIG } from "../config/api.config";

const estudianteService = {
  async registrarProyecto(proyecto) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/estudiantes/crear-proyecto`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proyecto),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en listaMaterias:", error.message);
      throw error;
    }
  },

  async listarProyectoRegistrado(){
    try {
      const token = localStorage.getItem("token");
      const response =await fetch(
        `${API_CONFIG.BASE_URL}/estudiantes/proyecto-registrado`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data =await response.json();
      return data;
    } catch (error) {
      console.error("Error en listar proyecto", error.message);
      throw error;
    }
  },

  async tribunalesProyecto(){
    try {
      const token = localStorage.getItem("token");
      const response =await fetch(
        `${API_CONFIG.BASE_URL}/estudiantes/tribunales-proyecto`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data =await response.json();
      return data;
    } catch (error) {
      console.error("Error en listar de tribuales por proyecto", error.message);
      throw error;
    }
  },

  async observacionTribunalProyecto(proyecto_id, revisado_id, revisado_en){
    try {
      const token = localStorage.getItem("token");
      console.log(proyecto_id, revisado_id, revisado_en);
      

      const response =await fetch(
        `${API_CONFIG.BASE_URL}/estudiantes/lista-observaciones-tribunal?proyecto_id=${proyecto_id}&revisado_id=${revisado_id}&revisado_en=${revisado_en}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data =await response.json();
      return data;
    } catch (error) {
      console.error("Error en listar de tribuales por proyecto", error.message);
      throw error;
    }
  }
};

export default estudianteService;
