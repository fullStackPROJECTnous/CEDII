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
};

export default new MaterielService();