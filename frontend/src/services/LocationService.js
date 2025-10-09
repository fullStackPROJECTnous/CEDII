import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations'; 

class LocationService {
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
    updateReservationStatus(idRes, status) {
        return axios.put(`${API_URL}/reservations/${idRes}/status`, { status });
    }

    deleteReservation(idRes) {
        return axios.delete(`${API_URL}/reservations/${idRes}`);
    }
}

export default new LocationService();