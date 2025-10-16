<template>
  <div class="sidebar d-flex flex-column p-3 shadow-sm cedii-bg-sidebar">
    <h6 class="text-uppercase fw-bold mb-3 cedii-text-dark">Navigation</h6>
    
    <nav class="nav flex-column">
      
      <router-link to="/home" class="nav-link cedii-link-style">
        <i class="bi bi-house-door me-2"></i> Accueil
      </router-link>

      <template v-if="hasRole('administrateur')">
        <hr class="my-2">
        <h6 class="text-uppercase fw-bold mb-2 cedii-text-dark">Admin</h6>
        
        <router-link :to="{ name: 'DashboardAdmin' }" class="nav-link cedii-link-style">
          <i class="bi bi-grid-fill me-2"></i> Tableau de bord
        </router-link>
        
        <router-link :to="{ name: 'ClientManagement' }" class="nav-link cedii-link-style">
          <i class="bi bi-people-fill me-2"></i> Gestion Clients
        </router-link>
        
        <router-link to="/admin/utilisateurs" class="nav-link cedii-link-style">
          <i class="bi bi-person-gear me-2"></i> Gestion Utilisateurs
        </router-link>
      </template>

      <template v-if="hasRole('client')">
        <hr class="my-2">
        <h6 class="text-uppercase fw-bold mb-2 cedii-text-dark">Espace Client</h6>
        
        <router-link :to="{ name: 'ClientDashboard' }" class="nav-link cedii-link-style">
          <i class="bi bi-briefcase-fill me-2"></i> Mes Projets
        </router-link>
        
        <router-link to="/client/profil" class="nav-link cedii-link-style">
          <i class="bi bi-person me-2"></i> Mon Profil
        </router-link>
      </template>
      
    </nav>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userRole = ref('');

onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
        userRole.value = user.role;
    }
});

const hasRole = (role) => {
    return userRole.value === role;
};
</script>

<style scoped>
.sidebar {
  width: 250px; /* Largeur fixe de la barre latérale */
  background-color: var(--cedii-light);
  min-height: calc(100vh - 56px); /* 100vh moins la hauteur de la navbar */
}

.cedii-bg-sidebar {
    background-color: var(--cedii-light);
}

.cedii-text-dark {
    color: var(--cedii-dark);
}

.cedii-link-style {
  color: var(--cedii-text-secondary); /* Couleur par défaut */
  padding: 8px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.cedii-link-style:hover {
  background-color: rgba(91, 17, 238, 0.1); /* Ligne légère */
  color: var(--cedii-primary-dark);
}

/* Style de la route active */
.cedii-link-style.router-link-active {
  background-color: var(--cedii-primary-light);
  color: white !important;
  font-weight: bold;
}
</style>