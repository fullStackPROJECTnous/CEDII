

import axios from 'axios';

import authHeader from './auth-header';

const API_BASE_URL = 'http://localhost:5000/'; // Ajustez l'URL

class ReservationService {
  async getClientReservations(clientId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/client/${clientId}`, {
        headers: authHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error;
    }
  }
}

export default new ReservationService();