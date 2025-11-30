// frontend/src/services/AuthService.js

import axios from 'axios';

// 🚨 Assurez-vous que ce port (5000) correspond à votre serveur Express
const API_BASE_URL = 'http://localhost:5000/api/auth'; 

export function getCurrentUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.roleUti : null;
}

const AuthService = {
    /**
     * Tente de connecter l'utilisateur et stocke le token JWT.
    */
    async login(loginUti, motDePasseUti) {
        try {
            console.log('🔐 Tentative de connexion...');
            
            const response = await axios.post(`${API_BASE_URL}/login`, { 
                loginUti: loginUti,
                motDePasseUti: motDePasseUti
            });
            
            console.log('✅ Réponse login:', response.data);
            
            // Stocke les données utilisateur (y compris le token) dans le Local Storage
            if (response.data.accessToken) {
                // Stocker les informations utilisateur de base
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.accessToken);
                
                // 🆕 STOCKER LES INFORMATIONS CLIENT SI DISPONIBLES
                if (response.data.clientInfo) {
                    localStorage.setItem('clientInfo', JSON.stringify(response.data.clientInfo));
                    console.log('💾 Informations client stockées:', response.data.clientInfo);
                }
                
                // 🆕 STOCKER LES INFORMATIONS UTILISATEUR POUR COMPATIBILITÉ
                localStorage.setItem('userInfo', JSON.stringify({
                    idUti: response.data.idUti,
                    loginUti: response.data.loginUti,
                    roleUti: response.data.roleUti,
                    nom: response.data.nom || response.data.clientInfo?.nomCli,
                    prenom: response.data.prenom || response.data.clientInfo?.prenomCli,
                    email: response.data.email || response.data.clientInfo?.emailCli,
                    telephone: response.data.telephone || response.data.clientInfo?.telephoneCli,
                    addresse: response.data.addresse || response.data.clientInfo?.addresseCli
                }));
                
                console.log('💾 Toutes les informations stockées dans localStorage');
            }
            
            return response.data; // Contient le token et les infos utilisateur
        } catch (error) {
            console.error("❌ Erreur d'authentification:", error.response?.data || error);
            // Propage l'erreur au composant pour afficher le message spécifique du backend
            throw error; 
        }
    },

    // 🚨 NOUVELLE MÉTHODE POUR L'INSCRIPTION
    async register(user) {
        try {
            console.log('📝 Tentative d\'inscription...');
            
            const response = await axios.post(`${API_BASE_URL}/register`, user);
            
            console.log('✅ Inscription réussie:', response.data);
            
            // Si l'inscription inclut une connexion automatique, stocker les infos
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.accessToken);
                
                if (response.data.clientInfo) {
                    localStorage.setItem('clientInfo', JSON.stringify(response.data.clientInfo));
                }
            }
            
            return response.data;
        } catch (error) {
            console.error("❌ Erreur d'inscription:", error.response?.data || error);
            throw error;
        }
    },

    /**
     * Supprime le token et les données utilisateur du Local Storage.
    */
    logout() {
        console.log('🚪 Déconnexion...');
        
        // Supprimer toutes les données d'authentification
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('clientInfo');
        localStorage.removeItem('userInfo');
        
        console.log('✅ Toutes les données supprimées');
    },

    /**
     * Récupère les données utilisateur (y compris le token) si l'utilisateur est connecté.
     */
    getCurrentUser() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        console.log('👤 Utilisateur actuel:', user);
        return user;
    },

    /**
     * 🆕 Vérifie si l'utilisateur est authentifié
     */
    isAuthenticated() {
        const token = localStorage.getItem('token');
        const user = this.getCurrentUser();
        return !!(token && user);
    },

    /**
     * 🆕 Récupère le token JWT
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * 🆕 Récupère les informations client complètes
     */
    getClientInfo() {
        try {
            const clientInfo = JSON.parse(localStorage.getItem('clientInfo') || 'null');
            console.log('👤 Informations client:', clientInfo);
            return clientInfo;
        } catch (error) {
            console.error('❌ Erreur récupération clientInfo:', error);
            return null;
        }
    },

    /**
     * 🆕 Récupère les informations utilisateur pour compatibilité
     */
    getUserInfo() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
            console.log('👤 Informations utilisateur:', userInfo);
            return userInfo;
        } catch (error) {
            console.error('❌ Erreur récupération userInfo:', error);
            return null;
        }
    },

    /**
     * 🆕 Synchronise les informations client après la connexion
     */
    async syncClientProfile() {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error('Utilisateur non authentifié');
            }

            console.log('🔄 Synchronisation du profil client...');
            
            // Appeler l'API pour récupérer les informations client complètes
            const response = await axios.get('http://localhost:5000/api/clients/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && response.data.data) {
                const clientData = response.data.data;
                
                // Stocker les informations mises à jour
                localStorage.setItem('clientInfo', JSON.stringify(clientData));
                
                // Mettre à jour userInfo pour compatibilité
                localStorage.setItem('userInfo', JSON.stringify({
                    idUti: clientData.idUti,
                    loginUti: clientData.emailCli || clientData.loginUti,
                    roleUti: 'client',
                    nom: clientData.nomCli,
                    prenom: clientData.prenomCli,
                    email: clientData.emailCli,
                    telephone: clientData.telephoneCli,
                    addresse: clientData.addresseCli,
                    // Ajouter les clés spécifiques client pour compatibilité
                    nomCli: clientData.nomCli,
                    prenomCli: clientData.prenomCli,
                    emailCli: clientData.emailCli,
                    telephoneCli: clientData.telephoneCli,
                    addresseCli: clientData.addresseCli
                }));

                console.log('✅ Profil client synchronisé:', clientData);
                return clientData;
            }
            
            throw new Error('Données de profil invalides');
        } catch (error) {
            console.error('❌ Erreur synchronisation profil client:', error);
            throw error;
        }
    },

    /**
     * 🆕 Vérifie et complète les informations manquantes
     */
    async ensureClientData() {
        try {
            let clientInfo = this.getClientInfo();
            
            // Si les informations client sont incomplètes, synchroniser
            if (!clientInfo || !clientInfo.nomCli || !clientInfo.emailCli || !clientInfo.telephoneCli) {
                console.log('🔄 Informations client incomplètes, synchronisation...');
                clientInfo = await this.syncClientProfile();
            }
            
            return clientInfo;
        } catch (error) {
            console.error('❌ Impossible de garantir les données client:', error);
            return null;
        }
    }
};

export default AuthService;