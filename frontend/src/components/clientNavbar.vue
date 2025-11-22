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
            <button @click="logout" class="btn btn-sm custom-btn-danger logout-btn">
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
    background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important; 
}

.navbar-brand-text { 
    color: white !important; 
    font-weight: 600;
}

.navbar-logo { 
    width: 35px; 
    height: 35px;
    border-radius: 50%; 
    border: 2px solid rgba(255, 255, 255, 0.3); 
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
    font-weight: 500;
}

.nav-link:hover {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
}

/* Style pour les liens actifs - texte blanc avec soulignage bleu */
.nav-link.active {
    color: white !important;
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: 600;
    border-bottom: 2px solid #007bff;
    border-radius: 4px 4px 0 0;
}

/* Supprimer le soulignage par défaut de Bootstrap */
.nav-link.active::after {
    display: none;
}

/* Style pour le bouton de déconnexion */
.custom-btn-danger {
    background: #5E5E5E !important;
    border-color: #5E5E5E !important;
    color: white !important;
}

.custom-btn-danger:hover {
    background: #4a4a4a !important;
    border-color: #4a4a4a !important;
    color: white !important;
    transform: translateY(-1px);
}

/* Styles pour le toggleur en mode mobile */
.navbar-toggler {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.navbar-toggler:focus {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}

/* Effets de transition pour tous les éléments interactifs */
.nav-link,
.custom-btn-danger,
.navbar-toggler {
    transition: all 0.3s ease;
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
    
    .custom-btn-danger {
        width: 100%;
        margin-top: 0.5rem;
    }
    
    .nav-link.active {
        border-radius: 4px;
        border-bottom: 2px solid #007bff;
    }
}

/* Amélioration du contraste et accessibilité */
.navbar-brand:focus,
.nav-link:focus,
.custom-btn-danger:focus,
.navbar-toggler:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Animation subtile au survol */
@keyframes subtleBounce {
    0% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
    100% { transform: translateY(0); }
}

.nav-link:hover,
.custom-btn-danger:hover {
    animation: subtleBounce 0.3s ease;
}

/* Support pour les préférences de réduction des animations */
@media (prefers-reduced-motion: reduce) {
    .nav-link,
    .custom-btn-danger,
    .navbar-toggler {
        transition: none;
    }
    
    .nav-link:hover,
    .custom-btn-danger:hover {
        animation: none;
        transform: none;
    }
}
</style>