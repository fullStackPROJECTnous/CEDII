import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patrimoine';

class MaterielService {

    // ------------------------------------
    // READ ALL / READ ONE (via le code)
    // ------------------------------------
    async getAllMateriel() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des matériels:", error);
            throw error;
        }
    }

    async getAllMateriels() {
        try {
            const response = await axios.get(`${API_URL}/all`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de tous les matériels:", error);
            throw error;
        }
    }

    async getMaterielByCode(codeMat) {
        try {
            const encodedCode = encodeURIComponent(codeMat);
            const response = await axios.get(`${API_URL}/${encodedCode}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération du matériel Code=${codeMat}:`, error);
            throw error;
        }
    }
    
    // ------------------------------------
    // CREATE (L'objet est envoyé tel quel, le Backend génère le codeMat)
    // ------------------------------------
    async createMateriel(materielData) {
        try {
            const response = await axios.post(API_URL, materielData);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création du matériel:", error);
            throw error;
        }
    }

    // ------------------------------------
    // UPDATE (Utilise le codeMat pour l'URL)
    // ------------------------------------
    async updateMateriel(codeMat, materielData) {
        if (!codeMat) throw new Error("Le codeMat est manquant pour la mise à jour.");

        const encodedCode = encodeURIComponent(codeMat); 

        try {
            const response = await axios.put(`${API_URL}/${encodedCode}`, materielData);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du matériel Code=${codeMat}:`, error);
            throw error;
        }
    }

    // ------------------------------------
    // DELETE (Utilise le codeMat pour l'URL)
    // ------------------------------------
    async deleteMateriel(materielCode) {
        const encodedCode = encodeURIComponent(materielCode); 

        try {
            const response = await axios.delete(`${API_URL}/${encodedCode}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la suppression du matériel Code=${materielCode}:`, error);
            throw error;
        }
    }

    // ------------------------------------
    // FONCTIONNALITÉS AVANCÉES
    // ------------------------------------

    // Récupérer l'historique d'emprunt
    async getHistoriqueEmprunt(codeMat) {
        const encodedCode = encodeURIComponent(codeMat);
        try {
            const response = await axios.get(`${API_URL}/${encodedCode}/historique`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'historique Code=${codeMat}:`, error);
            throw error;
        }
    }

    // Mettre à jour l'état d'un matériel
    async updateEtatMateriel(codeMat, etatData) {
        const encodedCode = encodeURIComponent(codeMat);
        try {
            const response = await axios.put(`${API_URL}/${encodedCode}/etat`, etatData);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'état Code=${codeMat}:`, error);
            throw error;
        }
    }

    // Calculer les frais de retard
    async calculerFraisRetard(calculData) {
        try {
            const response = await axios.post(`${API_URL}/calculer-retard`, calculData);
            return response.data;
        } catch (error) {
            console.error("Erreur lors du calcul des frais de retard:", error);
            throw error;
        }
    }

    // ------------------------------------
// UPDATE STOCK (Version avancée avec options)
// ------------------------------------
async updateMaterielStock(codeMat, stockData, options = {}) {
    if (!codeMat) throw new Error("Le codeMat est manquant pour la mise à jour du stock.");
    if (!stockData) throw new Error("Les données de stock sont manquantes.");

    const encodedCode = encodeURIComponent(codeMat); 
    
    // Options par défaut
    const defaultOptions = {
        validateStock: true, // Valider que le stock ne devient pas négatif
        logChanges: true,    // Journaliser les changements
        returnUpdated: true  // Retourner l'objet mis à jour
    };
    
    const finalOptions = { ...defaultOptions, ...options };

    try {
        // Préparer les données avec les options
        const requestData = {
            ...stockData,
            _options: finalOptions
        };

        console.log(`📤 Mise à jour stock pour ${codeMat}:`, requestData);
        
        const response = await axios.put(`${API_URL}/${encodedCode}/stock`, requestData);
        
        if (finalOptions.logChanges) {
            console.log(`✅ Stock mis à jour pour ${codeMat}:`, response.data);
        }
        
        return response.data;
        
    } catch (error) {
        console.error(`❌ Erreur mise à jour stock Code=${codeMat}:`, error);
        
        // Erreurs spécifiques
        if (error.response?.status === 400) {
            throw new Error(`Données invalides: ${error.response.data.message}`);
        } else if (error.response?.status === 404) {
            throw new Error(`Matériel non trouvé avec le code: ${codeMat}`);
        } else if (error.response?.status === 409) {
            throw new Error(`Stock insuffisant pour ${codeMat}`);
        } else if (error.response) {
            throw new Error(`Erreur serveur: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error("Erreur réseau. Impossible de contacter le serveur.");
        } else {
            throw error;
        }
    }
}

// ------------------------------------
// BATCH STOCK UPDATE (Mise à jour multiple)
// ------------------------------------
async updateMultipleStocks(stockUpdates) {
    if (!Array.isArray(stockUpdates) || stockUpdates.length === 0) {
        throw new Error("Aucune mise à jour de stock à traiter.");
    }

    try {
        const response = await axios.put(`${API_URL}/batch/stock`, { updates: stockUpdates });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour multiple des stocks:", error);
        throw error;
    }
}

// ------------------------------------
// GET STOCK HISTORY (Historique des stocks)
// ------------------------------------
async getStockHistory(codeMat, options = {}) {
    const encodedCode = encodeURIComponent(codeMat);
    const params = new URLSearchParams();
    
    if (options.startDate) params.append('start', options.startDate);
    if (options.endDate) params.append('end', options.endDate);
    if (options.limit) params.append('limit', options.limit);

    try {
        const url = `${API_URL}/${encodedCode}/stock-history${params.toString() ? '?' + params.toString() : ''}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'historique du stock Code=${codeMat}:`, error);
        throw error;
    }
}
};

export default new MaterielService();