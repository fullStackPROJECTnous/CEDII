import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rapports'; 

class RapportService {
getKPIs() {
       
        return axios.get(`${API_URL}/kpis`);
        
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