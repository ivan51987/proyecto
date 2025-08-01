import { API_CONFIG } from '../config/api.config';

const directorService = {
    async listarProyectos() {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/listar-proyectos`, {
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
    },
    async asignarTribunal(asignacion) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/asignar-tribunal`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(asignacion)
            });

            return await response.json();
        } catch (error) {
            console.error('Error en asignarTribunal:', error.message);
            throw error;
        }
    },
    async listarPostulantesDefender() {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/listar-proyectos-para-defender`, {
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
    },
    async registrarDefensa(datos) {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/registrar-defensa`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            return await response.json();
        } catch (error) {
            console.error('Error en registrarDefensa:', error.message);
            throw error;
        }
    },
    async listarDefensasProgramas() {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/listar-defensas-programadas`, {
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
    },
    async listarSeguimientoProyectos() {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/listar-proyectos-para-seguimiento`, {
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
    },
    async reporteProyecto(fechaInicio, fechaFin) {
        try {
            console.log('Fecha Inicio:', fechaInicio, 'Fecha Fin:', fechaFin);
            
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_CONFIG.BASE_URL}/directores/listar-datos-reporte-proyecto?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en reporteProyecto:', error.message);
            throw error;
        }
    },

    async descargarReportePDF(fechaInicio, fechaFin) {
        try {
            const token = localStorage.getItem('token');
            
            console.log('Descargando PDF con Fecha Inicio:', fechaInicio, 'Fecha Fin:', fechaFin);
            
            const url = `${API_CONFIG.BASE_URL}/directores/reporte-proyecto?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('No se pudo descargar el PDF');

            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', 'reporte_proyectos.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error('Error al descargar el PDF:', error.message);
            throw error;
        }
    },

};

export default directorService;
