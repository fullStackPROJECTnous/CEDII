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

// 🆕 MÉTHODE CORRIGÉE POUR RÉCUPÉRER LE PROFIL CLIENT
async getProfile() {
    try {
        console.log('🔍 ClientService - Récupération du profil client...');
        
        const response = await axios.get(`${API_BASE_URL}/profile`, { 
            headers: authHeader()
        });
        
        console.log('✅ Profil client récupéré avec succès:', response.data);
        
        // Stocker les informations dans le localStorage pour un accès rapide
        if (response.data.success && response.data.data) {
            localStorage.setItem('clientInfo', JSON.stringify(response.data.data));
            console.log('💾 Profil stocké dans localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
},

// 🆕 MÉTHODE POUR RÉCUPÉRER LE PROFIL PAR ID
async getClientProfile(idCli) {
    try {
        console.log(`🔍 Récupération du profil client ID: ${idCli}`);
        
        const response = await axios.get(`${API_BASE_URL}/${idCli}`, { 
            headers: authHeader() 
        });
        
        console.log('✅ Profil client récupéré:', response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ Erreur récupération profil client (ID: ${idCli}):`, error.response?.data || error);
        throw error;
    }
},

// 🆕 MÉTHODE POUR RÉCUPÉRER SON PROPRE PROFIL (ALIAS)
async getMyProfile() {
    try {
        console.log("🔍 ClientService - Récupération de mon profil...");
        
        const response = await axios.get(`${API_BASE_URL}/profile`, { 
            headers: authHeader() 
        });
        
        console.log('✅ Mon profil récupéré:', response.data);
        
        // Stocker automatiquement dans localStorage
        if (response.data.success && response.data.data) {
            const clientData = response.data.data;
            localStorage.setItem('clientInfo', JSON.stringify(clientData));
            localStorage.setItem('userInfo', JSON.stringify({
                nom: clientData.nomCli,
                prenom: clientData.prenomCli,
                email: clientData.emailCli,
                telephone: clientData.telephoneCli,
                addresse: clientData.addresseCli
            }));
            console.log('💾 Profils stockés dans localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error("❌ Erreur récupération mon profil:", error.response?.data || error);
        throw error;
    }
},

// 🆕 MÉTHODE POUR RÉCUPÉRER LES RÉSERVATIONS DU CLIENT
async getClientReservations(idCli) {
    try {
        console.log("🔍 Récupération des réservations pour client:", idCli);
        
        const response = await axios.get(`${API_BASE_URL}/${idCli}/reservations`, {
            headers: authHeader()
        });
        
        console.log('✅ Réservations récupérées:', response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur récupération réservations:", error);
        throw error;
    }
},

// 🆕 MÉTHODE POUR METTRE À JOUR LE PROFIL
async updateMyProfile(profileData) {
    try {
        console.log("🔍 Mise à jour du profil...");
        
        const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
            headers: authHeader()
        });
        
        console.log('✅ Profil mis à jour:', response.data);
        
        // Mettre à jour le localStorage
        if (response.data.success && response.data.data) {
            localStorage.setItem('clientInfo', JSON.stringify(response.data.data));
            console.log('💾 Profil mis à jour dans localStorage');
        }
        
        return response.data;
    } catch (error) {
        console.error("❌ Erreur mise à jour profil:", error.response?.data || error);
        throw error;
    }
},

// 🆕 MÉTHODE POUR FORCER LA SYNCHRONISATION DU PROFIL
async syncProfile() {
    try {
        console.log('🔄 Synchronisation du profil client...');
        
        const response = await axios.get(`${API_BASE_URL}/profile`, {
            headers: authHeader()
        });
        
        if (response.data.success && response.data.data) {
            const clientData = response.data.data;
            
            // Stocker dans multiple keys pour compatibilité
            localStorage.setItem('clientInfo', JSON.stringify(clientData));
            localStorage.setItem('userInfo', JSON.stringify({
                nom: clientData.nomCli,
                prenom: clientData.prenomCli,
                email: clientData.emailCli,
                telephone: clientData.telephoneCli,
                addresse: clientData.addresseCli,
                nomCli: clientData.nomCli,
                prenomCli: clientData.prenomCli,
                emailCli: clientData.emailCli,
                telephoneCli: clientData.telephoneCli,
                addresseCli: clientData.addresseCli
            }));
            
            console.log('✅ Profil synchronisé et stocké:', clientData);
            return clientData;
        }
        
        throw new Error('Données de profil invalides');
    } catch (error) {
        console.error('❌ Erreur synchronisation profil:', error);
        throw error;
    }
}

};

export default ClientService;