<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="custom-header p-4 rounded">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <router-link to="/dashboardReception" class="btn btn-sm btn-outline-light">
                <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
              </router-link>
            </div>
            <div class="text-center">
              <h1 class="custom-title mb-1">
                <i class="bi bi-calendar-check me-2"></i>
                Calendrier & Disponibilités
              </h1>
              <p class="custom-subtitle">Gestion des locations et réservations en temps réel</p>
            </div>
               <div class="position-relative">
              <n-dropdown
                trigger="click"
                :options="navigationOptions"
                @select="handleNavigationSelect"
                placement="bottom-end"
              >
                <n-button type="primary" size="small" class="custom-btn-primary">
                  <i class="bi bi-three-dots-vertical"></i>
                </n-button>
              </n-dropdown>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal avec scroll -->
    <div class="content-wrapper">
      <hr class="my-4 custom-divider">

      <!-- Cartes de statistiques -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <n-card class="custom-card-primary h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-primary me-3">
                <i class="bi bi-calendar-check text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Événements Confirmés</h6>
                <h4 class="mb-0 text-warning">{{ confirmedEvents.length }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        
        <div class="col-md-4 mb-3">
          <n-card class="custom-card-warning h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-warning me-3">
                <i class="bi bi-clock-history text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">En Cours</h6>
                <h4 class="mb-0 text-warning">{{ enCoursCount }}</h4>
              </div>
            </div>
          </n-card>
        </div>
        
        <div class="col-md-4 mb-3">
          <n-card class="custom-card-danger h-100" size="small">
            <div class="d-flex align-items-center">
              <div class="custom-icon-danger me-3">
                <i class="bi bi-check-circle text-white"></i>
              </div>
              <div>
                <h6 class="mb-1 text-white">Terminés</h6>
                <h4 class="mb-0 text-danger">{{ completedCount }}</h4>
              </div>
            </div>
          </n-card>
        </div>
      </div>

      <!-- Tableau des locations et réservations -->
      <n-card class="shadow-lg custom-card" title="Vue d'ensemble des Locations et Réservations">
        <template #header-extra>
          <n-button type="primary" size="small" class="custom-btn-primary" @click="fetchConfirmedEvents">
            <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
          </n-button>
        </template>

        <div class="card-body">
          <!-- Loading State -->
          <div v-if="loadingEvents" class="text-center p-5">
            <n-spin size="large">
              <template #description>
                Chargement des événements...
              </template>
            </n-spin>
          </div>

          <!-- Empty State -->
          <div v-else-if="confirmedEvents.length === 0" class="text-center p-5">
            <n-empty description="Aucun événement trouvé">
              <template #icon>
                <i class="bi bi-calendar-x" style="font-size: 3rem; color: #55555E;"></i>
              </template>
            </n-empty>
          </div>

          <!-- Data Table avec scroll -->
          <div v-else class="table-container">
            <n-data-table
              :columns="columns"
              :data="tableData"
              :pagination="pagination"
              :bordered="false"
              class="custom-table"
            />
          </div>
        </div>
      </n-card>
    </div>

    <!-- Modals -->
    <EtatLieu 
      v-model:show="showRetourModal"
      :location="selectedLocationForAction"
      @retour-success="handleRetourSuccess"
    />
    
    <EtatLieuDepart
      v-model:show="showEtatLieuxDepartModal"
      :location="selectedLocationForAction"
      @depart-success="handleEtatLieuxDepartSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { 
  NCard, 
  NButton, 
  NSpin, 
  NEmpty, 
  NDataTable, 
  NPagination, 
  NCollapse, 
  NCollapseItem, 
  NAlert,
  NTag ,
    NDropdown
} from 'naive-ui';
import LocationService from '../services/LocationService';
import EtatLieu from './etatLieu.vue';
import EtatLieuDepart from './etatLieuDepart.vue';



const router = useRouter();

// Options du menu de navigation
const navigationOptions = [
  {
    label: 'Nouvelle Réservation',
    key: 'nouvelle-reservation',
    icon: () => h('i', { class: 'bi bi-calendar-plus me-2' })
  },
  {
    label: 'Demandes à Traiter',
    key: 'demandes-attente',
    icon: () => h('i', { class: 'bi bi-bell me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Inventaire & Patrimoine',
    key: 'inventaire',
    icon: () => h('i', { class: 'bi bi-tools me-2' })
  },
  {
    label: 'Matériel de Bureau',
    key: 'bureau',
    icon: () => h('i', { class: 'bi bi-laptop me-2' })
  },
  {
    label: 'Fiches Clients',
    key: 'clients',
    icon: () => h('i', { class: 'bi bi-people me-2' })
  },
  {
    type: 'divider'
  },
  {
    label: 'Tableau de Bord',
    key: 'dashboard',
    icon: () => h('i', { class: 'bi bi-house me-2' })
  }
];

// Gestion de la sélection dans le menu
const handleNavigationSelect = (key) => {
  const routeMap = {
    'dashboard': '/dashboardReception',
    'nouvelle-reservation': '/reservationLocationForm',
    'demandes-attente': '/demandeAttente',
    'inventaire': '/patrimoine',
    'bureau': '/materielBureauView',
    'clients': '/clientManagement'
  };
  
  if (routeMap[key]) {
    router.push(routeMap[key]);
  }
};


// Variables réactives
const confirmedEvents = ref([]);
const loadingEvents = ref(true);

// Variables pour les modals
const showEtatLieuxDepartModal = ref(false);
const showRetourModal = ref(false);
const selectedLocationForAction = ref(null);

// 🔥 CORRECTION COMPLÈTE : Fonction pour récupérer le nom du client
const getClientName = (event) => {
  console.log('🔍 Recherche nom client pour event:', event.idLo, event);
  
  // Essayer toutes les structures de données possibles
  let clientInfo = null;
  
  // Structure 1: client direct
  if (event.client && (event.client.nomCli || event.client.prenomCli)) {
    clientInfo = event.client;
    console.log('✅ Structure trouvée: event.client');
  }
  // Structure 2: via reservation.client
  else if (event.reservation?.client && (event.reservation.client.nomCli || event.reservation.client.prenomCli)) {
    clientInfo = event.reservation.client;
    console.log('✅ Structure trouvée: event.reservation.client');
  }
  // Structure 3: via Reservation.Client (avec majuscule)
  else if (event.Reservation?.Client && (event.Reservation.Client.nomCli || event.Reservation.Client.prenomCli)) {
    clientInfo = event.Reservation.Client;
    console.log('✅ Structure trouvée: event.Reservation.Client');
  }
  // Structure 4: champs directs sur l'event
  else if (event.nomCli || event.prenomCli) {
    clientInfo = {
      nomCli: event.nomCli,
      prenomCli: event.prenomCli
    };
    console.log('✅ Structure trouvée: champs directs');
  }
  // Structure 5: via reservation avec champs directs
  else if (event.reservation?.nomCli || event.reservation?.prenomCli) {
    clientInfo = {
      nomCli: event.reservation.nomCli,
      prenomCli: event.reservation.prenomCli
    };
    console.log('✅ Structure trouvée: reservation champs directs');
  }
  
  if (clientInfo) {
    const nom = `${clientInfo.nomCli || ''} ${clientInfo.prenomCli || ''}`.trim();
    console.log('✅ Nom client trouvé:', nom);
    return nom || `Client #${clientInfo.idCli || event.idCli || 'Inconnu'}`;
  }
  
  // Fallback: chercher un ID client
  if (event.idCli) {
    console.log('ℹ️  ID client trouvé:', event.idCli);
    return `Client #${event.idCli}`;
  }
  
  if (event.reservation?.idCli) {
    console.log('ℹ️  ID client trouvé via reservation:', event.reservation.idCli);
    return `Client #${event.reservation.idCli}`;
  }
  
  if (event.Reservation?.idCli) {
    console.log('ℹ️  ID client trouvé via Reservation:', event.Reservation.idCli);
    return `Client #${event.Reservation.idCli}`;
  }
  
  console.log('❌ Aucune information client trouvée dans les structures:', {
    event: event.client,
    reservation: event.reservation?.client,
    Reservation: event.Reservation?.Client,
    champsDirects: { nomCli: event.nomCli, prenomCli: event.prenomCli }
  });
  
  return 'Client non spécifié';
};

// Computed properties
const formattedCalendarEvents = computed(() => {
  return confirmedEvents.value.map(event => ({
    id: event.idLo,
    title: `${event.typeLo} - ${getClientName(event)}`,
    start: event.debLo,
    end: event.finLo,
    classNames: ['bg-primary']
  }));
});

const tableData = computed(() => {
  return confirmedEvents.value.map(event => {
    console.log('🔍 Traitement event:', event.idLo, event);
    
    const clientName = getClientName(event);
    
    const rowData = {
      // Identifiants
      id: event.idLo,
      idLo: event.idLo,
      
      // Informations affichées
      client: clientName,
      type: event.typeLo,
      dateDebut: new Date(event.debLo).toLocaleString('fr-FR'),
      dateFin: new Date(event.finLo).toLocaleString('fr-FR'),
      tarifTot: event.tarifTot,
      statut: event.etatLo,
      materiel: event.reservation?.codeMat || event.codeMat || event.Reservation?.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || event.Reservation?.idSalle || 'N/A',
      
      // Données complètes pour les actions
      _original: event,
      reservation: event.reservation || event.Reservation,
      location: event
    };
    
    console.log('🔍 Row data créé:', rowData);
    return rowData;
  });
});

// 🔥 CORRECTION : Ajouter le compteur pour "En cours"
const enCoursCount = computed(() => {
  return confirmedEvents.value.filter(event => event.etatLo === 'En cours').length;
});

const completedCount = computed(() => {
  return confirmedEvents.value.filter(event => event.etatLo === 'Terminée').length;
});

// Fonction pour calculer le tarif basé sur la durée
const calculateTarif = (event) => {
  try {
    if (event.tarifTot && event.tarifTot > 0) {
      return event.tarifTot;
    }

    if (event.reservation) {
      if (event.reservation.tarifTot && event.reservation.tarifTot > 0) {
        return event.reservation.tarifTot;
      }

      const debut = new Date(event.debLo || event.reservation.debRes);
      const fin = new Date(event.finLo || event.reservation.finRes);
      const dureeHeures = (fin - debut) / (1000 * 60 * 60);
      
      let tarifUnitaire = 0;
      
      if (event.reservation.codeMat && event.reservation.materiel) {
        const materiel = event.reservation.materiel;
        if (dureeHeures <= 4) {
          tarifUnitaire = materiel.tarifDemiJournee || 0;
        } else if (dureeHeures <= 8) {
          tarifUnitaire = materiel.tarifJour || 0;
        } else {
          tarifUnitaire = (materiel.tarifHeure || 0) * dureeHeures;
        }
      }
      
      if (event.reservation.idSalle && event.reservation.salle) {
        const salle = event.reservation.salle;
        if (dureeHeures <= 4) {
          tarifUnitaire = salle.tarifDemiJournee || 0;
        } else if (dureeHeures <= 8) {
          tarifUnitaire = salle.tarifJour || 0;
        } else {
          tarifUnitaire = (salle.tarifHeure || 0) * dureeHeures;
        }
      }
      
      const quantite = event.reservation.qteMat || 1;
      return tarifUnitaire * quantite;
    }
    
    return 0;
  } catch (error) {
    console.error('Erreur calcul tarif:', error);
    return 0;
  }
};

// Fonction pour formater le tarif
const formatTarif = (montant) => {
  if (montant === null || montant === undefined || isNaN(montant)) {
    return '0 Ar';
  }
  const numericValue = typeof montant === 'number' ? montant : parseFloat(montant);
  return `${numericValue.toLocaleString('fr-FR')} Ar`;
};

// Configuration du tableau
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    render: (row) => h('span', { class: 'text-muted' }, `#${row.id}`)
  },
  {
    title: 'Client',
    key: 'client',
    sorter: (a, b) => a.client.localeCompare(b.client)
  },
  {
    title: 'Type',
    key: 'type',
    render: (row) => h(NTag, { 
      type: row.type === 'Salle' ? 'primary' : row.type === 'Materiel' ? 'info' : 'success',
      size: 'small',
      class: 'custom-tag'
    }, { default: () => row.type })
  },
  {
    title: 'Début',
    key: 'dateDebut',
    width: 180
  },
  {
    title: 'Fin',
    key: 'dateFin',
    width: 180
  },
  {
    title: 'Tarif',
    key: 'tarif',
    align: 'right',
    render: (row) => {
      const tarifCalcule = calculateTarif(row.location || row);
      return h('strong', { class: 'text-primary' }, formatTarif(tarifCalcule));
    }
  },
  {
    title: 'Statut',
    key: 'statut',
    render: (row) => {
      const typeMap = {
        'Confirmée': 'success',
        'En cours': 'warning',
        'Terminée': 'default',
        'En attente': 'info'
      };
      return h(NTag, { 
        type: typeMap[row.statut] || 'default',
        size: 'small',
        class: 'custom-tag'
      }, { default: () => row.statut })
    }
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (row) => {
      return h('div', { class: 'd-flex gap-1' }, [
        // Bouton État des lieux Départ - visible seulement pour "Confirmée"
        h(NButton, {
          size: 'small',
          type: 'warning',
          class: 'custom-btn-warning',
          onClick: () => ouvrirEtatLieuxDepart(row),
          disabled: row.statut !== 'Confirmée',
          title: row.statut !== 'Confirmée' ? 
            (row.statut === 'En cours' ? 'Départ déjà effectué' : 'Location terminée ou annulée') 
            : 'État des lieux départ'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-right me-1' }), 'Départ']
        }),
        
        // Bouton Retour Matériel - visible seulement pour "En cours"
        h(NButton, {
          size: 'small',
          type: 'error',
          class: 'custom-btn-danger',
          onClick: () => ouvrirRetourMateriel(row),
          disabled: row.statut !== 'En cours',
          title: row.statut !== 'En cours' ? 
            (row.statut === 'Confirmée' ? 'Départ non effectué' : 'Location terminée') 
            : 'Retour de matériel'
        }, {
          default: () => [h('i', { class: 'bi bi-box-arrow-in-left me-1' }), 'Retour']
        })
      ]);
    }
  }
];

const pagination = {
  pageSize: 10
};

// Méthodes
const ouvrirEtatLieuxDepart = (location) => {
  console.log('📍 ouvrirEtatLieuxDepart appelé');
  console.log('📍 Location reçue:', location);
  
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showEtatLieuxDepartModal.value = true;
  
  console.log('📍 Modal départ ouvert avec:', locationAvecId);
};

const ouvrirRetourMateriel = (location) => {
  console.log('📍 ouvrirRetourMateriel appelé');
  console.log('📍 Location reçue:', location);
  
  if (!location || (!location.idLo && !location.id)) {
    console.error('❌ ERREUR CRITIQUE: Location invalide:', location);
    alert('Erreur: Données de location invalides');
    return;
  }
  
  const locationAvecId = {
    ...location,
    idLo: location.idLo || location.id
  };
  
  selectedLocationForAction.value = locationAvecId;
  showRetourModal.value = true;
  
  console.log('📍 Modal retour ouvert avec:', locationAvecId);
};
// 🔥 CORRECTION : Utiliser updateLocationStatus au lieu de updateReservationStatus
const handleEtatLieuxDepartSuccess = async (result) => {
  console.log('✅ État des lieux départ validé:', result);
  
  try {
    const payload = {
      newStatus: 'En cours'
    };

    // CORRECTION : Utiliser updateLocationStatus avec l'ID de location
    await LocationService.updateLocationStatus(result.locationId, payload);
    
    // Mettre à jour le statut localement
    const locationIndex = confirmedEvents.value.findIndex(
      event => event.idLo === result.locationId
    );
    
    if (locationIndex !== -1) {
      confirmedEvents.value[locationIndex].etatLo = 'En cours';
      console.log('📍 Statut mis à jour: Confirmée → En cours');
    }
    
    showEtatLieuxDepartModal.value = false;
    alert('État des lieux départ enregistré avec succès ! La location est maintenant "En cours".');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    alert('Erreur lors de la mise à jour du statut: ' + (error.response?.data?.message || error.message));
  }
};

// 🔥 CORRECTION : Même chose pour le retour
const handleRetourSuccess = async (retourData) => {
  console.log('✅ Retour validé:', retourData);
  
  try {
    const payload = {
      newStatus: 'Terminée'
    };

    // CORRECTION : Utiliser updateLocationStatus
    await LocationService.updateLocationStatus(retourData.locationId, payload);
    
    // Mettre à jour le statut localement
    const locationIndex = confirmedEvents.value.findIndex(
      event => event.idLo === retourData.locationId
    );
    
    if (locationIndex !== -1) {
      confirmedEvents.value[locationIndex].etatLo = 'Terminée';
      console.log('📍 Statut mis à jour: En cours → Terminée');
    }
    
    showRetourModal.value = false;
    alert(`Retour de matériel validé !\nLa location est maintenant "Terminée".\nStock mis à jour.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    alert('Erreur lors de la mise à jour du statut: ' + (error.response?.data?.message || error.message));
  }
};

// Dans calendrier.vue - Recherchez cette fonction
const updateReservationStatus = async (reservationId, newStatus) => {
  try {
    console.log('📍 Mise à jour statut - ID:', reservationId, 'Nouveau statut:', newStatus);
    
    // CORRECTION : Vérifiez la structure des données envoyées
    const payload = {
      newStatus: newStatus // Assurez-vous que c'est le nom exact attendu par le backend
    };

    console.log('📍 Données envoyées:', payload);
    
    const response = await LocationService.updateReservationStatus(reservationId, payload);
    
    console.log('✅ Statut mis à jour:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    
    // Afficher plus de détails sur l'erreur
    if (error.response) {
      console.error('📍 Statut HTTP:', error.response.status);
      console.error('📍 Données erreur:', error.response.data);
      console.error('📍 URL:', error.config.url);
      console.error('📍 Méthode:', error.config.method);
    }
    
    throw error;
  }
};

// 🔥 CORRECTION : Gestion améliorée du retour
/*const handleRetourSuccess = async (retourData) => {
  console.log('✅ Retour validé:', retourData);
  
  try {
    // Mettre à jour le statut via l'API
    await LocationService.updateReservationStatus(retourData.locationId, 'Terminée');
    
    // Mettre à jour le statut localement
    const locationIndex = confirmedEvents.value.findIndex(
      event => event.idLo === retourData.locationId
    );
    
    if (locationIndex !== -1) {
      confirmedEvents.value[locationIndex].etatLo = 'Terminée';
      console.log('📍 Statut mis à jour: En cours → Terminée');
      
      // 🔥 IMPORTANT : La location reste dans la liste pour l'évaluation
      // Elle sera comptée dans "Terminée" mais reste visible
    }
    
    // Fermer le modal après succès
    showRetourModal.value = false;
    
    alert(`Retour de matériel validé !\nLa location est maintenant "Terminée".\nStock mis à jour.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    alert('Erreur lors de la mise à jour du statut');
  }
};*/


const fetchConfirmedEvents = async () => {
  loadingEvents.value = true;
  try {
    console.log('🔄 Chargement DIRECT depuis la base...');
    
    // Appel DIRECT à l'API existante mais avec logging
    const response = await LocationService.getConfirmedEvents();
    
    console.log('🔍 Réponse brute:', response);
    console.log('🔍 Données:', response.data);
    
    if (response.data && Array.isArray(response.data)) {
      confirmedEvents.value = response.data;
      console.log(`✅ ${confirmedEvents.value.length} événements chargés`);
      
      // Debug: Afficher tous les IDs et statuts
      confirmedEvents.value.forEach(event => {
        console.log(`📍 Event ${event.idLo}: ${event.etatLo} - ${event.nomCli} ${event.prenomCli}`);
      });
    } else {
      console.error('❌ Format de données invalide:', response.data);
      confirmedEvents.value = [];
    }
    
  } catch (error) {
    console.error("❌ Erreur critique:", error);
    console.error("📍 Statut:", error.response?.status);
    console.error("📍 Message:", error.response?.data?.message);
  } finally {
    loadingEvents.value = false;
  }
};

// Cycle de vie
onMounted(() => {
  fetchConfirmedEvents();
});
</script>

<style scoped>
/* Les styles restent identiques */
.custom-header {
  background: linear-gradient(135deg, #04058f 0%, #02061e 100%);
  color: white;
  border-left: 4px solid #007bff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.custom-title {
  color: white;
  font-weight: 700;
  margin: 0;
}

.custom-subtitle {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.custom-divider {
  border-color: #007bff;
  opacity: 0.3;
}

/* NOUVEAU : Conteneur principal avec scroll */
.content-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

/* NOUVEAU : Scrollbar personnalisée */
.content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* NOUVEAU : Conteneur pour la table avec scroll */
.table-container {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.table-container::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

/* Cartes avec couleurs cohérentes */
.custom-card-primary {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-warning {
  background: linear-gradient(135deg, #0405BF 0%, #0405BF 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card-danger {
  background: linear-gradient(135deg, #5E5E5E 0%, #5E5E5E 100%);
  color: white;
  border: none;
  border-radius: 8px;
}

.custom-card {
  border: none;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

/* Icônes avec fond cohérent */
.custom-icon-primary, 
.custom-icon-warning,
.custom-icon-danger {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Tags */
.custom-tag {
  font-weight: 600;
}

/* Boutons cohérents */
.custom-btn-primary {
  background: #007bff;
  border-color: #007bff;
}

.custom-btn-primary:hover {
  background: #0056b3;
  border-color: #0056b3;
}

.custom-btn-warning {
  background: #0405BF;
  border-color: #0405BF;
  color: white;
}

.custom-btn-warning:hover {
  background: #0304a3;
  border-color: #0304a3;
  color: white;
}

.custom-btn-danger {
  background: #5E5E5E;
  border-color: #5E5E5E;
  color: white;
}

.custom-btn-danger:hover {
  background: #4a4a4a;
  border-color: #4a4a4a;
  color: white;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: white;
  color: white;
}

/* Table personnalisée */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #02061E;
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

.text-primary {
  color: #007bff !important;
}

.text-info {
  color: #0405BF !important;
}

.bg-primary {
  background-color: #007bff !important;
}

/* Responsive */
@media (max-width: 768px) {
  .custom-title {
    font-size: 1.4rem;
  }
  
  .custom-subtitle {
    font-size: 0.9rem;
  }
  
  .custom-header {
    padding: 1rem;
  }
  
  .custom-icon-primary, 
  .custom-icon-warning,
  .custom-icon-danger {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .custom-header .d-flex {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  /* NOUVEAU : Adaptation responsive du scroll */
  .content-wrapper {
    max-height: none;
    overflow-y: visible;
  }
  
  .table-container {
    max-height: 400px;
  }
}

/* Ajout des styles pour le menu dropdown */
:deep(.n-dropdown-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

:deep(.n-dropdown-option) {
  padding: 8px 12px;
}

:deep(.n-dropdown-option .n-dropdown-option-body) {
  align-items: center;
}

:deep(.n-dropdown-option .n-dropdown-option-body__icon) {
  margin-right: 8px;
}

/* Responsive pour le menu trois points */
@media (max-width: 768px) {
  .position-relative {
    position: absolute !important;
    top: 20px;
    right: 20px;
  }
}
</style>
