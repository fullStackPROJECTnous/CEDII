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

    getCashflowSynthese() {
    return axios.get(`${API_URL}/cashflow-synthese`);
  }


  getChiffreAffaires() {
    return axios.get(`${API_URL}/chiffre-affaires`);
  }

  getFacturesEnvoyees() {
    return axios.get(`${API_URL}/factures-envoyees`);
  }

// Dans FinanceService.js
cancelPayment(paymentId) {
    return axios.post(`${API_URL}/cancel-payment/${paymentId}`);
}

// Méthode pour télécharger les factures PAYÉES - VERSION CORRIGÉE
downloadPaidInvoice(locationId) {
  return axios.get(`${API_URL}/paid-invoices/${locationId}/download`, {
    responseType: 'blob',
    timeout: 30000,
    headers: {
      'Accept': 'application/pdf',
      'Cache-Control': 'no-cache'
    }
  });
}

  // Autres méthodes
  exportInvoices() {
    return axios.get(`${API_URL}/export-invoices`, {
      responseType: 'blob'
    });
  }
}

export default new FinanceService();