// frontend/src/services/SalleService.js

/*import axios from 'axios';

// L'URL de base pour l'API des salles sur votre backend Express
// J'ai utilisé le port 5000 comme indiqué dans votre fichier server.js
const API_BASE_URL = 'http://localhost:5000/api/salle'; 

const SalleService = {
    
    // 1. CREATE (POST)
    async create(salleData) {
        try {
            // salleData doit contenir les champs
            const response = await axios.post(API_BASE_URL, salleData);
            return response.data; // Le salle nouvellement créé
        } catch (error) {
            console.error("Error creating salle:", error);
            throw error;
        }
    },
    
    // 2. READ ALL (GET)
    async getAll() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data; // La liste des salles
        } catch (error) {
            console.error("Error fetching salles:", error);
            throw error;
        }
    },

    // 3. READ ONE (GET by ID)
    async getById(idSalle) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${idSalle}`);
            return response.data; // Le salle spécifique
        } catch (error) {
            console.error(`Error fetching salle with id ${idSalle}:`, error);
            throw error;
        }
    },
    
    // 4. UPDATE (PUT)
    async update(idSalle, salleData) {
        try {
            // salleData contient les données mises à jour
            const response = await axios.put(`${API_BASE_URL}/${idSalle}`, salleData);
            return response.data; // Le message de succès du backend
        } catch (error) {
            console.error(`Error updating salle with id ${idSalle}:`, error);
            throw error;
        }
    },
    
    // 5. DELETE (DELETE)
    async delete(idSalle) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${idSalle}`);
            return response.data; // Le message de succès du backend
        } catch (error) {
            console.error(`Error deleting salle with id ${idSalle}:`, error);
            throw error;
        }
    }
};

export default SalleService;*/

import axios from 'axios';

// 🚨 Adaptez ce port si votre backend est sur un autre port que 5000
const API_URL = 'http://localhost:5000/api/salle'; 

class SalleService {
    
    // Récupérer toutes les salles (GET /api/salle)
    getAllSalles() {
        return axios.get(API_URL);
    }

    // Ajouter une nouvelle salle (POST /api/salle)
    createSalle(data) {
        return axios.post(API_URL, data);
    }

    // Mettre à jour une salle (PUT /api/salle/:idSalle)
    updateSalle(idSalle, data) {
        return axios.put(`${API_URL}/${idSalle}`, data);
    }

    // Supprimer une salle (DELETE /api/salle/:idSalle)
    deleteSalle(idSalle) {
        return axios.delete(`${API_URL}/${idSalle}`);
    }
}

export default new SalleService();