import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations'; 

class LocationService {
   getReceptionDashboardData() {
        // Nous allons chercher les données via un endpoint dédié au dashboard de réception
        // Route attendue côté backend : /api/locations/reception/dashboard
        return axios.get(`${API_URL}/reception/dashboard`, {
             // Ajoutez les headers d'authentification si nécessaire
             // headers: authHeader()
        });
    }
   
   
    // Réservations Actives / En Attente
   getPendingReservations() {
    return axios.get(API_URL + '/reservations/pending'); // Résultat: /api/locations/reservations/pending
}

    // Historique des Locations Terminées
    getLocationHistory() {
        return axios.get(API_URL + '/locations/history');
    }

    createReservation(data) {
        return axios.post(API_URL + '/reservations', data);
    }
    
    // Mettre à jour le statut
  updateReservationStatus(idRes, newStatus) {
        // Route attendue côté backend : /api/locations/reservations/:idRes/status
        return axios.put(`${API_URL}/reservations/${idRes}/status`, { newStatus: newStatus });
    }

    deleteReservation(idRes) {
        return axios.delete(`${API_URL}/reservations/${idRes}`);
    }

    checkAvailability(params) {
    // Envoie les paramètres de recherche (type, start, end)
    return axios.get(`${API_URL}/availability`, { params }); 
}

getConfirmedEvents() {
        // Nouvelle route attendue : /api/locations/events/confirmed
        return axios.get(API_URL + '/events/confirmed'); 
    }
   

}

export default new LocationService();