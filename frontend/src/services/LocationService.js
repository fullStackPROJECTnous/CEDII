// src/services/LocationService.js - VERSION COMPLÈTE ET CORRIGÉE
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class LocationService {
  async getClients() {
    try {
      const response = await axios.get(`${API_URL}/clients`);
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }
  }

  /**
   * Récupère le catalogue des salles disponibles depuis la route debug
   */
  async getSalles() {
    try {
      const response = await axios.get(`${API_URL}/salles/debug/salles`);
      console.log('📡 Données salles reçues:', response.data);
      return response.data.data; // ✅ Accéder au tableau data
    } catch (error) {
      console.error("Erreur lors de la récupération des salles:", error);
      throw error;
    }
  }

  /**
   * Récupère le catalogue des matériels disponibles depuis la route debug
   */
  async getMateriels() {
    try {
      const response = await axios.get(`${API_URL}/patrimoine/debug/materiel`);
      console.log('📡 Données matériels reçues:', response.data);
      return response.data.data; // ✅ Accéder au tableau data
    } catch (error) {
      console.error("Erreur lors de la récupération du matériel:", error);
      throw error;
    }
  }

  getReservationDetails(idRes) {
    return axios.get(`${API_URL}/locations/reservations/${idRes}/details`);
  }

  validateReservation(idRes, signatureData) {
    return axios.post(`${API_URL}/locations/reservations/${idRes}/validate`, { signatureData });
  }

  async getCurrentClient() {
    try {
      console.log("📍 Appel à /clients/me");
      const response = await axios.get(`${API_URL}/clients/me`);
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

  // Méthode submitEtatLieux corrigée
  async submitEtatLieux(locationId, etatLieuxData) {
    try {
      // 🔥 VALIDATION: Vérifier que l'ID est défini
      if (!locationId) {
        throw new Error('ID de location manquant');
      }

      console.log('📍 Appel API état des lieux - ID:', locationId);
      console.log('📍 Données:', etatLieuxData);

      const response = await axios.post(
        `${API_URL}/etat-lieux/${locationId}`, 
        etatLieuxData
      );
      
      console.log('✅ Réponse API état des lieux:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur LocationService - submitEtatLieux:');
      console.error('📍 URL appelée:', `${API_URL}/etat-lieux/${locationId}`);
      console.error('📍 Données envoyées:', etatLieuxData);
      console.error('📍 Statut HTTP:', error.response?.status);
      console.error('📍 Message erreur:', error.response?.data || error.message);
      
      throw error;
    }
  }

  getLocationDetails(idLo) {
    return axios.get(`${API_URL}/locations/${idLo}/details`);
  }

  // Méthode pour créer une réservation (version standard)
  createReservation(data) {
    return axios.post(`${API_URL}/reservations`, data);
  }

  // Méthode pour créer une réservation client (avec authentification)
  createClientReservation(data) {
    return axios.post(`${API_URL}/client/reservations`, data);
  }

  // 🔥 CORRECTION : Méthode updateReservationStatus avec le bon chemin et paramètres
  async updateReservationStatus(reservationId, statutRes) {
    try {
      console.log('📍 LocationService - updateReservationStatus:');
      console.log('📍 Reservation ID:', reservationId);
      console.log('📍 Nouveau statut:', statutRes);

      const response = await axios.patch(
        `${API_URL}/reservations/${reservationId}/status`,
        { etatRes: statutRes }, // ✅ Utiliser 'etatRes' comme dans le backend
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📍 Réponse serveur:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ ERREUR LocationService - updateReservationStatus:');
      console.error('📍 URL:', error.config?.url);
      console.error('📍 Méthode:', error.config?.method);
      console.error('📍 Données envoyées:', error.config?.data);
      console.error('📍 Statut HTTP:', error.response?.status);
      console.error('📍 Message erreur:', error.response?.data);
      throw error;
    }
  }

  // 🔥 MÉTHODE : Mettre à jour le statut d'une LOCATION
  async updateLocationStatus(locationId, payload) {
    try {
      console.log('📍 LocationService - updateLocationStatus:');
      console.log('📍 Location ID:', locationId);
      console.log('📍 Payload:', payload);

      const response = await axios.put(
        `${API_URL}/locations/${locationId}/status`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📍 Réponse serveur:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ ERREUR LocationService - updateLocationStatus:');
      console.error('📍 URL:', error.config?.url);
      console.error('📍 Méthode:', error.config?.method);
      console.error('📍 Données envoyées:', error.config?.data);
      console.error('📍 Statut HTTP:', error.response?.status);
      console.error('📍 Message erreur:', error.response?.data);
      throw error;
    }
  }

  getReceptionDashboardData() {
    return axios.get(`${API_URL}/locations/reception/dashboard`);
  }

  // 🔥 CORRECTION : Utiliser le bon chemin pour les demandes en attente
  getPendingReservations() {
    return axios.get(`${API_URL}/reservations/pending/requests`); 
  }

  getLocationHistory() {
    return axios.get(`${API_URL}/locations/history`); 
  }

  // Méthode pour les événements confirmés du calendrier
  getConfirmedEvents() {
    return axios.get(`${API_URL}/locations/events/confirmed`);
  }

  // Nouvelle méthode pour les locations terminées
  getTerminatedLocations() {
    return axios.get(`${API_URL}/locations/terminated`);
  }

  // Méthode alternative pour mettre à jour le statut d'une location (version simplifiée)
  updateLocationStatusSimple(locationId, newStatus) {
    console.log(`📍 Appel API mise à jour statut: ${locationId} → ${newStatus}`);
    
    // Pour l'instant, simuler un appel API réussi
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: 'Statut mis à jour localement' } });
      }, 100);
    });
  }

  deleteReservation(idRes) {
    return axios.delete(`${API_URL}/reservations/${idRes}`);
  }

  checkAvailability(params) {
    return axios.get(`${API_URL}/locations/availability`, { params }); 
  }

  static async calculateTarifSalle(idSalle, data) {
    const response = await axios.post(`${API_URL}/salles/${idSalle}/calculate-tarif`, data);
    return response.data;
  }

  // 🔥 NOUVELLE MÉTHODE : Marquer une notification comme lue
  marquerNotificationLue(idNotif) {
    return axios.patch(`${API_URL}/reservations/notifications/${idNotif}/read`);
  }

  // 🔥 NOUVELLE MÉTHODE : Créer une réservation publique
  createPublicReservation(data) {
    return axios.post(`${API_URL}/reservations/public/reservations`, data);
  }

  // 🔥 NOUVELLE MÉTHODE : Récupérer les notifications
  getNotifications() {
    return axios.get(`${API_URL}/reservations/notifications`);
  }
}

export default new LocationService();