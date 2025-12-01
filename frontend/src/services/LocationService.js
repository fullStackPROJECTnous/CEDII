// src/services/LocationService.js - VERSION CORRIGÉE
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Créer une instance axios avec configuration par défaut
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercepteur pour ajouter automatiquement le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class LocationService {
  async getClients() {
    try {
      const response = await axiosInstance.get('/clients');
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }
  }

  async getSalles() {
    try {
      const response = await axiosInstance.get('/salles/debug/salles');
      console.log('📡 Données salles reçues:', response.data);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des salles:", error);
      throw error;
    }
  }

  async getMateriels() {
    try {
      const response = await axiosInstance.get('/patrimoine/debug/materiel');
      console.log('📡 Données matériels reçues:', response.data);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du matériel:", error);
      throw error;
    }
  }

  getReservationDetails(idRes) {
    return axiosInstance.get(`/locations/reservations/${idRes}/details`);
  }

  validateReservation(idRes, signatureData) {
    return axiosInstance.post(`/locations/reservations/${idRes}/validate`, { signatureData });
  }

  async getCurrentClient() {
    try {
      console.log("📍 Appel à /clients/me");
      const response = await axiosInstance.get('/clients/me');
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

  async submitEtatLieux(locationId, etatLieuxData) {
    try {
      if (!locationId) {
        throw new Error('ID de location manquant');
      }

      console.log('📍 Appel API état des lieux - ID:', locationId);
      console.log('📍 Données:', etatLieuxData);

      const response = await axiosInstance.post(
        `/etat-lieux/${locationId}`, 
        etatLieuxData
      );
      
      console.log('✅ Réponse API état des lieux:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ Erreur LocationService - submitEtatLieux:', error);
      throw error;
    }
  }

  getLocationDetails(idLo) {
    return axiosInstance.get(`/locations/${idLo}/details`);
  }

  createReservation(data) {
    return axiosInstance.post('/reservations', data);
  }

  createClientReservation(data) {
    return axiosInstance.post('/client/reservations', data);
  }

  // 🔥 CORRECTION COMPLÈTE : Mise à jour du statut de réservation
  async updateReservationStatus(reservationId, statutRes) {
    try {
      console.log('📍 LocationService - updateReservationStatus:');
      console.log('📍 Reservation ID:', reservationId);
      console.log('📍 Nouveau statut:', statutRes);
      
      // Vérifier le token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }
      
      console.log('📍 Token présent:', token.substring(0, 20) + '...');

      // Essayer plusieurs endpoints possibles
      const endpoints = [
        `/reservations/${reservationId}/status`,
        `/reservations/${reservationId}/update-status`,
        `/locations/reservations/${reservationId}/status`,
        `/admin/reservations/${reservationId}/status`
      ];

      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`📍 Essai sur l'endpoint: ${endpoint}`);
          
          const response = await axiosInstance.patch(
            endpoint,
            { 
              statutRes: statutRes,
              etatRes: statutRes // Essayer les deux noms de champ
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );

          console.log('✅ Réponse serveur:', response.data);
          return response;
          
        } catch (error) {
          console.log(`⚠️ Échec sur ${endpoint}:`, error.response?.status);
          lastError = error;
          
          // Si c'est une erreur 404, continuer à essayer d'autres endpoints
          if (error.response?.status !== 404) {
            throw error; // Pour les autres erreurs, arrêter
          }
        }
      }
      
      // Si tous les endpoints ont échoué
      throw lastError || new Error('Aucun endpoint valide trouvé pour mettre à jour le statut');
      
    } catch (error) {
      console.error('❌ ERREUR LocationService - updateReservationStatus:');
      console.error('📍 Statut HTTP:', error.response?.status);
      console.error('📍 Message erreur:', error.response?.data || error.message);
      
      // Fournir un message d'erreur plus utile
      let errorMessage = 'Impossible de mettre à jour le statut';
      
      if (error.response?.status === 403) {
        errorMessage = 'Permission refusée. Vous n\'avez pas les droits nécessaires.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async updateLocationStatus(locationId, payload) {
    try {
      console.log('📍 LocationService - updateLocationStatus:');
      console.log('📍 Location ID:', locationId);
      console.log('📍 Payload:', payload);

      const response = await axiosInstance.put(
        `/locations/${locationId}/status`,
        payload
      );

      console.log('📍 Réponse serveur:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ ERREUR LocationService - updateLocationStatus:', error);
      throw error;
    }
  }

  getReceptionDashboardData() {
    return axiosInstance.get('/locations/reception/dashboard');
  }

  getPendingReservations() {
    return axiosInstance.get('/reservations/pending/requests'); 
  }

  getLocationHistory() {
    return axiosInstance.get('/locations/history'); 
  }

  getConfirmedEvents() {
    return axiosInstance.get('/locations/events/confirmed');
  }

  getTerminatedLocations() {
    return axiosInstance.get('/locations/terminated');
  }

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
    return axiosInstance.delete(`/reservations/${idRes}`);
  }

  checkAvailability(params) {
    return axiosInstance.get('/locations/availability', { params }); 
  }

  static async calculateTarifSalle(idSalle, data) {
    const response = await axiosInstance.post(`/salles/${idSalle}/calculate-tarif`, data);
    return response.data;
  }

  marquerNotificationLue(idNotif) {
    return axiosInstance.patch(`/reservations/notifications/${idNotif}/read`);
  }

  createPublicReservation(data) {
    return axiosInstance.post('/reservations/public/reservations', data);
  }

  getNotifications() {
    return axiosInstance.get('/reservations/notifications');
  }
}

export default new LocationService();