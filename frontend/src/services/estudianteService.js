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
};

export default estudianteService;
