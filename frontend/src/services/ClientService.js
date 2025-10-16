// frontend/src/services/ClientService.js

/*import axios from 'axios';
import authHeader from './auth-header';


// L'URL de base pour l'API des clients sur votre backend Express
// J'ai utilisé le port 5000 comme indiqué dans votre fichier server.js
const API_BASE_URL = 'http://localhost:5000/api/clients'; 

const ClientService = {
    
    // 1. CREATE (POST)
    async createClient(clientData) {
        try {
            // clientData doit contenir les champs: nomCli, telCli, adrCli, typeCli, statutCli
            const response = await axios.post(API_BASE_URL, clientData);
            return response.data; // Le client nouvellement créé
        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    },
    
    async getAllClients() {
        return axios.get(API_BASE_URL, { 
            headers: authHeader() // 🚨 Ajout du token JWT
        }).then(response => response.data).catch(error => {
             console.error("Error fetching clients:", error);
             throw error;
        });
    },
    // 2. READ ALL (GET)
   /* async getAll() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data; // La liste des clients
        } catch (error) {
            console.error("Error fetching clients:", error);
            throw error;
        }
    },*/

    // 3. READ ONE (GET by ID)
  /*  async getById(idCli) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${idCli}`);
            return response.data; // Le client spécifique
        } catch (error) {
            console.error(`Error fetching client with id ${idCli}:`, error);
            throw error;
        }
    },
    
    // 4. UPDATE (PUT)
    async updateClient(idCli, clientData) {
        try {
            // clientData contient les données mises à jour
            const response = await axios.put(`${API_BASE_URL}/${idCli}`, clientData);
            return response.data; // Le message de succès du backend
        } catch (error) {
            console.error(`Error updating client with id ${idCli}:`, error);
            throw error;
        }
    },
    
    // 5. DELETE (DELETE)
    async deleteClient(idCli) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${idCli}`);
            return response.data; // Le message de succès du backend
        } catch (error) {
            console.error(`Error deleting client with id ${idCli}:`, error);
            throw error;
        }
    }
};



export default ClientService;*/

// frontend/src/services/ClientService.js

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

    // 3. READ ONE (GET by ID)
    async getById(idCli) {
        return axios.get(`${API_BASE_URL}/${idCli}`, { headers: authHeader() });
    },
    
    // 4. UPDATE (PUT)
    async updateClient(idCli, clientData) {
        return axios.put(`${API_BASE_URL}/${idCli}`, clientData, { headers: authHeader() });
    },
    
    // 5. DELETE (DELETE)
    async deleteClient(idCli) {
        return axios.delete(`${API_BASE_URL}/${idCli}`, { headers: authHeader() });
    },

    /* ====================================== */
    /*         NOUVELLES MÉTHODES DE SERVICE     */
    /* ====================================== */
    
    /**
     * Récupère le classement des clients (actif et rentable).
     * Route : GET /api/clients/rankings
     */
   /* async getClientRankings() {
        return axios.get(`${API_BASE_URL}/rankings`, { 
            headers: authHeader() 
        }).then(response => response.data);
    },

    /**
     * Récupère l'historique des locations d'un client.
     * Route : GET /api/clients/:id/history
     */
  /*  async getClientHistory(idCli) {
        return axios.get(`${API_BASE_URL}/${idCli}/history`, { 
            headers: authHeader() 
        }).then(response => response.data);
    }*/
};

export default ClientService;
