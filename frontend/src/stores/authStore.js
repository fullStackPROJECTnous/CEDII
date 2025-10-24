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

