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
}
  export default new UserServices();


  // 🚨 NOUVELLE MÉTHODE POUR L'INSCRIPTION
  /*async register(data) {
    return axios.post(API_URL + 'register', data);
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new UserServices();
*/