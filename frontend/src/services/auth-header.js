// frontend/src/services/auth-header.js

// Fonction pour récupérer le token JWT et le formater pour l'en-tête Authorization
/*export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        // Retourne l'en-tête : { Authorization: 'Bearer <token>' }
        return { 
            Authorization: 'Bearer ' + user.accessToken 
        };
    } else {
        return {};
    }
}*/

// services/authHeader.js (Exemple)

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    // Si le token existe, on le renvoie dans l'en-tête
    return { 'x-access-token': user.accessToken }; 
    // OU { Authorization: 'Bearer ' + user.accessToken }; 
    // selon la manière dont votre backend l'attend.
  } else {
    return {};
  }
}