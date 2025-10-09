import axios from 'axios';

// Assurez-vous que l'URL correspond à votre configuration Express (ex: dans server.js)
const API_URL = 'http://localhost:5000/api/patrimoine'; 

class PatrimoineService {
    // --- Salles (PK: idSalle) ---
    getAllSalles() {
        return axios.get(API_URL + '/salles');
    }

    createSalle(data) {
        return axios.post(API_URL + '/salles', data);
    }
    
    // Le 'id' est l'idSalle
    updateSalle(idSalle, data) {
        return axios.put(`${API_URL}/salles/${idSalle}`, data);
    }

    // --- Matériel (PK: codeMat) ---
    getAllMateriel() {
        return axios.get(API_URL + '/materiel');
    }

    createMateriel(data) {
        return axios.post(API_URL + '/materiel', data);
    }
    
    // Le 'id' est le codeMat
    deleteMateriel(codeMat) {
        return axios.delete(`${API_URL}/materiel/${codeMat}`);
    }
}

export default new PatrimoineService();