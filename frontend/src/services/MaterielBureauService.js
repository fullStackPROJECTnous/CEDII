// frontend/services/MaterielBureauService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/materiel-bureau';

class MaterielBureauService {
    getAll() {
        return axios.get(API_URL);
    }

    create(materiel) {
        return axios.post(API_URL, materiel);
    }

    update(id, materiel) {
        return axios.put(`${API_URL}/${id}`, materiel);
    }

    delete(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    assignerUtilisateur(id, data) {
        return axios.post(`${API_URL}/${id}/assigner`, data);
    }
}

export default new MaterielBureauService();