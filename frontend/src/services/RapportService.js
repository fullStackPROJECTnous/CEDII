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
    
  

  /**
   * Récupère le rapport des réservations par statut
   */
  getReservationsReport() {
    return axios.get(`${API_URL}/reservations`);
  }

  /**
   * Récupère le top des matériels les plus loués
   */
  getTopRentedMateriel() {
    return axios.get(`${API_URL}/top-materiel`);
  }

  /**
   * Récupère les statistiques mensuelles
   */


  /**
   * Récupère la répartition par type de location
   */
 

  /**
   * Récupère l'historique des revenus
   */
  getRevenueHistory() {
    return axios.get(`${API_URL}/revenue-history`);
  }

  /**
   * Exporte les rapports en PDF
   */
 
 
  
  // 🆕 NOUVEAUX ENDPOINTS
  getReservationsStats() {
    return axios.get(`${API_URL}/reservations`);
  }

  getMonthlyStats() {
    return axios.get(`${API_URL}/monthly-stats`);
  }

  getLocationTypes() {
    return axios.get(`${API_URL}/location-types`);
  }

  exportReports(format = 'pdf') {
    return axios.get(`${API_URL}/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

}



export default new RapportService();