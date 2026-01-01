//Front/ src/ stores/authStore.js

// fichier: stores/authStore.js (Exemple basé sur Pinia)
import { defineStore } from 'pinia';
import AuthService from '../services/AuthService'; // Pour initialisation

// Utilisons 'user_data' dans le Local Storage pour être clair
const USER_KEY = 'user_data'; 

export const useAuthStore = defineStore('auth', {
  state: () => {
    // Tente de charger les données utilisateur au démarrage de l'application
    const user = AuthService.getCurrentUser() || null; 
    
    return {
      // L'état de l'utilisateur. Il est mis à jour par l'AuthService
      user: user, 
    };
  },
  
  getters: {
    // Vérifie l'authentification
    isAuthenticated: (state) => !!state.user && !!state.user.accessToken,
    // Expose les données client pour le composant compteClient.vue
    clientData: (state) => state.user, 
  },
  
  actions: {
    // 🚨 ASSUREZ-VOUS QUE LE STORE A UNE PROPRIÉTÉ POUR STOCKER LES DONNÉES DU CLIENT/UTILISATEUR
    // (Ex: state: { userData: {} })
    
    setUserData(data) {
        // Met à jour l'état du store (utilisez la bonne propriété, ex: this.userData)
        this.userData = data; 
        
        // Met à jour le Local Storage
        // Utiliser la clé 'user' si c'est la clé définie par USER_KEY ou si vous avez deux clés distinctes
        localStorage.setItem(USER_KEY, JSON.stringify(data));
    },
      
    logout() {
        // 🚨 CRITIQUE: Nettoyage complet de l'état du Store
        this.userData = null; // OU this.userData = {} si vous l'initialisez comme objet
        this.token = null;   // Assurez-vous d'avoir une propriété token et de la nettoyer

        // 🚨 CRITIQUE: Nettoyage du Local Storage
        // Nettoyez UNIQUEMENT la clé que vous utilisez (ici, USER_KEY)
        localStorage.removeItem(USER_KEY); 
        // Laissez cette ligne si vous avez VRAIMENT deux clés différentes (ou si USER_KEY est 'user')
        localStorage.removeItem('user'); 

        // Si l'utilisateur est redirigé vers la page de connexion, faites-le ici
        // router.push('/login'); 
    }
}
});



/*
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import AuthService from '../services/AuthService';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token'));
  const clientInfo = ref(JSON.parse(localStorage.getItem('clientInfo') || 'null'));

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.roleUti?.toLowerCase() || null);
  const userName = computed(() => {
    if (clientInfo.value) {
      return `${clientInfo.value.prenomCli || ''} ${clientInfo.value.nomCli || ''}`.trim();
    }
    return user.value?.loginUti || '';
  });

  // Actions
  const setUser = (userData) => {
    user.value = userData;
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const setToken = (newToken) => {
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const setClientInfo = (info) => {
    clientInfo.value = info;
    if (info) {
      localStorage.setItem('clientInfo', JSON.stringify(info));
    } else {
      localStorage.removeItem('clientInfo');
    }
  };

  const login = async (loginUti, motDePasseUti) => {
    const response = await AuthService.login(loginUti, motDePasseUti);
    
    setUser(response);
    setToken(response.accessToken);
    
    if (response.clientInfo) {
      setClientInfo(response.clientInfo);
    }
    
    return response;
  };

  const register = async (userData) => {
    const response = await AuthService.register(userData);
    
    // Si l'inscription inclut une connexion automatique
    if (response.accessToken) {
      setUser(response);
      setToken(response.accessToken);
      
      if (response.clientInfo) {
        setClientInfo(response.clientInfo);
      }
    }
    
    return response;
  };

  const registerClient = async (clientData) => {
    // Forcer le rôle client pour les inscriptions par la réception
    const data = { ...clientData, roleUti: 'client' };
    return await register(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setClientInfo(null);
    
    // Nettoyage complet
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('clientInfo');
    localStorage.removeItem('userInfo');
  };

  const syncClientProfile = async () => {
    try {
      const clientData = await AuthService.syncClientProfile();
      setClientInfo(clientData);
      return clientData;
    } catch (error) {
      console.error('Erreur synchronisation:', error);
      throw error;
    }
  };

  const ensureClientData = async () => {
    if (!clientInfo.value || !clientInfo.value.nomCli) {
      return await syncClientProfile();
    }
    return clientInfo.value;
  };

  const hasPermission = (requiredRole) => {
    if (!userRole.value) return false;
    
    const roleHierarchy = {
      'admin': ['admin', 'reception', 'finance', 'client'],
      'reception': ['reception', 'client'],
      'finance': ['finance', 'client'],
      'client': ['client']
    };
    
    return roleHierarchy[userRole.value]?.includes(requiredRole) || false;
  };

  return {
    // State
    user,
    token,
    clientInfo,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    
    // Actions
    setUser,
    setToken,
    setClientInfo,
    login,
    register,
    registerClient,
    logout,
    syncClientProfile,
    ensureClientData,
    hasPermission
  };
});
*/