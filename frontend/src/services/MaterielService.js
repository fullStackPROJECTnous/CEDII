

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patrimoine';


class MaterielService {
    // CRUD de base
    getAllMateriel(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'tous' && filters[key] !== 'toutes') {
                params.append(key, filters[key]);
            }
        });
        
        const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
        console.log('URL appelée:', url); // Pour debug
        return axios.get(url);
    }

    getMateriel(codeMat) {
        return axios.get(`${API_URL}/${codeMat}`);
    }

    createMateriel(materiel) {
        return axios.post(API_URL, materiel);
    }

   


    deleteMateriel(codeMat) {
        return axios.delete(`${API_URL}/${codeMat}`);
    }

    // Nouvelles fonctionnalités
    getHistoriqueEmprunt(codeMat) {
        return axios.get(`${API_URL}/${codeMat}/historique`);
    }

    updateMateriel(codeMat, data) {
        return axios.put(`${API_URL}/${codeMat}`, data);
    }
}

export default new MaterielService();
