<template>
  <nav class="navbar navbar-expand-lg cedii-bg-dark navbar-dark shadow-sm sticky-top">
    <div class="container-fluid">
      <router-link :to="{ name: 'ClientDashboard' }" class="navbar-brand d-flex align-items-center">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="navbar-logo me-2">
        <h5 class="cedii-text-primary mb-0">CEDII Espace Client</h5>
      </router-link>
      
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="{ name: 'ClientDashboard'}" class="nav-link" :class="{ active: $route.name === 'ClientDashboard' }">
              <i class="bi bi-house-door-fill me-1"></i> Mon Tableau de Bord
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'CatalogView' }" class="nav-link" :class="{ active: $route.name === 'CatalogView' }">
              <i class="bi bi-book-fill me-1"></i> Catalogue
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'ReservationForm' }" class="nav-link" :class="{ active: $route.name === 'ReservationForm' }">
              <i class="bi bi-calendar-plus me-1"></i> Réserver
            </router-link>
          </li>
          <li class="nav-item ms-3">
            <button @click="logout" class="btn btn-sm btn-danger">
              <i class="bi bi-box-arrow-right"></i> Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
// Assurez-vous d'importer AuthService ici si nécessaire
// import AuthService from '../services/AuthService';

const router = useRouter();


function logout() {
    // 1. Afficher la boîte de dialogue de confirmation native du navigateur.
    // confirm() retourne true si l'utilisateur clique sur "OK" ou "Oui", et false si "Annuler" ou "Non".
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

    // 2. Vérifier la réponse de l'utilisateur.
    if (isConfirmed) {
        console.log("Déconnexion confirmée. Exécution de la déconnexion...");
        
        // 3. Exécuter l'action de déconnexion
        AuthService.logout();
        
        // 4. Rediriger l'utilisateur vers la page de connexion
        router.push('/');
    } else {
        console.log("Déconnexion annulée.");
        // Optionnel : ne rien faire, l'utilisateur reste sur la page actuelle.
    }
}
</script>

<style scoped>
.cedii-bg-dark { background-color: var(--cedii-dark, #02061E) !important; }
.cedii-text-primary { color: var(--cedii-primary-light, #5B11EE) !important; }
.navbar-logo { 
    width: 35px; 
    height: 35px;
    border-radius: 50%; 
    border: 1px solid white; 
    object-fit: cover; 
}
.nav-link.active {
    font-weight: bold;
    color: var(--cedii-primary-light, #5B11EE) !important;
    border-bottom: 2px solid var(--cedii-primary-light, #5B11EE);
}
</style>