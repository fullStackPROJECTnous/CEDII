<template>
  <div class="register-wrapper d-flex justify-content-center align-items-center">
    <div class="card shadow-lg p-4 register-card">
      <div class="card-body">
        <h3 class="card-title text-center cedii-text-dark mb-4">
          Créer un Compte CEDII
        </h3>
        <p class="text-center text-muted mb-4">Inscription Utilisateur</p>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="loginUti" class="form-label">Identifiant (Login)</label>
            <input type="text" id="loginUti" v-model="formData.loginUti" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="motDePasseUti" class="form-label">Mot de passe</label>
            <input type="password" id="motDePasseUti" v-model="formData.motDePasseUti" class="form-control" required />
          </div>

          <div class="mb-4">
            <label for="roleUti" class="form-label">Rôle</label>
            <select id="roleUti" v-model="formData.roleUti" class="form-select" required>
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
              <option value="reception">Receptionniste</option>
              <option value="finance">Financiere</option>
              </select>
          </div>

          <div v-if="message" :class="['alert', isSuccess ? 'alert-success' : 'alert-danger', 'text-center']">{{ message }}</div>

          <button type="submit" class="btn cedii-btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? 'Enregistrement...' : 'Créer le Compte' }}
          </button>
        </form>
        
        <div class="text-center mt-3">
            <router-link to="/" class="cedii-text-action">Retour à la connexion</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/AuthService'; 

const router = useRouter();
const isLoading = ref(false);
const message = ref('');
const isSuccess = ref(false);

const formData = ref({
  loginUti: '',
  motDePasseUti: '',
  roleUti: 'client' // Rôle par défaut pour les auto-inscriptions
});

async function handleRegister() {
  message.value = '';
  isLoading.value = true;
  isSuccess.value = false;

  try {
    const response = await AuthService.register(formData.value);
    
    isSuccess.value = true;
    message.value = response.data.message || "Compte créé avec succès ! Vous pouvez maintenant vous connecter.";
    
    // Après 3 secondes, rediriger l'utilisateur vers la page de login
    setTimeout(() => {
        router.push('/');
    }, 3000);

  } catch (err) {
    const msg = err.response?.data?.message || "Erreur lors de l'inscription. Vérifiez les données.";
    isSuccess.value = false;
    message.value = msg;
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Les styles réutilisent ceux de Login.vue */
.register-wrapper {
  min-height: 100vh;
  background-color: var(--cedii-dark); /* #02061E */
}

.register-card {
  max-width: 450px;
  width: 100%;
  border-radius: 10px;
}

/* Couleurs CEDII pour le composant (assurez-vous qu'elles sont définies globalement ou dans un bloc non scoped si vous n'utilisez pas de variables CSS) */
.cedii-text-dark {
    color: var(--cedii-dark, #02061E);
}
.cedii-btn-primary {
    background-color: var(--cedii-primary-light, #5B11EE); 
    border-color: var(--cedii-primary-light, #5B11EE);
    color: white;
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark, #0405BF);
    border-color: var(--cedii-primary-dark, #0405BF);
}
.cedii-text-action {
    color: var(--cedii-action, #0671B6);
}
</style>