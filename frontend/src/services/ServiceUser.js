

import axios from 'axios';
import authHeader from './auth-header'; 

// 🚨 La base est l'URL du serveur Express/Node.js
const API_BASE_URL = 'http://localhost:5000/api'; 
//const USER_ROUTE = '/users'; // Route principale définie dans votre routeur

class ServiceUser {

    /**
     * Récupère tous les utilisateurs depuis l'API.
     * Cette route nécessite une autorisation (JWT) et probablement le rôle 'admin'.
     */
   /* getAllUsers() {
        // La requête complète sera : http://localhost:5000/api/users
        return axios.get(API_BASE_URL + USER_ROUTE, { 
            headers: authHeader() 
        });
    }

     getLastActivity(userId) {
        return axios.get(`${API_BASE_URL}${USER_ROUTE}/${userId}/last-activity`, { 
            headers: authHeader() 
        });
    }

      updateUser(id, userData) {
        // La requête complète sera : PUT http://localhost:5000/api/users/:id
        return axios.put(`${API_BASE_URL}${USER_ROUTE}/${id}`, userData, {
            headers: authHeader() 
        });
    }

    /**
     * Supprime un utilisateur.
     */
  /*  deleteUser(id) {
        return axios.delete(`${API_BASE_URL}${USER_ROUTE}/${id}`, { 
            headers: authHeader() 
        });
    }

      getUserHistory(userId) {
        return axios.get(`${API_BASE_URL}${USER_ROUTE}/${userId}/history`, { 
            headers: authHeader() 
        });
    }
 

    // Dans ServiceUser.js
 
    // Ajoutez ici les méthodes createUser et updateUser si ce n'est pas déjà fait

    // Exemple de création/mise à jour
    saveUser(userData) {
        if (userData.idUti) {
            // Mise à jour (PUT/PATCH)
            return axios.put(`${API_BASE_URL}${USER_ROUTE}/${userData.idUti}`, userData, { headers: authHeader() });
        } else {
            // Création (POST)
            return axios.post(API_BASE_URL + USER_ROUTE, userData, { headers: authHeader() });
        }
    }*/

        // ServiceUser.js - CORRIGÉ


    getAllUsers() {
        return axios.get(`${API_BASE_URL}/users`, { 
            headers: authHeader() 
        });
    }

    // 🟢 CORRECTION : Utiliser la route qui fonctionne
    getLastActivity(userId) {
        return axios.get(`${API_BASE_URL}/${userId}/last-activity`, { 
            headers: authHeader() 
        });
    }

    getUserHistory(userId) {
        return axios.get(`${API_BASE_URL}/${userId}/history`, { 
            headers: authHeader() 
        });
    }

    updateUser(id, userData) {
        return axios.put(`${API_BASE_URL}/users/${id}`, userData, {
            headers: authHeader() 
        });
    }

    deleteUser(id) {
        return axios.delete(`${API_BASE_URL}/users/${id}`, { 
            headers: authHeader() 
        });
    }

    saveUser(userData) {
        if (userData.idUti) {
            return axios.put(`${API_BASE_URL}/users/${userData.idUti}`, userData, { 
                headers: authHeader() 
            });
        } else {
            return axios.post(`${API_BASE_URL}/users`, userData, { 
                headers: authHeader() 
            });
        }
    }
         // 🚨 AJOUT : Fonction pour récupérer la liste des utilisateurs clients
    getAllClientUsers() {
        return axios.get(`${API_BASE_URL}/users/clients/list`, { 
            headers: authHeader() 
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Erreur de chargement des utilisateurs clients:", error.response || error);
                return []; 
            });
    }
}




export default new ServiceUser();
