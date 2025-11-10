/*import axios from 'axios';

const API_URL = 'http://localhost:5000/api/locations'; 

class LocationService {

    // NOUVEAU: Récupérer les détails complets pour la page de validation
    getReservationDetails(idRes) {
       
        return axios.get(`${API_URL}/reservations/${idRes}/details`);
    }

    // NOUVEAU: Validation (transfert vers Location et gestion du stock)
    validateReservation(idRes, signatureData) {
        // Mapped to POST /api/locations/reservations/:idRes/validate
        return axios.post(`${API_URL}/reservations/${idRes}/validate`, { signatureData });
    }

    // NOUVEAU: État des Lieux, Départs, Retours, Facturation dégradations, Remise en stock
    submitEtatLieux(idLo, mode, payload) {
        // payload contient materielCode, qteMat, estEndommage, coutReparation, descriptionDegradation
        // Mapped to POST /api/locations/locations/:idLo/etat-lieux
        return axios.post(`${API_URL}/locations/${idLo}/etat-lieux`, {
             ...payload,
             mode: mode
        });
    }
   getReceptionDashboardData() {
        // Nous allons chercher les données via un endpoint dédié au dashboard de réception
        // Route attendue côté backend : /api/locations/reception/dashboard
        return axios.get(`${API_URL}/reception/dashboard`, {
             // Ajoutez les headers d'authentification si nécessaire
             // headers: authHeader()
        });
    }

  getPendingReservations() {
        // 🚨 CORRECTION DU CHEMIN: Utiliser 'pending' (ou 'en-attente') et s'assurer qu'il n'est pas dupliqué
        // Backend: router.get('/reservations/pending', locationController.getPendingReservations);
        return axios.get(`${API_URL}/reservations/pending`); 
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

export default new LocationService();*/

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
        // Nouvelle route attendue : /api/locations/events/confirmed
        return axios.get(API_URL + '/events/confirmed'); 
    }

    static async calculateTarifSalle(idSalle, data) {
    const response = await api.post(`/salles/${idSalle}/calculate-tarif`, data);
    return response.data;
}
}

export default new LocationService();