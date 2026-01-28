
<template>
  <div class="full-height-container">
    <!-- Structure principale avec sidebar et contenu -->
    <n-layout has-sider class="h-100">
      <!-- Sidebar Naive UI -->
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        show-trigger="bar"
        class="custom-sidebar"
      >
        <div class="sidebar-content d-flex flex-column h-100 p-3">
          <!-- Logo et Titre -->
          <div class="logo-title-wrapper d-flex align-items-center justify-content-center mb-5">
            <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
            <h4 class="sidebar-title mb-0 fs-6">CEDII Patrimoine Plus</h4>
          </div>
          
          <!-- Menu Navigation -->
          <n-menu
            :options="menuOptions"
            :value="activeMenuKey"
            @update:value="handleMenuSelect"
            class="flex-grow-1 custom-menu"
          />
          
          <!-- Bouton Déconnexion -->
          <div class="mt-auto pt-3 border-top border-white">
            <n-button 
              @click="logout" 
              type="error"
              size="small"
              class="w-100"
              ghost
            >
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                  </svg>
                </n-icon>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">

             <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
      
        <!-- Header avec navigation et actions -->
      <n-layout-header bordered class="custom-header d-flex justify-content-between align-items-center p-3">
  <!-- Partie gauche -->
  <div class="d-flex align-items-center">
    <n-button 
      @click="$router.go(-1)" 
      type="default" 
      size="small"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-left"></i>
      </template>
      Retour
    </n-button>
  </div>
  
  <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-box-seam me-2"></i>
                Inventaire & Patrimoine
              </h1>
              <p class="custom-subtitle">Gestion du matériel et des salles de l'établissement</p>
            </div>
  
  <!-- Partie droite -->
  <div class="d-flex align-items-center gap-3">
    <n-button 
      @click="refreshPage" 
      type="info" 
      size="small"
      :loading="isLoading"
      ghost
    >
      <template #icon>
        <i class="bi bi-arrow-clockwise"></i>
      </template>
      Actualiser
    </n-button>
    
    <n-tag type="info" size="small" class="custom-tag">
      Rôle: {{ userLogin }}
    </n-tag>
  </div>
</n-layout-header>
    <!-- ... votre header existant ... -->
        </n-layout-header>

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="inventaire-patrimoine-container">
            <!-- Navigation par onglets -->
            <div class="navigation-section mb-4">
              <ul class="nav nav-tabs custom-nav-tabs">
                <li class="nav-item">
                  <router-link 
                    to="/patrimoine-admin/materiel"  
                    :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine-admin/materiel') }]">
                    <i class="bi bi-pc-display me-2"></i>Matériel
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link 
                    to="/patrimoine-admin/salle" 
                    :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine-admin/salle') }]">
                    <i class="bi bi-door-closed me-2"></i>Salles
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Contenu principal -->
            <div class="content-section">
              <div class="tab-content-container custom-card">
                <router-view></router-view>
              </div>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag
} from 'naive-ui';
import AuthService from '../services/AuthService';

const router = useRouter();

// États utilisateur
const userRole = ref('');
const userLogin = ref('');
const activeMenuKey = ref('inventaire'); // Activer l'item "inventaire" dans le menu

// Options du menu
const menuOptions = [
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },

  {
    label: () => h('span', { class: 'text-white' }, 'Gestion des Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Inventaire & Patrimoine'),
    key: 'inventaire',
    icon: renderIcon('bi-tools')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Matériel de Bureau'),
    key: 'bureau',
    icon: renderIcon('bi-briefcase-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Locations & Réservations'),
    key: 'locations',
    icon: renderIcon('bi-calendar-check')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Gestion Financière'),
    key: 'finance',
    icon: renderIcon('bi-bank')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Suivi & Rapports'),
    key: 'rapports',
    icon: renderIcon('bi-graph-up')
  },

];

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'accueil': 'AdminDashboard',
    'utilisateurs': 'UserManagement',
    'clients': 'ClientManagement1',
    'inventaire': 'InventairePatrimoineAD',
    'locations': 'Location',
    'finance': 'Finance',
    'bureau': 'Bureau1',
    'rapports': 'Rapport',
    'logs': 'SystemLogs'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Navigation
const goToDashboard = () => {
  router.push({ name: 'AdminDashboard' });
};

const logout = () => {
  const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
  if (isConfirmed) {
    AuthService.logout();
    router.push('/');
  }
};

// Cycle de vie
onMounted(() => {
  // Initialiser l'utilisateur
  const user = AuthService.getCurrentUser();
  if (user && user.roleUti) {
    userRole.value = user.roleUti.toUpperCase();
    userLogin.value = user.loginUti || '';
  }
});
</script>

<style scoped>
.full-height-container {
  height: 100vh;
}

/* Sidebar en bleu nuit */
.custom-sidebar {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  background: transparent;
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.sidebar-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Styles pour le menu */
:deep(.custom-menu) {
  background-color: transparent !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content) {
  color: white !important;
  transition: all 0.3s ease;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content.n-menu-item-content--selected) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
  color: white !important;
  font-weight: 600;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

/* Header amélioré */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%) !important;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
}

/* Contenu principal */
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.bg-light {
  background-color: #f8f9fa !important;
  flex: 1;
  overflow-y: auto;
}

.inventaire-patrimoine-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff !important;
  border-color: #007bff !important;
}

.custom-btn-primary:hover {
  background: #0056b3 !important;
  border-color: #0056b3 !important;
}

.custom-tag {
  font-weight: 600;
}

/* Navigation par onglets */
.custom-nav-tabs {
  border-bottom: 2px solid #e9ecef;
  display: flex;
  gap: 0.5rem;
  background: transparent;
}

.nav-item {
  margin-bottom: -2px;
}

.custom-nav-link {
  color: #04058F;
  border: 1px solid transparent;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  text-decoration: none;
}

.custom-nav-link:hover {
  color: #007bff;
  background-color: white;
  border-color: #e9ecef #e9ecef #e9ecef;
}

.custom-nav-link.active {
  color: white;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-color: #007bff #007bff #007bff;
  position: relative;
}

.custom-nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #007bff;
}

/* Contenu principal */
.content-section {
  border-radius: 0.5rem;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-content-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Cartes cohérentes */
.custom-card {
  background-color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Scrollbars personnalisées */
.bg-light::-webkit-scrollbar,
.tab-content-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track,
.tab-content-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb,
.tab-content-container::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover,
.tab-content-container::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-nav-tabs {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .custom-nav-link {
    border-radius: 0.375rem;
    justify-content: center;
  }
  
  .custom-nav-link.active::after {
    display: none;
  }
  
  .tab-content-container {
    padding: 1rem;
  }
}

@media (max-width: 576px) {
  .tab-content-container {
    padding: 0.75rem;
  }
}


/* Layout principal */
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  overflow: hidden;
}

/* Header fixé */
.fixed-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  flex-shrink: 0; /* Empêche le header de rétrécir */
}

/* Contenu avec scroll */
.content-with-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0; /* Pas de marge car header est sticky */
  padding-top: 16px; /* Espace entre le header et le contenu */
}

/* Ajustement du conteneur de réservation */
.reservation-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 20px 20px; /* Pas de padding-top car déjà géré */
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ajustement du conteneur de scroll existant */
.content-scroll-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  padding-top: 0;
}

/* Ajustement responsive */
@media (max-width: 768px) {
  .content-with-scroll {
    padding: 12px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 12px !important;
  }
  
  .reservation-page-container {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 576px) {
  .content-with-scroll {
    padding: 8px;
    padding-top: 8px;
  }
  
  .fixed-header {
    padding: 8px !important;
  }
  
  .reservation-page-container {
    padding: 0 8px 8px 8px;
  }
}

</style>
