/*

import axios from 'axios';

// 🚨 Adaptez ce port si votre backend est sur un autre port que 5000
const API_URL = 'http://localhost:5000/api/salle'; 

class SalleService {
    
    // Récupérer toutes les salles (GET /api/salle)
    getAllSalles() {
        return axios.get(API_URL);
    }

    // Ajouter une nouvelle salle (POST /api/salle)
    createSalle(data) {
        return axios.post(API_URL, data);
    }

    // Mettre à jour une salle (PUT /api/salle/:idSalle)
    updateSalle(idSalle, data) {
        return axios.put(`${API_URL}/${idSalle}`, data);
    }

    // Supprimer une salle (DELETE /api/salle/:idSalle)
    deleteSalle(idSalle) {
        return axios.delete(`${API_URL}/${idSalle}`);
    }
}

export default new SalleService();*/

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/salle';

class SalleService {
    // CRUD de base
    getAllSalles(filters = {}) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'tous') {
                params.append(key, filters[key]);
            }
        });
        
        const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
        console.log('🔍 Appel API Salles:', url);
        return axios.get(url);
    }

    getSalle(idSalle) {
        return axios.get(`${API_URL}/${idSalle}`);
    }

    createSalle(salle) {
        return axios.post(API_URL, salle);
    }

    updateSalle(idSalle, salle) {
        return axios.put(`${API_URL}/${idSalle}`, salle);
    }

    deleteSalle(idSalle) {
        return axios.delete(`${API_URL}/${idSalle}`);
    }

    // Fonctionnalités avancées
    getReservationsSalle(idSalle) {
        return axios.get(`${API_URL}/${idSalle}/reservations`);
    }

    checkDisponibilite(idSalle, dateDebut, dateFin) {
        return axios.post(`${API_URL}/${idSalle}/check-disponibilite`, {
            dateDebut,
            dateFin
        });
    }

    getCalendrierSalle(idSalle, mois, annee) {
        return axios.get(`${API_URL}/${idSalle}/calendrier?mois=${mois}&annee=${annee}`);
    }
}

export default new SalleService();