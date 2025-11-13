

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations'; 

class LocationService {

async getClients() {
        try {
            const response = await axios.get(`${API_URL}/clients`);
            // Retourne le tableau de données directement, comme attendu par le composant Vue
            return response.data; 
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
            throw error;
        }
    }

    /**
     * Récupère le catalogue des salles disponibles.
     * Endpoint attendu côté backend : GET /api/locations/salles
     */
    async getSalles() {
        try {
            const response = await axios.get(`${API_URL}/salles`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des salles:", error);
            throw error;
        }
    }

    
    async getMateriels() {
        try {
            const response = await axios.get(`${API_URL}/materiels`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération du matériel:", error);
            throw error;
        }
    }

    getReservationDetails(idRes) {
        return axios.get(`${API_URL}/reservations/${idRes}/details`);
    }

    validateReservation(idRes, signatureData) {
        // Mapped to POST /api/locations/reservations/:idRes/validate
        return axios.post(`${API_URL}/reservations/${idRes}/validate`, { signatureData });
    }


      async getCurrentClient() {
        try {
            console.log("📍 Appel à /clients/me");
            const response = await axios.get('/clients/me');
            console.log("✅ Réponse getCurrentClient:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Erreur getCurrentClient:", {
                status: error.response?.status,
                message: error.response?.data?.message,
                error: error.message
            });
            throw error;
        }
    }
  // ...
    submitEtatLieux(idLo, mode, payload) {
        // Mapped to POST /api/locations/:idLo/etat-lieux
        // 🚨 Assurez-vous d'utiliser `${API_URL}/${idLo}/etat-lieux`
        return axios.post(`${API_URL}/${idLo}/etat-lieux`, {
            details: payload, 
            mode: mode
        });
    }
// ...

    getLocationDetails(idLo) {
        // Cette route correspond au contrôleur exports.getLocationDetails (GET /api/locations/:idLo/details)
        return axios.get(`${API_URL}/${idLo}/details`);
    }

    getReceptionDashboardData() {
        // Route attendue côté backend : /api/locations/reception/dashboard
        return axios.get(`${API_URL}/reception/dashboard`);
    }

    getPendingReservations() {
        // Backend: router.get('/reservations/pending', locationController.getPendingReservations);
        return axios.get(`${API_URL}/reservations/pending`); 
    }


    // Historique des Locations Terminées
    getLocationHistory() {
        // 🚨 CORRECTION appliquée ici 🚨: Suppression du '/locations' superflu
        // Route attendue côté backend : /api/locations/history
        return axios.get(API_URL + '/history'); 
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

   async getCurrentClient() {
        try {
            const response = await axios.get('/clients/me');
            return response.data;
        } catch (error) {
            console.error("Erreur getCurrentClient:", error);
            throw error;
        }
    }
    checkAvailability(params) {
    // Envoie les paramètres de recherche (type, start, end)
    return axios.get(`${API_URL}/availability`, { params }); 
    }

 getConfirmedEvents() {
    // CORRECTION : Utilisez la route finance qui existe
    return axios.get('http://localhost:5000/api/finance/confirmed-locations');
 }

    static async calculateTarifSalle(idSalle, data) {
    const response = await api.post(`/salles/${idSalle}/calculate-tarif`, data);
    return response.data;
}
}

export default new LocationService();