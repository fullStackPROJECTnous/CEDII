/*import axios from 'axios';

// 🚨 Adaptez ce port si votre backend est sur un autre port que 5000
const API_URL = 'http://localhost:5000/api/patrimoine'; 

class MaterielService {
    
    // Récupérer tout le matériel (GET /api/patrimoine)
    getAllMateriel() {
        return axios.get(API_URL);
    }

    // Ajouter un nouveau matériel (POST /api/patrimoine)
    createMateriel(data) {
        return axios.post(API_URL, data);
    }

    // Mettre à jour un matériel (PUT /api/patrimoine/:codeMat)
    updateMateriel(codeMat, data) {
        return axios.put(`${API_URL}/${codeMat}`, data);
    }

    // Supprimer un matériel (DELETE /api/patrimoine/:codeMat)
    deleteMateriel(codeMat) {
        return axios.delete(`${API_URL}/${codeMat}`);
    }
}

export default new MaterielService();

*/

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

    updateMateriel(codeMat, materiel) {
        return axios.put(`${API_URL}/${codeMat}`, materiel);
    }

    deleteMateriel(codeMat) {
        return axios.delete(`${API_URL}/${codeMat}`);
    }

    // Nouvelles fonctionnalités
    getHistoriqueEmprunt(codeMat) {
        return axios.get(`${API_URL}/${codeMat}/historique`);
    }

    updateEtatMateriel(codeMat, data) {
        return axios.put(`${API_URL}/${codeMat}/etat`, data);
    }
}

export default new MaterielService();
