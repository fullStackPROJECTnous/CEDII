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


  /*  async getRankingMetrics() {
    // Requête 1: Client le plus rentable (Top Revenue)
    const sqlTopClient = `
        SELECT C.nomCli, C.prenomCli, SUM(P.montantPaie) AS totalRevenue
        FROM client C
        JOIN reservation R ON C.idCli = R.idCli
        JOIN location L ON R.idRes = L.idRes
        JOIN paiement P ON L.idLo = P.idPaie 
        WHERE P.statutPaie = 'Effectué'
        AND L.dateCre >= DATE_FORMAT(NOW(), '%Y-%m-01')
        GROUP BY C.idCli, C.nomCli, C.prenomCli
        ORDER BY totalRevenue DESC LIMIT 1;
    `;
    
    // Requête 2: Client le plus actif (Top Locations)
    const sqlActiveClient = `
        SELECT C.nomCli, C.prenomCli, COUNT(L.idLo) AS totalLocations
        FROM client C
        JOIN reservation R ON C.idCli = R.idCli
        JOIN location L ON R.idRes = L.idRes
        WHERE L.etatLo IN ('Confirmée', 'Terminée') 
        GROUP BY C.idCli, C.nomCli, C.prenomCli
        ORDER BY totalLocations DESC LIMIT 1;
    `;

    try {
        const topClientResult = await database.query(sqlTopClient);
        const activeClientResult = await database.query(sqlActiveClient);

        return {
            topClient: topClientResult[0] || {}, // Retourne le premier résultat
            activeClient: activeClientResult[0] || {} // Retourne le premier résultat
        };
    } catch (error) {
        throw new Error('Erreur lors de la récupération des métriques de classement: ' + error.message);
    }
},

// Suite de ClientService.js (Côté Backend / API logic)

    async getClientHistory(idCli) {
    // Requête 3: Historique Locations Passées
    const sqlLocations = `
        SELECT L.idLo, L.dateCre, L.debLo AS dateDebut, L.finLo AS dateFin, L.tarifTot AS montant, L.typeLo
        FROM location L
        JOIN reservation R ON L.idRes = R.idRes
        WHERE R.idCli = ? -- Utilisation d'un paramètre
        AND L.etatLo = 'Terminée'
        ORDER BY L.dateCre DESC;
    `;
    
    // Requête 4: Réservations Actuelles/Futures
    const sqlReservations = `
        SELECT R.idRes AS idResa, R.dateCre AS dateResa, R.debRes AS dateDebut, R.finRes AS dateFin, R.typeRes AS type, R.etatRes AS statut
        FROM reservation R
        WHERE R.idCli = ? -- Utilisation d'un paramètre
        AND R.etatRes IN ('En attente', 'Confirmée')
        ORDER BY R.debRes ASC;
    `;

    try {
        const locations = await database.query(sqlLocations, [idCli]);
        const reservations = await database.query(sqlReservations, [idCli]);

        return {
            locations,
            reservations
        };
    } catch (error) {
        throw new Error('Erreur lors de la récupération de l’historique client: ' + error.message);
    }
},*/

// export des méthodes (mis à jour)

// NOUVEAU: Appel à l'endpoint de classement
    /*async getRankingMetrics() {
        // L'API backend doit maintenant exposer une route 'GET /api/clients/rankings'
        return axios.get(`${API_BASE_URL}/rankings`, { 
            headers: authHeader() 
        }).then(response => response.data)
        .catch(error => {
            console.error("Erreur lors de l'appel /rankings:", error.response?.data || error);
            throw new Error('Échec de la récupération des métriques de classement via API.');
        });
    },
*/


// Dans ClientService.js - getRankingMetrics
async getRankingMetrics() {
    console.log('📡 Appel API vers /rankings...');
    
    return axios.get(`${API_BASE_URL}/rankings`, { 
        headers: authHeader() 
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

    async getMyProfile() {
        try {
            const response = await axios.get(`${API_BASE_URL}/profile`, { headers: authHeader() });
            return response.data; 
        } catch (error) {
            console.error("Erreur lors de la récupération du profil par token:", error.response?.data || error);
            throw error; // Laisse le composant gérer l'erreur
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
