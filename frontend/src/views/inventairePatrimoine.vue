

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
                <i class="bi bi-box-arrow-right"></i>
              </template>
              Déconnexion
            </n-button>
          </div>
        </div>
      </n-layout-sider>

      <!-- Contenu Principal -->
      <n-layout class="main-content">
        <!-- Header -->
        <n-layout-header bordered class="custom-header d-flex align-items-center p-3">
          <!-- Bouton Retour -->
          <div class="d-flex align-items-center">
            <n-button 
              @click="$router.go(-1)" 
              type="default" 
              size="small"
              class="me-3"
              ghost
            >
              <template #icon>
                <i class="bi bi-arrow-left"></i>
              </template>
              Retour
            </n-button>
          </div>
          
          <!-- Titre centré -->
          <div class="flex-grow-1 text-center">
            <h1 class="custom-title mb-1">
              <i class="bi bi-box-seam me-2"></i>
              Inventaire & Patrimoine
            </h1>
            <p class="custom-subtitle">Gestion du matériel et des salles de l'établissement</p>
          </div>
          
          <!-- Informations utilisateur -->
          <div class="d-flex align-items-center gap-3">
            <n-tag type="info" size="small" class="custom-tag">
              Rôle: {{ userRole }}
            </n-tag>
          </div>
        </n-layout-header>

        <!-- Contenu de la page -->
        <n-layout-content class="p-4 bg-light">
          <div class="inventaire-patrimoine-container">
            <!-- Navigation par onglets -->
            <div class="navigation-section mb-4">
              <ul class="nav nav-tabs custom-nav-tabs">
                <li class="nav-item">
                  <router-link 
                    to="/patrimoine/materiel" 
                    :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine/materiel') }]">
                    <i class="bi bi-pc-display me-2"></i>Matériel
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link 
                    to="/patrimoine/salle" 
                    :class="['nav-link', 'custom-nav-link', { active: $route.path.includes('/patrimoine/salle') }]">
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
import { ref, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
const route = useRoute();

// États utilisateur
const userRole = ref('');
const activeMenuKey = ref('inventaire'); // Activer l'item "inventaire" dans le menu
const badgeCount = ref(0); // Pour afficher le nombre de demandes en attente

// Options du menu avec texte blanc
const menuOptions = ref([
  {
    label: () => h('span', { class: 'text-white' }, 'Accueil'),
    key: 'accueil',
    icon: renderIcon('bi-house-door-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Nouvelle Réservation / Location'),
    key: 'nouvelle-reservation',
    icon: renderIcon('bi-calendar-plus-fill')
  },
  {
    label: () => {
      // Créer le label avec badge conditionnel
      const children = [
        h('span', { class: 'text-white' }, 'Demandes à Traiter')
      ];
      
      if (badgeCount.value > 0) {
        children.push(
          h(NTag, {
            type: 'warning',
            size: 'small',
            class: 'ms-2 custom-tag'
          }, { default: () => badgeCount.value.toString() })
        );
      }
      
      return h('div', {
        class: 'd-flex align-items-center'
      }, children);
    },
    key: 'demandes-attente',
    icon: renderIcon('bi-bell-fill')
  },
  {
    label: () => h('span', { class: 'text-white' }, 'Calendrier & Disponibilités'),
    key: 'calendrier',
    icon: renderIcon('bi-calendar-day')
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
    label: () => h('span', { class: 'text-white' }, 'Fiches Clients'),
    key: 'clients',
    icon: renderIcon('bi-people-fill')
  }
]);

// Fonction pour rendre les icônes
function renderIcon(iconClass) {
  return () => h(NIcon, null, {
    default: () => h('i', { class: iconClass + ' text-white' })
  });
}

// Gestion de la sélection du menu
const handleMenuSelect = (key) => {
  const routeMap = {
    'accueil': 'ReceptionDashboard',
    'nouvelle-reservation': 'NouvelleReservation',
    'demandes-attente': 'DemandesEnAttente',
    'calendrier': 'CalendrierDisponibilites',
    'inventaire': 'InventairePatrimoine',
    'bureau': 'Bureau',
    'clients': 'ClientManagement'
  };
  
  if (routeMap[key]) {
    router.push({ name: routeMap[key] });
  }
};

// Navigation
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
  background-color: transparent !important;
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

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1rem;
}

.custom-tag {
  font-weight: 600;
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
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1.5rem;
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
}

.tab-content-container {
  max-height: calc(100vh - 300px);
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

/* Scrollbar personnalisée */
.tab-content-container::-webkit-scrollbar,
.bg-light::-webkit-scrollbar {
  width: 8px;
}

.tab-content-container::-webkit-scrollbar-track,
.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tab-content-container::-webkit-scrollbar-thumb,
.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.tab-content-container::-webkit-scrollbar-thumb:hover,
.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Styles pour le badge dans le menu */
:deep(.custom-menu .n-menu-item .n-menu-item-content .custom-tag) {
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  min-width: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .inventaire-patrimoine-container {
    padding: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
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
    max-height: calc(100vh - 250px);
  }
}

@media (max-width: 576px) {
  .inventaire-patrimoine-container {
    padding: 0.5rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .tab-content-container {
    padding: 0.75rem;
    max-height: calc(100vh - 200px);
  }
}
</style>