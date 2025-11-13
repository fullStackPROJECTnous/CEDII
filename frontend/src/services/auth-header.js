

// services/authHeader.js (Exemple)
/*
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
}*/


export default function authHeader() {
  // Récupère l'utilisateur stocké localement, qui doit contenir le token JWT
  const user = JSON.parse(localStorage.getItem('user'));

  // 🚨 CORRECTION CRITIQUE : Vérifiez la clé 'accessToken' 🚨
  if (user && user.accessToken) { 
    // Si le token existe, retourne l'en-tête nécessaire
    return { Authorization: 'Bearer ' + user.accessToken }; 
  } else {
    // Sinon, retourne un objet vide ou un en-tête pour un accès public
    console.log("Aucun jeton trouvé. Envoi d'un en-tête vide.");
    return {};
  }
}
