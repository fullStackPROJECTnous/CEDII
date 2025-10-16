/*import axios from 'axios'; 
// services/UserService.js
const API_BASE_URL = 'http://localhost:5000/api/users'; // Votre instance Axios configurée pour l'API

import authHeader from './auth-header';


class UserService {
    // Crée un nouvel utilisateur
    create() {
        //return api.post('/users', userData);
        return axios.post(`${API_BASE_URL}/users`);
    }

    // Récupère tous les utilisateurs
   findAll() {
    // 🚨 Le token doit être passé dans le deuxième argument (config)
    return axios.get(`${API_BASE_URL}/users`, { headers: authHeader() }); 
}

    // Met à jour un utilisateur
    update(id, ) {
        return api.put(`${API_BASE_URL}/users/${id}`, { headers: authHeader() });
    }

    // Supprime un utilisateur
    delete(id) {
        return api.delete(`${API_BASE_URL}/users/${id}`);
    }
}

export default new UserService();*/

import axios from 'axios';
import authHeader from './auth-header'; 

// 🚨 La base est l'URL du serveur Express/Node.js
const API_BASE_URL = 'http://localhost:5000/api'; 
const USER_ROUTE = '/users'; // Route principale définie dans votre routeur

class ServiceUser {

    /**
     * Récupère tous les utilisateurs depuis l'API.
     * Cette route nécessite une autorisation (JWT) et probablement le rôle 'admin'.
     */
    getAllUsers() {
        // La requête complète sera : http://localhost:5000/api/users
        return axios.get(API_BASE_URL + USER_ROUTE, { 
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
    deleteUser(id) {
        return axios.delete(`${API_BASE_URL}${USER_ROUTE}/${id}`, { 
            headers: authHeader() 
        });
    }
    
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
    }
}

export default new ServiceUser();
