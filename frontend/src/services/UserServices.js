// frontend/src/services/UserServices.js

import axios from 'axios';

// 💡 L'URL de base est maintenant /api/auth
const API_URL = 'http://localhost:5000/api/auth'; 

class UserServices {
  async login(loginUti, motDePasseUti) {
    const response = await axios
      // 💡 Appel à API_URL/login
      .post(API_URL + '/login', { // Notez le '/' si vous l'avez omis dans API_URL
        loginUti,
        motDePasseUti
      });
    
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  // 🚨 AJOUT : Fonction pour récupérer la liste des utilisateurs clients
    getAllClientUsers() {
        // La requête complète sera : http://localhost:5000/api/users/clients/list
        return axios.get(API_USER_DATA_URL + '/clients/list') 
            .then(response => {
                return response.data;
            })
            .catch(error => {
                // IMPORTANT : Log l'erreur pour le débogage et renvoie un tableau vide
                console.error("Erreur de chargement des utilisateurs clients:", error.response || error);
                return []; 
            });
    }
}
export default new UserServices();



         