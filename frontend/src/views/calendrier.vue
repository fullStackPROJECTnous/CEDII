<template>
  <div class="container-fluid py-4">
    <!-- Header avec navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <router-link to="/dashboardReception" class="btn btn-sm custom-btn-outline">
            <i class="bi bi-arrow-left me-2"></i>Retour à l'Accueil
          </router-link>
        </div>
      </div>
    </div>

    <hr class="my-4 custom-divider">

    <!-- Cartes de statistiques -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3">
              <i class="bi bi-calendar-check text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Événements Confirmés</h6>
              <h4 class="mb-0 text-primary">{{ confirmedEvents.length }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #067186;">
              <i class="bi bi-clock-history text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">En Cours</h6>
              <h4 class="mb-0 text-info">{{ enCoursCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>
      
      <div class="col-md-4 mb-3">
        <n-card class="custom-card h-100" size="small">
          <div class="d-flex align-items-center">
            <div class="custom-icon-container me-3" style="background-color: #55555E;">
              <i class="bi bi-check-circle text-white"></i>
            </div>
            <div>
              <h6 class="mb-1">Terminés</h6>
              <h4 class="mb-0 text-secondary">{{ completedCount }}</h4>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- Tableau des locations et réservations -->
    <n-card class="custom-card shadow-lg" title="Vue d'ensemble des Locations et Réservations">
      <template #header-extra>
        <n-button type="primary" size="small" @click="fetchConfirmedEvents">
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

        <!-- Data Table -->
        <div v-else>
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

    <!-- Détails des données (collapsible) -->
    <n-collapse class="mt-4" :default-expanded-names="[]">
      <n-collapse-item title="Détails techniques des données" name="1">
        <n-alert type="info" class="mb-0">
          <template #icon>
            <i class="bi bi-info-circle"></i>
          </template>
          <div class="mb-2">Format des données chargées :</div>
          <pre class="bg-light p-3 rounded small">{{ JSON.stringify(formattedCalendarEvents[0], null, 2) }}</pre>
        </n-alert>
      </n-collapse-item>
    </n-collapse>

    <!-- 🔥 CORRECTION : Utiliser EtatLieu au lieu de RetourMaterielModal -->
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
  NTag 
} from 'naive-ui';
import LocationService from '../services/LocationService';
import EtatLieu from './etatLieu.vue';
import EtatLieuDepart from './etatLieuDepart.vue';

// Variables réactives
const confirmedEvents = ref([]);
const loadingEvents = ref(true);

// Variables pour les modals
const showEtatLieuxDepartModal = ref(false);
const showRetourModal = ref(false);
const selectedLocationForAction = ref(null);

// Computed properties
const formattedCalendarEvents = computed(() => {
  return confirmedEvents.value.map(event => ({
    id: event.idLo,
    title: `${event.typeLo} - ${event.reservation?.client ? event.reservation.client.nomCli : 'N/A'}`,
    start: event.debLo,
    end: event.finLo,
    classNames: ['bg-primary']
  }));
});

const tableData = computed(() => {
  return confirmedEvents.value.map(event => {
    console.log('🔍 Traitement event:', event.idLo, event);
    
    let clientName = 'N/A';
    
    if (event.client && (event.client.nomCli || event.client.prenomCli)) {
      clientName = `${event.client.nomCli || ''} ${event.client.prenomCli || ''}`.trim();
    }
    else if (event.reservation?.client && (event.reservation.client.nomCli || event.reservation.client.prenomCli)) {
      clientName = `${event.reservation.client.nomCli || ''} ${event.reservation.client.prenomCli || ''}`.trim();
    }

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
      materiel: event.reservation?.codeMat || event.codeMat || 'N/A',
      salle: event.reservation?.idSalle || event.idSalle || 'N/A',
      
      // Données complètes pour les actions
      _original: event,
      reservation: event.reservation,
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

const pendingCount = computed(() => {
  return confirmedEvents.value.filter(event => event.etatLo === 'En attente').length;
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
      size: 'small'
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
        size: 'small'
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

const handleEtatLieuxDepartSuccess = (result) => {
  console.log('✅ État des lieux départ validé:', result);
  
  // Mettre à jour le statut de la location dans la liste
  const locationIndex = confirmedEvents.value.findIndex(
    event => event.idLo === result.locationId
  );
  
  if (locationIndex !== -1) {
    confirmedEvents.value[locationIndex].etatLo = 'En cours';
    console.log('📍 Statut mis à jour: Confirmée → En cours');
  }
  
  // Fermer le modal après succès
  showEtatLieuxDepartModal.value = false;
  
  alert('État des lieux départ enregistré avec succès ! La location est maintenant "En cours".');
};

const handleRetourSuccess = (retourData) => {
  console.log('✅ Retour validé:', retourData);
  
  // Mettre à jour le statut de la location dans la liste
  const locationIndex = confirmedEvents.value.findIndex(
    event => event.idLo === retourData.locationId
  );
  
  if (locationIndex !== -1) {
    confirmedEvents.value[locationIndex].etatLo = 'Terminée';
    console.log('📍 Statut mis à jour: En cours → Terminée');
    
    // Optionnel - Supprimer de la liste après un délai
    setTimeout(() => {
      confirmedEvents.value = confirmedEvents.value.filter(
        event => event.idLo !== retourData.locationId
      );
      console.log('📍 Location terminée retirée de la liste');
    }, 2000);
  }
  
  // Fermer le modal après succès
  showRetourModal.value = false;
  
  alert(`Retour de matériel validé !\nLa location est maintenant "Terminée".\nStock mis à jour.`);
};

const fetchConfirmedEvents = async () => {
  loadingEvents.value = true;
  try {
    const response = await LocationService.getConfirmedEvents();
    confirmedEvents.value = response.data;
    
    console.log('Événements chargés:', response.data);
    if (response.data.length > 0) {
      console.log('Premier événement complet:', response.data[0]);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des événements confirmés:", error);
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
/* Votre CSS existant */
:root {
  --cedii-primary: #5811EE;
  --cedii-primary-dark: #04058F;
  --cedii-dark: #02061E;
  --cedii-info: #067186;
  --cedii-secondary: #55555E;
}

.custom-btn-outline {
  border-color: var(--cedii-primary);
  color: var(--cedii-primary);
  transition: all 0.3s ease;
}

.custom-btn-outline:hover {
  background-color: var(--cedii-primary);
  color: white;
}

.custom-divider {
  border-color: var(--cedii-info);
  opacity: 0.3;
}

.custom-card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}

.custom-icon-container {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--cedii-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.custom-table {
  --n-border-color: #f0f0f0;
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-data-table-th) {
  background-color: #f8f9fa;
  font-weight: 600;
  color: var(--cedii-dark);
}

:deep(.n-data-table-td) {
  border-bottom: 1px solid #f0f0f0;
}

.text-primary {
  color: var(--cedii-primary) !important;
}

.text-info {
  color: var(--cedii-info) !important;
}

.bg-primary {
  background-color: var(--cedii-primary) !important;
}
</style>