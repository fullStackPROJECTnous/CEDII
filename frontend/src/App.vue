<script setup>
import { 
  NMessageProvider, 
  NDialogProvider, 
  NNotificationProvider,
  NLoadingBarProvider,
  NConfigProvider
} from 'naive-ui';

// Optionnel: Définir un thème ou une configuration si nécessaire.
// import { darkTheme } from 'naive-ui'; 
</script>


<template>
  <n-config-provider> 
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-message-provider>
            <router-view /> 
          </n-message-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>


<style> 
/* Ceci force les éléments racine à prendre 100% de la hauteur de la fenêtre */
html, body, #app {
  height: 100%; 
  width: 100%;
  margin: 0;
  padding: 0;
  /* 🛑 L'astuce principale : masque le défilement général du corps */
  overflow: hidden; 
}

/* L'élément principal du dashboard gère son propre défilement interne */
.main-content {
  flex-grow: 1; 
  /* Cette classe permet au contenu principal de défiler si nécessaire */
  overflow-y: auto; 
}
</style>

<style scoped>
/* Le reste de votre style scoped peut rester inchangé */
router-view {
  width: 100%;
  height: 100%;
}
</style>

<!-- src/App.vue - Version fusionnée complète -->
<!--<template>
  <n-config-provider> 
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-message-provider>
            <!-- Navigation bar conditionnelle
            <nav v-if="!$route.meta.hideNavbar && authStore.isAuthenticated" 
                 class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
              <div class="container-fluid">
                <!-- Logo et marque 
                <router-link to="/" class="navbar-brand d-flex align-items-center">
                  <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" width="40" height="40" 
                       class="d-inline-block align-top me-2 rounded-circle">
                  <span class="fw-bold">CEDII Patrimoine Plus</span>
                </router-link>

                <!-- Bouton toggle pour mobile
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#navbarNav" aria-controls="navbarNav" 
                        aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Menu navigation 
                <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav me-auto">
                    <!-- Liens conditionnels selon le rôle 
                    <template v-if="authStore.userRole === 'admin'">
                      <li class="nav-item">
                        <router-link to="/dashboard/admin" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <DashboardIcon />
                          </n-icon>
                          Tableau de bord
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/utilisateurs" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <UsersIcon />
                          </n-icon>
                          Utilisateurs
                        </router-link>
                      </li>
                    </template>

                    <template v-if="['admin', 'reception'].includes(authStore.userRole)">
                      <li class="nav-item">
                        <router-link to="/clients" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <UserIcon />
                          </n-icon>
                          Clients
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/reservations/new" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <CalendarPlusIcon />
                          </n-icon>
                          Nouvelle réservation
                        </router-link>
                      </li>
                    </template>

                    <template v-if="authStore.userRole === 'client'">
                      <li class="nav-item">
                        <router-link to="/dashboard/client" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <HomeIcon />
                          </n-icon>
                          Mon compte
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link to="/catalogue" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <SearchIcon />
                          </n-icon>
                          Catalogue
                        </router-link>
                      </li>
                    </template>

                    <template v-if="['admin', 'finance'].includes(authStore.userRole)">
                      <li class="nav-item">
                        <router-link to="/finance" class="nav-link">
                          <n-icon size="18" class="me-1">
                            <DollarIcon />
                          </n-icon>
                          Finance
                        </router-link>
                      </li>
                    </template>
                  </ul>

                  <!-- Section utilisateur 
                  <div class="navbar-nav align-items-center">
                    <div class="nav-item dropdown">
                      <a href="#" class="nav-link dropdown-toggle d-flex align-items-center" 
                         id="userDropdown" role="button" data-bs-toggle="dropdown" 
                         aria-expanded="false">
                        <div class="me-2 text-end">
                          <div class="text-light fw-medium small">
                            {{ authStore.userName || authStore.user?.loginUti }}
                          </div>
                          <div class="text-light small opacity-75">
                            {{ getRoleLabel(authStore.userRole) }}
                          </div>
                        </div>
                        <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px;">
                          <n-icon size="20" color="white">
                            <PersonIcon />
                          </n-icon>
                        </div>
                      </a>
                      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                          <router-link to="/dashboard/redirect" class="dropdown-item">
                            <n-icon size="18" class="me-2">
                              <SettingsIcon />
                            </n-icon>
                            Mon profil
                          </router-link>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <button @click="handleLogout" class="dropdown-item text-danger">
                            <n-icon size="18" class="me-2">
                              <LogOutIcon />
                            </n-icon>
                            Déconnexion
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <!-- Contenu principal 
            <main :class="{ 'container-fluid py-4': !$route.meta.hideNavbar, 'p-0': $route.meta.hideNavbar }">
              <router-view />
            </main>

            <!-- Footer conditionnel 
            <footer v-if="!$route.meta.hideNavbar" class="bg-dark text-light py-3 mt-4">
              <div class="container-fluid">
                <div class="row align-items-center">
                  <div class="col-md-6 text-center text-md-start">
                    <small>© 2025 CEDII Patrimoine Plus. Tous droits réservés.</small>
                  </div>
                  <div class="col-md-6 text-center text-md-end">
                    <small class="opacity-75">
                      Connecté en tant que: {{ authStore.userName || authStore.user?.loginUti }}
                      ({{ getRoleLabel(authStore.userRole) }})
                    </small>
                  </div>
                </div>
              </div>
            </footer>
          </n-message-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import { 
  NMessageProvider, 
  NDialogProvider, 
  NNotificationProvider,
  NLoadingBarProvider,
  NConfigProvider,
  NIcon
} from 'naive-ui';
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import {
  Person as PersonIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,

 

 
} from '@vicons/ionicons5'

const router = useRouter()
const authStore = useAuthStore()

const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Administrateur',
    'reception': 'Réceptionniste',
    'finance': 'Financier',
    'client': 'Client'
  }
  return labels[role] || role
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'LoginWithRegister' })
}
</script>

<style>
/* Styles globaux */
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.main-content {
  flex-grow: 1;
  overflow-y: auto;
}
</style>

<style scoped>
/* Styles spécifiques à App.vue */
.navbar-brand img {
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.dropdown-toggle::after {
  margin-left: 0.5em;
}

main {
  min-height: calc(100vh - 73px - 73px); /* Hauteur moins navbar et footer */
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  color: var(--cedii-primary-light) !important;
  font-weight: 500;
}

@media (max-width: 768px) {
  .navbar-nav {
    margin-top: 1rem;
  }
  
  .dropdown-menu {
    position: static !important;
    transform: none !important;
  }
}

/* Styles pour le router-view */
router-view {
  width: 100%;
  height: 100%;
}
</style>-->