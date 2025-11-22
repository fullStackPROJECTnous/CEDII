// frontend/services/FinanceService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance';

class FinanceService {
  // =========================================================================
  // FONCTIONS EXISTANTES
  // =========================================================================
  
  getCashflowSynthese() {
    return axios.get(`${API_URL}/cashflow-synthese`);
  }

  getFinanceDashboardData() {
    return axios.get(`${API_URL}/dashboard`);
  }

  getFacturationData() {
    return axios.get(`${API_URL}/facturation`);
  }

    async getPenalitesData() {
    try {
      const response = await axios.get(`${API_URL}/penalites`);
      return response;
    } catch (error) {
      console.error('Erreur API getPenalitesData:', error);
      throw error;
    }
  }
  
  getConfirmedLocationsToInvoice() {
    return axios.get(`${API_URL}/confirmed-locations`);
  }

  generateInvoices() {
    return axios.post(`${API_URL}/generate-invoices`);
  }

  // ✅ CORRECTION : Envoi de facture avec payload
  sendInvoice(payload) {
    return axios.post(`${API_URL}/send-invoice`, payload); // POST avec données
  }

  // ✅ CONSERVER l'ancienne méthode pour compatibilité
  sendInvoiceEmail(invoiceId) {
    return axios.post(`${API_URL}/send-invoice/${invoiceId}`);
  }

  getPaymentData() {
    return axios.get(`${API_URL}/payments`);
  }

  validatePayment(paymentId) {
    return axios.post(`${API_URL}/validate-payment/${paymentId}`);
  }

  sendPaymentReminder(paymentId) {
    return axios.post(`${API_URL}/send-reminder/${paymentId}`);
  }

  getRapportsData() {
    return axios.get(`${API_URL}/reports`);
  }

  getLitigationCount() {
    return axios.get(`${API_URL}/litigation-count`);
  }

  getMonthlyRevenue() {
    return axios.get(`${API_URL}/monthly-revenue`);
  }

  getPenalitesList() {
    return axios.get(`${API_URL}/penalites`);
  }

  // =========================================================================
  // NOUVELLES FONCTIONS CORRIGÉES
  // =========================================================================

  /**
   * Crée et envoie une facture par email
   */
  createAndSendInvoice(payload) {
    return axios.post(`${API_URL}/create-and-send-invoice`, payload);
}
  /**
   * Télécharge une facture en PDF
   */
  downloadInvoice(locationId) {
    return axios.get(`${API_URL}/download-invoice/${locationId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Exporte toutes les factures en ZIP
   */
  exportInvoices() {
    return axios.get(`${API_URL}/export-invoices`, {
      responseType: 'blob'
    });
  }

  /**
   * Génère un numéro de facture (optionnel)
   */
  generateInvoiceNumber() {
    return axios.get(`${API_URL}/generate-invoice-number`);
  }

  /**
   * Récupère l'historique des paiements
   */
  getPaymentHistory() {
    return axios.get(`${API_URL}/payment-history`);
  }
}

export default new FinanceService();