import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance'; 

class FinanceService {

    // frontend/services/FinanceService.js


     
    getFinanceDashboardData() {
        return axios.get(API_URL + '/dashboard', { 
            // 💡 Si vous utilisez l'authentification, incluez le token ici
            // headers: { 'x-access-token': localStorage.getItem('token') }
        });
    }

    getFacturationData() {
        // 🚨 Il faut créer la route /api/finance/facturation dans financeRoutes.js
        return axios.get(API_URL + '/facturation'); 
    }
    
    /**
     * Déclenche la génération automatique de toutes les factures en attente.
     */
    generateInvoices() {
         // 🚨 Il faut créer la route POST /api/finance/generate-invoices
        return axios.post(API_URL + '/generate-invoices'); 
    }
    
    /**
     * Envoie une facture spécifique par email.
     */
    sendInvoice(invoiceId) {
        // 🚨 Il faut créer la route POST /api/finance/send-invoice/:id
        return axios.post(API_URL + `/send-invoice/${invoiceId}`); 
    }

    getPaymentData() {
        return axios.get(API_URL + '/payments'); 
    }
    
    /**
     * Valide un paiement en attente.
     */
    validatePayment(paymentId) {
        return axios.post(API_URL + `/validate-payment/${paymentId}`); 
    }
    
    /**
     * Envoie une relance au client pour un paiement en attente.
     */
    sendPaymentReminder(paymentId) {
        return axios.post(API_URL + `/send-reminder/${paymentId}`); 
    
    
    }

    getRapportsData() {
        return axios.get(API_URL + '/reports'); 
    }

    getLitigationCount() {
        // Correspond à la route GET /api/finance/litigation-count
        return axios.get(API_URL + '/litigation-count'); 
    }

    getMonthlyRevenue() {
        return axios.get(API_URL + '/monthly-revenue'); 
    }

    getPenalitesList() {
        return axios.get(API_URL + '/penalites'); 
    }
}



    
    // ... autres fonctions pour les factures, paiements, etc.



  

export default new FinanceService();