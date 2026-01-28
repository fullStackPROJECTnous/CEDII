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

  async validatePaymentWithDetails(validationData) {
    try {
      console.log('📤 Envoi validation paiement avec détails:', validationData);
      
      const response = await axios.post(
        `${API_URL}/payments/${validationData.paymentId}/validate-with-details`,
        {
          paymentMethod: validationData.paymentMethod,
          referenceId: validationData.referenceId,
          senderName: validationData.senderName,
          notes: validationData.notes
        },
       /* {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }*/
      );
      
      console.log('✅ Réponse validation paiement:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erreur validation paiement avec détails:', error);
      throw error;
    }
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

// Dans FinanceService.js - AJOUTEZ CES MÉTHODES

// Méthodes pour les rapports financiers
getRapportsData() {
  return axios.get(`${API_URL}/rapports-data`);
}

// Dans FinanceService.js - AJOUTEZ CES MÉTHODES

// Méthodes pour les pénalités
getPenalitesData() {
  return axios.get(`${API_URL}/penalites-data`);
}

sendPenaltyReminder(payload) {
  return axios.post(`${API_URL}/send-penalty-reminder`, payload, {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

getMonthlyRevenue() {
  return axios.get(`${API_URL}/monthly-revenue`);
}

// Dans FinanceService.js
sendPaymentReminder(data) {
  // Si data est un nombre (ID), convertir en objet
  const requestData = typeof data === 'number' ? { paymentId: data } : data;
  
  return axios.post(`${API_URL}/finance/send-payment-reminder`, requestData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
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
// Dans FinanceService.js - Ajoutez cette méthode
sendPaymentReminderByIdInUrl(paymentId) {
  return axios.post(`${API_URL}/send-payment-reminder/${paymentId}`, {}, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

  // Autres méthodes
  exportInvoices() {
    return axios.get(`${API_URL}/export-invoices`, {
      responseType: 'blob'
    });
  }

  // Dans FinanceService.js, ajoutez cette méthode :

getPerformanceStats() {
  return axios.get(`${API_URL}/performance-stats`);
}
}

export default new FinanceService();