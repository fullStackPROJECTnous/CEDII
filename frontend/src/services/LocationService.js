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

  getReceptionDashboardData() {
    return axios.get(`${API_URL}/locations/reception/dashboard`);
  }

  getPendingReservations() {
    return axios.get(`${API_URL}/locations/reservations/pending`); 
  }

  getLocationHistory() {
    return axios.get(`${API_URL}/locations/history`); 
  }

  // Méthode pour créer une réservation (version standard)
  createReservation(data) {
    return axios.post(`${API_URL}/locations/reservations`, data);
  }

  // Méthode pour créer une réservation client (avec authentification)
  createClientReservation(data) {
    return axios.post(`${API_URL}/locations/client/reservations`, data);
  }

  updateReservationStatus(idRes, newStatus) {
    return axios.put(`${API_URL}/locations/reservations/${idRes}/status`, { newStatus: newStatus });
  }

  deleteReservation(idRes) {
    return axios.delete(`${API_URL}/locations/reservations/${idRes}`);
  }

  checkAvailability(params) {
    return axios.get(`${API_URL}/locations/availability`, { params }); 
  }

  getConfirmedEvents() {
    return axios.get(`${API_URL}/finance/confirmed-locations`);
  }

  static async calculateTarifSalle(idSalle, data) {
    const response = await axios.post(`${API_URL}/salles/${idSalle}/calculate-tarif`, data);
    return response.data;
  }
}

export default new LocationService();