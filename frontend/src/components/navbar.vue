<template>
  <nav class="navbar navbar-expand-lg cedii-bg-primary shadow-sm sticky-top">
    <div class="container-fluid">
      
      <router-link to="/" class="navbar-brand text-white fw-bold">
        <i class="bi bi-bank me-2"></i> 
        CEDII | Gestion Patrimoniale
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          
          <li class="nav-item d-flex align-items-center me-3">
            <span class="text-white me-2">
              <i class="bi bi-person-circle me-1"></i> 
              Bonjour, {{ currentUser.loginUti || 'Utilisateur' }}
            </span>
            <span class="badge bg-light text-primary">{{ currentUser.role || 'Inconnu' }}</span>
          </li>
          
          <li class="nav-item">
            <button class="btn btn-outline-light" @click="logOut">
              <i class="bi bi-box-arrow-right me-1"></i> 
              Déconnexion
            </button>
          </li>
          
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentUser = ref({});

// 🚨 Récupération des infos utilisateur stockées dans le localStorage
onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        currentUser.value = user;
    }
});

const logOut = () => {
    // 1. Supprime le token et l'utilisateur du localStorage
    localStorage.removeItem('user');
    
    // 2. Redirige vers la page de connexion
    router.push('/');
};
</script>

<style scoped>
.cedii-bg-primary {
  background-color: var(--cedii-primary-light) !important;
}

.navbar-brand {
    font-size: 1.25rem;
}
.btn-outline-light:hover {
    background-color: var(--cedii-primary-dark) !important;
    border-color: var(--cedii-primary-dark) !important;
}
</style>