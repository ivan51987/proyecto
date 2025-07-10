import { API_CONFIG } from '../config/api.config';

const materiasService = {
    async listaMaterias() {
        try {
            const token = localStorage.getItem('token'); 
                       
            const response = await fetch(`${API_CONFIG.BASE_URL}/materias`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de materias');
            }

            const data = await response.json();          
            return data;
        } catch (error) {
            console.error('Error en listaMaterias:', error.message);
            throw error;
        }
    },

    async listaDocentes() {
        try {
            const token = localStorage.getItem('token'); 
                       
            const response = await fetch(`${API_CONFIG.BASE_URL}/docentes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();       
                         
            return data;
        } catch (error) {
            console.error('Error en listaMaterias:', error.message);
            throw error;
        }
    }
};

export default materiasService;
