import axios from 'axios';

const API_URL = 'http://localhost:5000/api/finance'; 

class FinanceService {
    // 1. Obtient les détails de la facture virtuelle pour une location
    getFactureDetails(idLo) {
        return axios.get(`${API_URL}/facture/details/${idLo}`);
    }

    // 2. Récupère le suivi de toutes les locations non soldées
    getLocationsSuivi() {
        return axios.get(API_URL + '/suivi');
    }

    // 3. Enregistre un paiement
    recordPaiement(idLo, data) {
        // data = { montantPaye, modePaie }
        return axios.post(`${API_URL}/paiements/record/${idLo}`, data);
    }
}

export default new FinanceService();