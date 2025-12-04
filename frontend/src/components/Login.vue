<template>
  <div class="login-wrapper d-flex justify-content-center align-items-center">
    <div class="card shadow-lg p-4 login-card">
      <div class="card-body">
        <div class="text-center mb-4">
          <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="login-logo">
          <h3 class="card-title cedii-text-dark mt-3 mb-2">
            CEDII Patrimoine Plus
          </h3>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="mb-4 row align-items-center">
            <label for="loginUti" class="col-sm-4 col-form-label cedii-text-dark fw-medium">
              Nom d'utilisateur
            </label>
            <div class="col-sm-8">
              <n-input
                v-model:value="credentials.loginUti"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                size="large"
                :input-props="{ class: 'cedii-input' }"
                required
              >
                <template #prefix>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                  </n-icon>
                </template>
              </n-input>
            </div>
          </div>

          <div class="mb-4 row align-items-center">
            <label for="motDePasseUti" class="col-sm-4 col-form-label cedii-text-dark fw-medium">
              Mot de Passe
            </label>
            <div class="col-sm-8">
              <div class="position-relative">
                <n-input
                  v-model:value="credentials.motDePasseUti"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Entrez votre mot de passe"
                  size="large"
                  :input-props="{ class: 'cedii-input pe-5' }"
                  required
                >
                  <template #prefix>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>
                      </svg>
                    </n-icon>
                  </template>
                </n-input>
                <!-- Bouton Show Password CORRIGÉ -->
                <button
                  type="button"
                  class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                  @click="togglePasswordVisibility"
                  style="z-index: 10; padding: 0; background: none; border: none;"
                >
                  <n-icon size="20" :color="showPassword ? '#5b11ee' : '#6c757d'">
                    <!-- INVERSEZ CES DEUX ICÔNES -->
                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                  </n-icon>
                </button>
              </div>
            </div>
          </div>

          <div v-if="error" class="alert alert-danger text-center mb-3">
            {{ error }}
          </div>

          <n-button
            attr-type="submit"
            type="primary"
            size="large"
            :loading="loading"
            class="w-100 cedii-btn-primary"
          >
            <template #icon>
              <n-icon v-if="!loading">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
                  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
              </n-icon>
            </template>
            {{ loading ? 'Connexion...' : 'Se Connecter' }}
          </n-button>

          <div class="text-center mt-3">
            Vous n'avez pas de compte ? 
            <router-link to="/register" class="cedii-text-action">S'inscrire</router-link>
          </div>
        </form>
      </div>
      <div class="card-footer text-center mt-3 bg-white border-0">
        <small class="text-muted">Copyright CEDII - 2025</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NIcon } from 'naive-ui'

// Importation réelle du service d'authentification
import AuthService from '../services/AuthService'

const router = useRouter()
const credentials = ref({
  loginUti: '',
  motDePasseUti: ''
})
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Fonction pour basculer la visibilité du mot de passe
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  
  try {
    const userData = await AuthService.login(credentials.value.loginUti, credentials.value.motDePasseUti)
    
    if (!userData || !userData.roleUti) {
      throw new Error("Réponse de connexion invalide du serveur.")
    }
    
    const role = userData.roleUti.toLowerCase()

    switch (role) {
      case 'admin':
        router.push({ name: 'AdminDashboard' })
        break
      case 'reception':
        router.push({ name: 'ReceptionDashboard' })
        break
      case 'finance':
        router.push({ name: 'FinanceDashboard' })
        break
      case 'client':
      default:
        router.push({ name: 'ClientDashboard' })
        break
    }
    
  } catch (err) {
    const msg = err.response?.data?.message || "Échec de la connexion. Vérifiez le serveur et les identifiants."
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--cedii-primary-dark) 0%, var(--cedii-dark) 100%);
}

.login-card {
  max-width: 500px;
  width: 100%;
  border-radius: 15px;
  border: none;
}

.login-logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid var(--cedii-primary-light);
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(91, 17, 238, 0.3);
}

.cedii-text-dark {
  color: var(--cedii-dark);
  font-weight: 600;
}

.cedii-btn-primary {
  background-color: var(--cedii-primary-light);
  border-color: var(--cedii-primary-light);
  color: white;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cedii-btn-primary:hover {
  background-color: var(--cedii-primary-dark);
  border-color: var(--cedii-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 17, 238, 0.4);
}

.cedii-btn-primary:active {
  transform: translateY(0);
}

.cedii-text-action {
  color: var(--cedii-primary-light);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.cedii-text-action:hover {
  color: var(--cedii-primary-dark);
  text-decoration: underline;
}

:deep(.cedii-input) {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

:deep(.cedii-input:focus) {
  border-color: var(--cedii-primary-light);
  box-shadow: 0 0 0 3px rgba(91, 17, 238, 0.1);
}

:deep(.n-input__prefix) {
  color: var(--cedii-primary-light);
}

:deep(.n-input .n-input__input-el) {
  padding-right: 40px !important;
}

.col-form-label {
  font-size: 0.95rem;
  padding-top: 8px;
}
</style>