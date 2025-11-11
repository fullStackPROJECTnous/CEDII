<template>
  <nav class="navbar navbar-expand-lg cedii-navbar navbar-dark shadow-sm sticky-top">
    <div class="container-fluid">
      <router-link :to="{ name: 'ClientDashboard' }" class="navbar-brand d-flex align-items-center">
        <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="navbar-logo me-2">
        <h5 class="navbar-brand-text mb-0">CEDII Espace Client</h5>
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
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
            <button @click="logout" class="btn btn-sm btn-outline-danger logout-btn">
              <i class="bi bi-box-arrow-right me-1"></i> Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService';

const router = useRouter();

function logout() {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

    if (isConfirmed) {
        console.log("Déconnexion confirmée. Exécution de la déconnexion...");
        AuthService.logout();
        router.push('/');
    } else {
        console.log("Déconnexion annulée.");
    }
}
</script>

<style scoped>
.cedii-navbar { 
    background-color: #02061E !important; 
}

.navbar-brand-text { 
    color: white !important; 
}

.navbar-logo { 
    width: 35px; 
    height: 35px;
    border-radius: 50%; 
    border: 1px solid white; 
    object-fit: cover; 
}

/* Styles pour tous les liens de navigation */
.nav-link {
    color: white !important;
    padding: 0.5rem 1rem !important;
    margin: 0 0.25rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.1);
}

/* Style pour les liens actifs - texte blanc avec soulignage bleu marine */
.nav-link.active {
    color: white !important;
    background-color: transparent;
    font-weight: 600;
    border-bottom: 2px solid #04058F;
    border-radius: 0;
}

/* Supprimer le soulignage par défaut de Bootstrap */
.nav-link.active::after {
    display: none;
}

/* Style pour le bouton de déconnexion */
.logout-btn {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
    background-color: transparent;
}

.logout-btn:hover {
    background-color: #dc3545 !important;
    color: white !important;
}

/* Styles pour le toggleur en mode mobile */
.navbar-toggler {
    border-color: rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.navbar-toggler:focus {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
}

/* Responsive */
@media (max-width: 991.98px) {
    .navbar-nav {
        text-align: center;
        margin-top: 1rem;
    }
    
    .nav-item {
        margin: 0.25rem 0;
    }
    
    .nav-link {
        padding: 0.75rem !important;
        margin: 0;
    }
    
    .ms-3 {
        margin-left: 0 !important;
        margin-top: 1rem;
    }
    
    .logout-btn {
        width: 100%;
        margin-top: 0.5rem;
    }
}
</style>