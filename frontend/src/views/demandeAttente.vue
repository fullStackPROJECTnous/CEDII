

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
        <n-layout-header bordered class="custom-header fixed-header d-flex align-items-center p-3">
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
              <i class="bi bi-bell-fill me-2"></i>
              Demandes de Réservation à Traiter
            </h1>
            <p class="custom-subtitle">Gestion et validation des demandes en attente</p>
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
          <div class="demandes-container">
            <!-- Carte principale -->
            <n-card class="main-card custom-card" content-class="p-0">
              <template #header>
                <div class="card-header-content">
                  <n-alert
                    v-if="actionMessage"
                    :type="actionMessageType"
                    :title="actionMessageType === 'success' ? 'Succès' : 'Erreur'"
                    class="m-4"
                    closable
                    @close="actionMessage = ''"
                  >
                    {{ actionMessage }}
                  </n-alert>

                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 class="card-title mb-1">
                        <i class="bi bi-list-check me-2"></i>
                        Liste des Demandes en Attente
                      </h3>
                      <p class="card-subtitle text-muted mb-0">
                        {{ pendingRequests.length }} demande(s) nécessite(nt) votre attention
                      </p>
                    </div>

                    <n-tag :bordered="false" type="warning" size="large" class="custom-tag">
                      <template #icon>
                        <i class="bi bi-clock-history"></i>
                      </template>
                      En attente
                    </n-tag>
                  </div>
                </div>
              </template>

              <div class="card-body-content">
                <!-- Loading -->
                <div v-if="loading" class="loading-state">
                  <n-space vertical align="center" class="py-5">
                    <n-spin size="large" />
                    <n-text type="primary" class="mt-3">Chargement des demandes en cours...</n-text>
                  </n-space>
                </div>

                <!-- Vide -->
                <div v-else-if="pendingRequests.length === 0" class="empty-state">
                  <n-empty size="large" description="Aucune demande en attente">
                    <template #icon>
                      <n-icon size="80" color="#28a745">
                        <i class="bi bi-check-circle-fill"></i>
                      </n-icon>
                    </template>

                    <template #extra>
                      <n-text depth="3">Toutes les demandes ont été traitées. 🎉</n-text>
                    </template>
                  </n-empty>
                </div>

                <!-- Tableau des demandes avec défilement -->
                <div v-else class="table-container">
                  <div class="table-responsive" style="overflow-x: auto; max-height: 600px;">
                    <table class="table table-hover table-fixed" style="min-width: 1300px;">
                      <thead class="table-primary sticky-header">
                        <tr>
                          <th width="80">ID</th>
                          <th width="200">Demandeur</th>
                          <th width="120">Type</th>
                          <!-- NOUVELLE COLONNE DÉSIGNATION -->
                          <th width="200">Désignation</th>
                          <th width="250">Date & Heure Soumission</th>
                          <th width="250">Début Réservation</th>
                          <th width="180" class="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="request in pendingRequests" :key="request.idRes">
                          <td>
                            <span class="badge bg-info">#{{ request.idRes }}</span>
                          </td>
                          <td>
                            <div class="fw-bold text-ellipsis">
                              {{ getClientName(request) }}
                            </div>
                            <div class="small text-muted text-ellipsis">
                              ID: {{ request.idCli || 'N/A' }}
                            </div>
                          </td>
                          <td class="text-center">
                            <span :class="{
                              'badge bg-primary': request.typeRes === 'Salle',
                              'badge bg-warning text-dark': request.typeRes === 'Materiel',
                              'badge bg-success': request.typeRes === 'Mixte'
                            }">
                              <i :class="{
                                'bi bi-house-door me-1': request.typeRes === 'Salle',
                                'bi bi-tools me-1': request.typeRes === 'Materiel',
                                'bi bi-collection me-1': request.typeRes === 'Mixte'
                              }"></i>
                              {{ getRessourceType(request) }}
                            </span>
                          </td>
                          <!-- NOUVELLE CELLULE POUR LA DÉSIGNATION -->
                          <td>
                            <div class="designation-cell">
                              {{ getDesignation(request) }}
                            </div>
                          </td>
                          <td>
                            <!-- DATE ET HEURE EXACTE DE SOUMISSION À MADAGASCAR -->
                            <div class="datetime-cell">
                              <div class="fw-bold text-primary text-scroll">
                                {{ getExactSubmissionDateTime(request) }}
                              </div>
                              <div class="small text-muted text-scroll">
                                <i class="bi bi-clock me-1"></i>
                                {{ getTimeAgo(request) }}
                              </div>
                            </div>
                          </td>
                          <td>
                            <!-- DATE ET HEURE EXACTE DE DEBUT À MADAGASCAR -->
                            <div class="datetime-cell">
                              <div class="fw-bold text-scroll">
                                {{ getExactReservationStart(request) }}
                              </div>
                              <div class="small text-muted text-scroll">
                                <i class="bi bi-calendar-event me-1"></i>
                                {{ getTimeUntil(request) }}
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <div class="d-flex justify-content-center gap-2 action-buttons">
                              <!-- Bouton Gérer -->
                              <button 
                                class="btn btn-primary btn-sm"
                                @click="handleManage(request)"
                              >
                                <i class="bi bi-eye me-1"></i>
                                Gérer
                              </button>
                              <!-- Bouton Refuser -->
                              <button 
                                class="btn btn-danger btn-sm"
                                @click="handleRefuse(request)"
                              >
                                <i class="bi bi-x-lg me-1"></i>
                                Refuser
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Indicateur de défilement -->
                  <div v-if="pendingRequests.length > 5" class="scroll-hint mt-2">
                    <i class="bi bi-arrow-left-right me-1"></i>
                    Défilez horizontalement pour voir toutes les colonnes
                  </div>
                </div>

                <!-- Erreur -->
                <n-alert
                  v-if="errorMessage"
                  type="error"
                  title="Erreur de chargement"
                  class="m-4"
                  closable
                  @close="errorMessage = null"
                >
                  {{ errorMessage }}
                </n-alert>
              </div>
            </n-card>

            <!-- Modal refus -->
            <n-modal v-model:show="showRefuseModal" preset="dialog" title="Confirmation de refus">
              <template #header>
                <div class="d-flex align-items-center">
                  <n-icon size="24" color="#f5222d" class="me-2">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                  </n-icon>
                  <span>Confirmer le refus</span>
                </div>
              </template>

              <div class="modal-content">
                <p>Êtes-vous sûr de vouloir <strong>refuser</strong> la demande <strong>#{{ selectedRequest?.idRes }}</strong> ?</p>
                <p class="text-muted small">Cette action est irréversible.</p>
              </div>

              <template #action>
                <div class="d-flex gap-2 w-100">
                  <n-button class="flex-grow-1" @click="showRefuseModal = false">
                    Annuler
                  </n-button>

                  <n-button 
                    type="error"
                    class="flex-grow-1 custom-btn-danger"
                    @click="confirmRefuse"
                    :loading="refuseLoading"
                  >
                    <template #icon>
                      <i class="bi bi-x-lg"></i>
                    </template>
                    Confirmer le refus
                  </n-button>
                </div>
              </template>
            </n-modal>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>


<script setup>
import { ref, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import {
  NLayout, 
  NLayoutSider, 
  NLayoutContent, 
  NLayoutHeader, 
  NMenu, 
  NButton, 
  NIcon, 
  NTag, 
  NCard, 
  NSpin, 
  NSpace,
  NText, 
  NEmpty, 
  NAlert, 
  NModal
} from 'naive-ui';
import LocationService from '../services/LocationService';
import AuthService from '../services/AuthService';

const router = useRouter();

// États utilisateur
const userRole = ref('');
const activeMenuKey = ref('demandes-attente');
const badgeCount = ref(0);

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

/* --- states --- */
const pendingRequests = ref([]);
const loading = ref(true);
const errorMessage = ref(null);
const actionMessage = ref('');
const actionMessageType = ref('success');
const showRefuseModal = ref(false);
const selectedRequest = ref(null);
const refuseLoading = ref(false);

/* --- FONCTIONS DE FORMATAGE DES DATES --- */
const formatDateTime = (dateValue) => {
  try {
    if (!dateValue) {
      return 'Non disponible';
    }
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) {
      return 'Format invalide';
    }
    
    // Formater pour Madagascar
    return date.toLocaleString('fr-MG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Indian/Antananarivo'
    });
  } catch (error) {
    console.error('Erreur format date:', error);
    return 'Erreur';
  }
};

const formatDateRelative = (dateValue, isFuture = false) => {
  try {
    if (!dateValue) return 'inconnu';
    
    const date = new Date(dateValue);
    
    if (isNaN(date.getTime())) return 'inconnu';
    
    const now = new Date();
    
    if (isFuture) {
      const diffMs = date - now;
      
      if (diffMs < 0) {
        const diffHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60));
        if (diffHours < 1) return "En retard (< 1h)";
        if (diffHours < 24) return `En retard (${diffHours}h)`;
        return "En retard";
      }
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) return `Dans ${diffDays} j ${diffHours} h`;
      if (diffHours > 0) return `Dans ${diffHours} heures`;
      return "Aujourd'hui";
    } else {
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMinutes < 1) return "À l'instant";
      if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      if (diffDays === 1) return "Hier";
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
      return `Il y a ${Math.floor(diffDays / 30)} mois`;
    }
  } catch (error) {
    console.error('Erreur format relatif:', error);
    return 'inconnu';
  }
};

/* --- FONCTIONS D'AFFICHAGE AMÉLIORÉES --- */
const getClientName = (request) => {
  console.log('🔍 getClientName pour request:', request.idRes, request);
  
  if (request.Client) {
    return `${request.Client.nomCli || ''} ${request.Client.prenomCli || ''}`.trim() || 'N/A';
  } else if (request.client) {
    return `${request.client.nomCli || ''} ${request.client.prenomCli || ''}`.trim() || 'N/A';
  } else if (request.nomCli && request.prenomCli) {
    return `${request.nomCli} ${request.prenomCli}`.trim();
  }
  
  console.log('⚠️ Client non trouvé dans:', Object.keys(request));
  return 'Client non spécifié';
};


/*
// FONCTION POUR LA DÉSIGNATION AVEC LOGS DÉTAILLÉS
const getDesignation = (request) => {
  try {
    console.log('🔍 ANALYSE DÉSIGNATION pour demande #' + request.idRes + ':', {
      typeRes: request.typeRes,
      codeMat: request.codeMat,
      idSalle: request.idSalle,
      reservation: request.reservation,
      Reservation: request.Reservation,
      materielDetails: request.materielDetails,
      salleDetails: request.salleDetails
    });
    
    // 1. Vérifier d'abord si on a déjà les détails enrichis
    if (request.materielDetails?.designationMat && (request.typeRes === 'Materiel' || request.typeRes === 'Mixte')) {
      console.log('✅ Désignation trouvée dans materielDetails:', request.materielDetails.designationMat);
      return `Matériel: ${request.materielDetails.designationMat}`;
    }
    
    if (request.salleDetails?.nomSalle && (request.typeRes === 'Salle' || request.typeRes === 'Mixte')) {
      console.log('✅ Désignation trouvée dans salleDetails:', request.salleDetails.nomSalle);
      return `Salle: ${request.salleDetails.nomSalle}`;
    }
    
    // 2. Pour les matériels
    if (request.typeRes === 'Materiel') {
      // Chercher le codeMat dans différents chemins
      const codeMat = request.codeMat || 
                     request.reservation?.codeMat || 
                     request.Reservation?.codeMat;
      
      if (codeMat) {
        console.log('✅ codeMat trouvé:', codeMat);
        
        // Si on a un codeMat mais pas les détails, on peut faire une requête directe
        if (request.materielDetails === undefined) {
          console.log('⚠️ Pas de détails matériel, retour du code uniquement');
          return `Matériel: ${codeMat}`;
        }
        
        // Si on a les détails, utiliser la désignation
        if (request.materielDetails?.designationMat) {
          return `Matériel: ${request.materielDetails.designationMat}`;
        }
        
        return `Matériel: ${codeMat}`;
      }
    }
    
    // 3. Pour les salles
    if (request.typeRes === 'Salle') {
      // Chercher l'idSalle dans différents chemins
      const idSalle = request.idSalle || 
                     request.reservation?.idSalle || 
                     request.Reservation?.idSalle;
      
      if (idSalle) {
        console.log('✅ idSalle trouvé:', idSalle);
        
        // Si on a un idSalle mais pas les détails
        if (request.salleDetails === undefined) {
          console.log('⚠️ Pas de détails salle, retour de l\'ID uniquement');
          return `Salle #${idSalle}`;
        }
        
        // Si on a les détails, utiliser le nom
        if (request.salleDetails?.nomSalle) {
          return `Salle: ${request.salleDetails.nomSalle}`;
        }
        
        return `Salle #${idSalle}`;
      }
    }
    
    // 4. Pour les mixtes
    if (request.typeRes === 'Mixte') {
      const codeMat = request.codeMat || request.reservation?.codeMat || request.Reservation?.codeMat;
      const idSalle = request.idSalle || request.reservation?.idSalle || request.Reservation?.idSalle;
      
      if (codeMat && idSalle) {
        const matDesignation = request.materielDetails?.designationMat || codeMat;
        const salleDesignation = request.salleDetails?.nomSalle || `#${idSalle}`;
        return `Mixte: ${matDesignation} & ${salleDesignation}`;
      }
    }
    
    // 5. Fallback
    console.log('⚠️ Aucune information de ressource trouvée. Données complètes:', {
      typeRes: request.typeRes,
      toutesLesCles: Object.keys(request),
      structure: JSON.stringify(request, null, 2)
    });
    
    return 'Non spécifié';
    
  } catch (error) {
    console.error('❌ Erreur getDesignation:', error);
    console.error('Stack trace:', error.stack);
    return 'Erreur de chargement';
  }
};

*/

// REMPLACEZ getDesignation par ceci :
const getDesignation = (request) => {
  try {
    console.log('🔍 ANALYSE DÉSIGNATION pour demande #' + request.idRes + ':', request);
    
    // DEBUG COMPLET - Vérifiez TOUTES les propriétés
    console.log('🔍 DEBUG COMPLET - Toutes les clés:');
    Object.keys(request).forEach(key => {
      console.log(`  ${key}:`, request[key]);
    });
    
    // Recherchez nomSalle et designationMat
    const nomSalle = request.nomSalle || request.salleDetails?.nomSalle;
    const designationMat = request.designationMat || request.materielDetails?.designationMat;
    
    console.log('🔍 RÉSULTAT RECHERCHE:', { nomSalle, designationMat });
    
    // 1. Pour les salles - UTILISEZ nomSalle DIRECTEMENT
    if (request.typeRes === 'Salle') {
      if (nomSalle) {
        console.log('✅ Salle trouvée:', nomSalle);
        return ` ${nomSalle}`;
      } else if (request.idSalle) {
        console.log('⚠️ Pas de nomSalle, retour ID');
        return `Salle #${request.idSalle}`;
      }
    }
    
    // 2. Pour les matériels
    if (request.typeRes === 'Materiel') {
      if (designationMat) {
        console.log('✅ Matériel trouvé:', designationMat);
        return ` ${designationMat}`;
      } else if (request.codeMat) {
        console.log('⚠️ Pas de designationMat, retour code');
        return `Matériel: ${request.codeMat}`;
      }
    }
    
    // 3. Fallback
    console.log('⚠️ Aucune info trouvée');
    return 'Non spécifié';
    
  } catch (error) {
    console.error('❌ Erreur getDesignation:', error);
    return 'Erreur';
  }
};


// FONCTION AMÉLIORÉE POUR RÉCUPÉRER LA DATE DE CRÉATION
const getExactSubmissionDateTime = (request) => {
  console.log('📅 ANALYSE DATE CRÉATION pour demande #' + request.idRes + ':', {
    dateCre: request.dateCre,
    createdAt: request.createdAt,
    date_creation: request.date_creation,
    toutesLesClesDate: Object.keys(request).filter(key => 
      key.toLowerCase().includes('date') || 
      key.toLowerCase().includes('creat') || 
      key.toLowerCase().includes('time')
    )
  });
  
  // Essayer plusieurs propriétés possibles dans l'ordre de priorité
  const dateValue = request.dateCre || 
                   request.createdAt || 
                   request.date_creation || 
                   request.creationDate ||
                   request.dateCreation ||
                   request.created_date ||
                   request.created ||
                   request.date || 
                   request.timestamp;
  
  if (dateValue) {
    console.log('✅ Date de création trouvée:', dateValue, 'type:', typeof dateValue);
    return formatDateTime(dateValue);
  }
  
  console.log('⚠️ Aucune date de création trouvée pour la demande #' + request.idRes);
  console.log('Structure complète de la demande:', JSON.stringify(request, null, 2));
  
  return 'Date non disponible';
};

const getExactReservationStart = (request) => {
  const dateValue = request.debRes || 
                   request.startDate || 
                   request.debutReservation ||
                   request.dateDebut ||
                   request.reservationStart;
  
  if (!dateValue) {
    console.warn(`⚠ debRes manquante pour la demande #${request.idRes}`);
    return 'Non disponible';
  }
  
  return formatDateTime(dateValue);
};

const getTimeAgo = (request) => {
  const dateValue = request.dateCre || 
                   request.createdAt || 
                   request.date_creation || 
                   request.creationDate ||
                   request.dateCreation ||
                   request.created_date ||
                   request.created ||
                   request.date ||
                   request.timestamp;
  
  if (!dateValue) {
    return 'inconnu';
  }
  
  return formatDateRelative(dateValue, false);
};

const getTimeUntil = (request) => {
  const dateValue = request.debRes || 
                   request.startDate || 
                   request.debutReservation ||
                   request.dateDebut ||
                   request.reservationStart;
  
  return formatDateRelative(dateValue, true);
};

const getRessourceType = (req) =>
  ({ 'Salle': 'Salle', 'Materiel': 'Matériel', 'Mixte': 'Salle & Matériel' }[req.typeRes] || 'Non spécifié');

/* --- FONCTION POUR ENRICHIR LES DONNÉES DE RÉSERVATION --- */
const enrichReservationsData = async (reservations) => {
  try {
    console.log('🔄 Début enrichissement des données pour', reservations.length, 'réservations');
    
    // Récupérer tous les matériels et salles en une seule fois
    const [materielsResponse, sallesResponse] = await Promise.all([
      LocationService.getMateriels(),
      LocationService.getSalles()
    ]);
    
    console.log('📦 Réponses API reçues:', {
      materiels: materielsResponse,
      salles: sallesResponse
    });
    
    // Extraire les données
    let materielsArray = [];
    let sallesArray = [];
    
    // Matériels
    if (materielsResponse?.data) {
      if (Array.isArray(materielsResponse.data)) {
        materielsArray = materielsResponse.data;
      } else if (materielsResponse.data.data && Array.isArray(materielsResponse.data.data)) {
        materielsArray = materielsResponse.data.data;
      } else if (Array.isArray(materielsResponse.data.results)) {
        materielsArray = materielsResponse.data.results;
      }
    }
    
    // Salles
    if (sallesResponse?.data) {
      if (Array.isArray(sallesResponse.data)) {
        sallesArray = sallesResponse.data;
      } else if (sallesResponse.data.data && Array.isArray(sallesResponse.data.data)) {
        sallesArray = sallesResponse.data.data;
      } else if (Array.isArray(sallesResponse.data.results)) {
        sallesArray = sallesResponse.data.results;
      }
    }
    
    console.log(`📊 ${materielsArray.length} matériels chargés`);
    console.log(`📊 ${sallesArray.length} salles chargées`);
    
    if (materielsArray.length > 0) {
      console.log('Exemple matériel:', materielsArray[0]);
    }
    if (sallesArray.length > 0) {
      console.log('Exemple salle:', sallesArray[0]);
    }
    
    // Enrichir chaque réservation
    const enrichedReservations = reservations.map(reservation => {
      const enriched = { ...reservation };
      
      // DEBUG: Log de la réservation avant enrichissement
      console.log(`🔍 Réservation ${reservation.idRes} avant enrichissement:`, {
        typeRes: reservation.typeRes,
        codeMat: reservation.codeMat,
        idSalle: reservation.idSalle
      });
      
      // Enrichir avec les détails du matériel si présent
      if (reservation.typeRes === 'Materiel' || reservation.typeRes === 'Mixte') {
        const codeMat = reservation.codeMat || 
                       reservation.reservation?.codeMat || 
                       reservation.Reservation?.codeMat;
        
        console.log(`🔍 Recherche matériel pour codeMat: ${codeMat}`);
        
        if (codeMat && materielsArray.length > 0) {
          const materiel = materielsArray.find(m => m.codeMat === codeMat);
          
          if (materiel) {
            enriched.materielDetails = materiel;
            console.log(`✅ Matériel trouvé pour ${codeMat}:`, materiel.designationMat);
          } else {
            console.warn(`❌ Matériel non trouvé pour codeMat: ${codeMat}`);
            console.log('Liste des codeMat disponibles:', materielsArray.map(m => m.codeMat));
          }
        } else {
          console.warn(`⚠️ Pas de codeMat ou liste de matériels vide pour réservation ${reservation.idRes}`);
        }
      }
      
      // Enrichir avec les détails de la salle si présent
      if (reservation.typeRes === 'Salle' || reservation.typeRes === 'Mixte') {
        const idSalle = reservation.idSalle || 
                       reservation.reservation?.idSalle || 
                       reservation.Reservation?.idSalle;
        
        console.log(`🔍 Recherche salle pour idSalle: ${idSalle}`);
        
        if (idSalle && sallesArray.length > 0) {
          const salle = sallesArray.find(s => s.idSalle == idSalle);
          
          if (salle) {
            enriched.salleDetails = salle;
            console.log(`✅ Salle trouvée pour ${idSalle}:`, salle.nomSalle);
          } else {
            console.warn(`❌ Salle non trouvée pour idSalle: ${idSalle}`);
            console.log('Liste des idSalle disponibles:', sallesArray.map(s => s.idSalle));
          }
        } else {
          console.warn(`⚠️ Pas d'idSalle ou liste de salles vide pour réservation ${reservation.idRes}`);
        }
      }
      
      console.log(`✅ Réservation ${reservation.idRes} après enrichissement:`, {
        materielDetails: enriched.materielDetails ? 'présent' : 'absent',
        salleDetails: enriched.salleDetails ? 'présent' : 'absent'
      });
      
      return enriched;
    });
    
    console.log(`🎉 Enrichissement terminé pour ${enrichedReservations.length} réservations`);
    
    return enrichedReservations;
    
  } catch (error) {
    console.error('❌ Erreur enrichissement données:', error);
    console.error('Détails de l\'erreur:', error.message);
    // Retourner les données originales en cas d'erreur
    return reservations;
  }
};

/* --- FETCH DATA AVEC ENRICHISSEMENT DES DONNÉES --- */
const fetchPendingRequests = async () => {
  loading.value = true;
  errorMessage.value = null;
  
  try {
    console.log('🔄 Début récupération des demandes en attente...');
    
    // 1. Récupérer les demandes en attente
    const res = await LocationService.getPendingReservations();
    
    console.log('📦 Réponse brute de getPendingReservations:', res);
    
    const data = res?.data;
    
    let requestsArray = [];
    
    // Extraction des données
    if (data && data.success && Array.isArray(data.data)) {
      requestsArray = data.data;
      console.log('✅ Données extraites de data.data (success: true)');
    } else if (data && Array.isArray(data.data)) {
      requestsArray = data.data;
      console.log('✅ Données extraites de data.data');
    } else if (Array.isArray(data)) {
      requestsArray = data;
      console.log('✅ Données extraites directement de l\'array');
    } else if (data && data.reservations && Array.isArray(data.reservations)) {
      requestsArray = data.reservations;
      console.log('✅ Données extraites de data.reservations');
    } else if (data && data.results && Array.isArray(data.results)) {
      requestsArray = data.results;
      console.log('✅ Données extraites de data.results');
    } else {
      const key = Object.keys(data || {}).find(k => Array.isArray(data[k]));
      if (key) {
        requestsArray = data[key];
        console.log(`✅ Données extraites de data.${key}`);
      } else {
        console.warn('❌ Format de données inconnu:', data);
        requestsArray = [];
      }
    }
    
    console.log(`✅ ${requestsArray.length} demande(s) trouvée(s)`);
    
    // ANALYSE DÉTAILLÉE des données
    if (requestsArray.length > 0) {
      console.log('📋 ANALYSE DÉTAILLÉE DES DONNÉES:');
      
      // Analyser les 3 premières demandes
      requestsArray.slice(0, 3).forEach((request, index) => {
        console.log(`\n📊 Demande #${index + 1} (ID: ${request.idRes}):`);
        console.log('Structure:', JSON.stringify(request, null, 2));
        
        // Chercher spécifiquement les propriétés importantes
        const importantProps = ['codeMat', 'idSalle', 'typeRes', 'dateCre', 'debRes'];
        importantProps.forEach(prop => {
          console.log(`  ${prop}:`, request[prop], `(chemin: request.${prop})`);
        });
        
        // Chercher aussi dans reservation et Reservation
        if (request.reservation) {
          console.log('  Dans request.reservation:');
          importantProps.forEach(prop => {
            console.log(`    ${prop}:`, request.reservation[prop]);
          });
        }
        
        if (request.Reservation) {
          console.log('  Dans request.Reservation:');
          importantProps.forEach(prop => {
            console.log(`    ${prop}:`, request.Reservation[prop]);
          });
        }
      });
    } else {
      console.warn('⚠️ Aucune demande trouvée dans les données');
      console.log('Structure des données complètes:', JSON.stringify(data, null, 2));
    }
    
    // 2. Enrichir les demandes avec les détails
    const enrichedRequests = await enrichReservationsData(requestsArray);
    
    // 3. Traiter les données finales
    const processedRequests = enrichedRequests.map(request => {
      // Si dateCre est undefined, ajouter une date estimée
      if (request.dateCre === undefined) {
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() - (50 - request.idRes));
        
        return {
          ...request,
          dateCreEstimée: estimatedDate.toISOString(),
          dateCreManquante: true
        };
      }
      return request;
    });
    
    // 4. Log final détaillé pour chaque demande
    console.log('\n🎉 DEMANDES FINALES PRÊTES POUR AFFICHAGE:');
    processedRequests.forEach((request, index) => {
      console.log(`\n📋 #${index + 1} - Demande ${request.idRes}:`);
      console.log('  Type:', request.typeRes);
      console.log('  codeMat:', request.codeMat);
      console.log('  idSalle:', request.idSalle);
      console.log('  Désignation calculée:', getDesignation(request));
      console.log('  Date création:', request.dateCre);
      console.log('  Date début:', request.debRes);
      console.log('  Client:', getClientName(request));
      
      // Afficher les détails si présents
      if (request.materielDetails) {
        console.log('  Matériel détail:', request.materielDetails.designationMat);
      }
      if (request.salleDetails) {
        console.log('  Salle détail:', request.salleDetails.nomSalle);
      }
    });
    
    // 5. Assigner les données traitées
    pendingRequests.value = processedRequests;
    badgeCount.value = processedRequests.length;
    
    console.log(`\n✅ FIN: ${pendingRequests.value.length} demandes chargées avec succès`);
    
  } catch (e) {
    console.error("❌ Erreur récupération demandes:", e);
    console.error("Détails de l'erreur:", {
      message: e.message,
      response: e.response?.data,
      status: e.response?.status,
      stack: e.stack
    });
    pendingRequests.value = [];
    errorMessage.value = e.response?.data?.message || e.message || "Erreur de connexion au serveur";
  } finally {
    loading.value = false;
  }
};

/* --- actions --- */
const handleManage = (request) => {
  console.log('📝 Gérer la demande:', request.idRes);
  router.push({ name: 'ReservationValid', params: { idRes: request.idRes } });
};

const handleRefuse = (request) => {
  console.log('❌ Refuser la demande:', request.idRes);
  selectedRequest.value = request;
  showRefuseModal.value = true;
};



const confirmRefuse = async () => {
  if (!selectedRequest.value) return;
  refuseLoading.value = true;

  try {
    await LocationService.updateReservationStatus(selectedRequest.value.idRes, 'Refusée');
    actionMessage.value = `Demande #${selectedRequest.value.idRes} refusée avec succès`;
    actionMessageType.value = 'success';
    await fetchPendingRequests();
    
    showRefuseModal.value = false;
    selectedRequest.value = null;
  } catch (e) {
    console.error("Erreur refus:", e);
    actionMessage.value = e.response?.data?.message || e.message || "Erreur lors du refus";
    actionMessageType.value = 'error';
  }

  refuseLoading.value = false;
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
  
  fetchPendingRequests();
});
</script>


<style scoped>
.full-height-container {
  height: 100vh;
}

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

.demandes-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.card-header-content {
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-subtitle {
  font-size: 0.875rem;
}

.card-body-content {
  padding: 1.5rem;
}

.loading-state {
  padding: 3rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  padding: 4rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-container {
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #007bff #f8f9fa;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

.table {
  margin-bottom: 0;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8f9fa !important;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #007bff;
  padding: 12px 16px;
  white-space: nowrap;
  position: relative;
}

.table td {
  vertical-align: middle;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  max-width: 200px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9ff !important;
}

.datetime-cell {
  max-width: 250px;
  overflow: hidden;
}

.text-scroll {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
  position: relative;
}

.text-scroll:hover {
  overflow: auto;
  text-overflow: clip;
  white-space: normal;
  cursor: ew-resize;
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.badge {
  font-size: 0.85em;
  padding: 0.4em 0.8em;
  white-space: nowrap;
}

.table td:nth-child(5) .fw-bold {
  color: #5811EE;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.table td:nth-child(6) .fw-bold {
  color: #067186;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.table td .small {
  color: #6c757d;
  font-size: 0.8rem;
}

/* NOUVEAU STYLE POUR LA CELLULE DE DÉSIGNATION */
.designation-cell {
  font-size: 0.85rem;
  color: #555;
  padding: 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180px;
}

.designation-cell:hover {
  overflow: auto;
  text-overflow: clip;
  white-space: normal;
  max-height: 100px;
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  z-index: 5;
}

.action-buttons {
  min-width: 160px;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.custom-btn-danger {
  background-color: #dc3545;
  border: none;
  color: white;
}

.scroll-hint {
  text-align: center;
  font-size: 0.8rem;
  color: #6c757d;
  padding: 4px;
  background-color: #f8f9fa;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.bg-light::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bg-light::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.bg-light::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

:deep(.custom-menu .n-menu-item .n-menu-item-content .custom-tag) {
  font-size: 10px;
  padding: 0 4px;
  height: 16px;
  min-width: 16px;
}

.fixed-header {
  position: sticky !important;
  top: 0;
  z-index: 1000;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .demandes-container {
    padding: 12px;
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
  
  .table td, .table th {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
  
  .table td:nth-child(5) .fw-bold,
  .table td:nth-child(6) .fw-bold {
    font-size: 0.8rem;
  }
  
  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
    min-width: auto;
  }
  
  .table-responsive {
    max-height: 500px;
  }
  
  /* Ajustement pour la colonne désignation sur mobile */
  .designation-cell {
    max-width: 120px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .table-responsive {
    max-height: 400px;
  }
  
  .datetime-cell {
    max-width: 180px;
  }
  
  .designation-cell {
    max-width: 100px;
  }
}
</style>