import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance';

class FinanceService {
  // Méthodes principales
  getFinanceDashboardData() {
    return axios.get(`${API_URL}/dashboard`);
  }

  getConfirmedLocations() {
    return axios.get(`${API_URL}/confirmed-locations`);
  }

  createAndSendInvoice(payload) {
    return axios.post(`${API_URL}/create-and-send-invoice`, payload);
  }

  downloadInvoice(locationId) {
    return axios.get(`${API_URL}/download-invoice/${locationId}`, {
      responseType: 'blob'
    });
  }

  // Méthodes pénalités
  calculatePenalties() {
    return axios.get(`${API_URL}/penalties/calculate`);
  }

  sendPenaltyNotifications() {
    return axios.post(`${API_URL}/penalties/notify`);
  }

  // Méthodes paiements
  getPaymentData() {
    return axios.get(`${API_URL}/payments`);
  }

  validatePayment(paymentId) {
    return axios.post(`${API_URL}/validate-payment/${paymentId}`);
  }

  // Méthodes statistiques
  static async getChiffreAffaires() {
    try {
      const response = await axios.get(`${API_URL}/chiffre-affaires`);
      return response;
    } catch (error) {
      console.error('Erreur récupération CA:', error);
      throw error;
    }
  }

  static async getFacturesEnvoyees() {
    try {
      const response = await axios.get(`${API_URL}/factures-envoyees`);
      return response;
    } catch (error) {
      console.error('Erreur comptage factures:', error);
      throw error;
    }
  }

  // Autres méthodes
  exportInvoices() {
    return axios.get(`${API_URL}/export-invoices`, {
      responseType: 'blob'
    });
  }
}

export default new FinanceService();