
// frontend/src/services/AuthService.js

import axios from 'axios';

// 🚨 Assurez-vous que ce port (5000) correspond à votre serveur Express
const API_BASE_URL = 'http://localhost:5000/api/auth'; 

export function getCurrentUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.roleUli : null;
}


const AuthService = {
    /**
     * Tente de connecter l'utilisateur et stocke le token JWT.
    */
    async login(loginUti, motDePasseUti) {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { 
                loginUti: loginUti,
                motDePasseUti: motDePasseUti
            });
            
            // Stocke les données utilisateur (y compris le token) dans le Local Storage
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data; // Contient le token et les infos utilisateur
        } catch (error) {
            console.error("Erreur d'authentification:", error.response?.data || error);
            // Propage l'erreur au composant pour afficher le message spécifique du backend
            throw error; 
        }
    },
    // 🚨 NOUVELLE MÉTHODE POUR L'INSCRIPTION
   async register(user) {
        // Cela devient: http://localhost:5000/api/auth/register
        return axios.post(`${API_BASE_URL}/register`, user); 
    },

    /**
     * Supprime le token et les données utilisateur du Local Storage.
    */
    logout() {
        localStorage.removeItem('user');
    },

    /**
     * Récupère les données utilisateur (y compris le token) si l'utilisateur est connecté.
     */
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;
/*
import axios from 'axios';

// 🚨 Adaptez ce port si votre backend est sur un autre port
const API_URL = 'http://localhost:5000/api/auth/'; 

class AuthService {
    
    // Fonction utilisée par Register.vue
    register(user) {
        // Envoie les données de l'utilisateur à la route d'inscription du backend
        return axios.post(API_URL + 'register', user);
    }

    // Ajoutez ici la fonction de connexion (login) si elle n'existe pas encore
    // login(user) {
    //     return axios.post(API_URL + 'login', user);
    // }

    // ... autres fonctions d'authentification
}

export default new AuthService();*/