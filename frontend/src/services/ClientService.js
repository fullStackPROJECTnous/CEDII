import axios from 'axios';
import authHeader from './auth-header';


// L'URL de base pour l'API des clients sur votre backend Express
const API_BASE_URL = 'http://localhost:5000/api/clients'; 

const ClientService = {
    
    // 1. CREATE (POST)
    async createClient(clientData) {
        return axios.post(API_BASE_URL, clientData, { headers: authHeader() });
    },
    
    // 2. READ ALL (GET)
    async getAllClients() {
        // Inclut maintenant les agrégations nbLocations et revenuTotal
        return axios.get(API_BASE_URL, { 
           headers: authHeader() 
        }).then(response => response.data);
    },

  getRevenueByClientType() {
    return axios.get(`${API_BASE_URL}/revenue-by-client-type`, {
      headers: authHeader()
    });
  },

    // 3. READ ONE (GET by ID)
    async getById(idCli) {
        return axios.get(`${API_BASE_URL}/${idCli}`, { headers: authHeader() });
    },
    
    // 4. UPDATE (PUT)
    async updateClient(idCli, clientData) {
        return axios.put(`${API_BASE_URL}/${idCli}`, clientData, { headers: authHeader() });
    },
    
    // 5. DELETE (DELETE)
// services/ClientService.js
deleteClient(id) {
    console.log('🗑️ Suppression client ID:', id);
    
    // 🚨 CORRECTION : Vérifier l'URL
    return axios.delete(`http://localhost:5000/api/clients/${id}`, {
        headers: authHeader()
    })
    .then(response => {
        console.log('✅ Client supprimé avec succès');
        return response.data;
    })
    .catch(error => {
        console.error('❌ Erreur suppression client:', error);
        throw error;
    });
},


// Dans ClientService.js - getRankingMetrics
async getRankingMetrics() {
    console.log('📡 Appel API vers /rankings...');
    
    return axios.get(`${API_BASE_URL}/rankings`, { 
      
    })
    .then(response => {
        console.log('✅ Réponse API /rankings:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('❌ Erreur API /rankings:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error('Échec de la récupération des métriques de classement via API.');
    });
},
    // NOUVEAU: Appel à l'endpoint d'historique
   
// CORRECTION dans ClientService.js - getClientHistory
async getClientHistory(idCli) {
    console.log('📡 Appel API historique pour client:', idCli);
    
    return axios.get(`${API_BASE_URL}/${idCli}/history`, { 
        headers: authHeader() 
    })
    .then(response => {
        console.log('✅ Réponse API historique:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('❌ Erreur API historique:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error('Échec de la récupération de l\'historique client.');
    });
},

async getProfile() {
    try {
        const response = await axios.get(`${API_BASE_URL}/profile`, { 
            headers: authHeader() // 🚨 CRITIQUE : Envoie l'en-tête 'Authorization'
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération du profil par token:", error.response.data);
        throw error.response.data;
    }
},
    async getClientProfile(idCli) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${idCli}`, { headers: authHeader() });
            return response.data; 
        } catch (error) {
            console.error(`Erreur lors de la récupération du profil client (ID: ${idCli}):`, error.response?.data || error);
            throw error;
        }
    },
    
     async getMyProfile() {
    try {
      console.log("🔍 ClientService - appel profile avec token...");
      
      // 🚨 CORRECTION : AJOUT DE L'EN-TÊTE D'AUTORISATION
      const response = await axios.get(`${API_BASE_URL}/profile`, { headers: authHeader() }); 
      
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error.response?.data || error);
      throw error.response?.data || error; 
    }
  }
,
  async getClientReservations(idCli) {
    try {
      console.log("🔍 ClientService - appel réservations pour client:", idCli);
      const response = await axios.get(`${API_BASE_URL}/${idCli}/reservations`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      throw error;
    }
  }
}


;
export default ClientService;
