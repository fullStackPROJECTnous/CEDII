import axios from 'axios';

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