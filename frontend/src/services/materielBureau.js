import axios from 'axios';

const API_URL = '/api/materiel-bureau';

export default {
    // Récupérer tous les matériels
    getAllMateriels(filters = {}) {
        return axios.get(API_URL, { params: filters });
    },

    // Récupérer un matériel par son code
    getMaterielByCode(code) {
        return axios.get(`${API_URL}/${code}`);
    },

    // Créer un nouveau matériel
    createMateriel(materielData) {
        return axios.post(API_URL, materielData);
    },

    // Mettre à jour un matériel
    updateMateriel(code, materielData) {
        return axios.put(`${API_URL}/${code}`, materielData);
    },

    // Supprimer un matériel
    deleteMateriel(code) {
        return axios.delete(`${API_URL}/${code}`);
    },

    // Changer le statut d'un matériel
    updateStatut(code, nouveauStatut) {
        return axios.patch(`${API_URL}/${code}/statut`, { statut: nouveauStatut });
    },

    // Assigner à un utilisateur
    assignerUtilisateur(code, utilisateur) {
        return axios.patch(`${API_URL}/${code}/assignation`, { utilisateur });
    },

    // Statistiques
    getStatistiques() {
        return axios.get(`${API_URL}/statistiques`);
    }
};