import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rapports'; 

class RapportService {
getKPIs() {
        // La route complète sur le backend est /api/rapports/kpis
        // Si API_URL contient déjà /api/rapports, il suffit d'ajouter /kpis
        // S'il ne le contient pas, il faut l'ajouter ici.
        
        // Solution simple : utiliser simplement /kpis
        return axios.get(`${API_URL}/kpis`);
        
        // Si votre API_URL est juste 'http://localhost:5000', utilisez :
        // return axios.get('http://localhost:5000/api/rapports/kpis');
    }
  
    getReservationsReport() {
        return axios.get(API_URL + '/reservations-report');
    }
    
    getTopRentedMateriel() {
        return axios.get(API_URL + '/top-materiel');
    }

    getRevenueByClientType() { // 👈 Nouvelle méthode
        return axios.get('http://localhost:5000/api/rapports/revenu-par-client');
    }
}

export default new RapportService();