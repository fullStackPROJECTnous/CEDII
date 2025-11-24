<template>
  <n-modal v-model:show="showModal" preset="dialog" :mask-closable="false" style="width: 90%; max-width: 700px;">
    <template #header>
      <div class="d-flex align-items-center">
        <i class="bi bi-box-arrow-right me-2 cedii-primary"></i>
        <span>État des Lieux Départ - Location #{{ selectedLocation?.idLo || selectedLocation?.id }}</span>
      </div>
    </template>

    <div v-if="selectedLocation" class="etat-lieux-content">
      <!-- Informations de la location -->
      <n-card title="Détails de la location" size="small" class="mb-3">
        <div class="row">
          <div class="col-md-6">
            <strong>Client:</strong> {{ getClientName(selectedLocation) }}<br>
            <strong>Type:</strong> {{ getLocationType(selectedLocation) }}<br>
            <strong>Début:</strong> {{ formatDate(selectedLocation.debLo || selectedLocation.dateDebut) }}<br>
          </div>
          <div class="col-md-6">
            <strong>Référence:</strong> #{{ selectedLocation.idLo || selectedLocation.id }}<br>
            <strong>Fin prévue:</strong> {{ formatDate(selectedLocation.finLo || selectedLocation.dateFin) }}<br>
            <strong>Statut actuel:</strong> 
            <n-tag :type="getStatutTagType(selectedLocation.etatLo || selectedLocation.statut)" size="small">
              {{ selectedLocation.etatLo || selectedLocation.statut }}
            </n-tag>
          </div>
        </div>
      </n-card>

      <!-- Liste du matériel -->
      <n-card title="Inventaire Départ" size="small">
        <template #header-extra>
          <n-button size="tiny" @click="debugLocationStructure(selectedLocation)" type="warning">
            <i class="bi bi-bug me-1"></i>Debug
          </n-button>
        </template>

        <n-table :bordered="true" :single-line="false">
          <thead>
            <tr>
              <th>Matériel</th>
              <th width="100">Quantité</th>
              <th width="120">État Initial</th>
              <th width="150">Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in materiels" :key="index">
              <td>
                <strong>{{ item.designation || 'Matériel non spécifié' }}</strong>
                <br>
                <small class="text-muted">Code: {{ item.codeMat || 'N/A' }}</small>
                <n-tag v-if="item.isFallback" size="tiny" type="warning" class="ms-1">
                  auto
                </n-tag>
              </td>
              <td>
                <n-input-number 
                  v-model:value="item.quantite"
                  :min="1"
                  :max="item.quantiteInitiale"
                  :disabled="loading"
                />
              </td>
              <td>
                <n-select
                  v-model:value="item.etatInitial"
                  :options="etatOptions"
                  placeholder="État"
                  :disabled="loading"
                />
              </td>
              <td>
                <n-input
                  v-model:value="item.observations"
                  type="textarea"
                  placeholder="Observations..."
                  :rows="2"
                  :disabled="loading"
                />
              </td>
            </tr>
          </tbody>
        </n-table>

        <!-- Message si pas de matériel -->
        <div v-if="materiels.length === 0" class="text-center p-4 text-muted">
          <i class="bi bi-inbox" style="font-size: 2rem;"></i>
          <p class="mt-2 mb-0">Aucun matériel trouvé pour cette location</p>
        </div>

        <!-- Signature -->
        <n-form-item label="Signature du client" class="mt-3">
          <div class="signature-container border rounded p-3 text-center">
            <p class="text-muted mb-2">Espace pour signature du client</p>
            <n-button type="dashed" @click="simulerSignature" :disabled="loading">
              <i class="bi bi-pen me-2"></i>Simuler la signature
            </n-button>
            <div v-if="signatureData" class="mt-2">
              <n-tag type="success">Signature enregistrée - {{ signatureData.nom }} - {{ formatDate(signatureData.date) }}</n-tag>
            </div>
          </div>
        </n-form-item>
      </n-card>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center p-5">
      <n-spin size="large">
        <template #description>
          Chargement des données...
        </template>
      </n-spin>
    </div>

    <template #action>
      <div class="d-flex justify-content-between w-100">
        <div>
          <n-button 
            @click="genererContratDepart" 
            type="info" 
            :loading="loading" 
            :disabled="materiels.length === 0"
          >
            <i class="bi bi-file-pdf me-2"></i>Générer PDF
          </n-button>
        </div>
        <div class="d-flex gap-2">
          <n-button @click="showModal = false" :disabled="loading">
            Annuler
          </n-button>
          <n-button 
            type="primary" 
            @click="validerDepart" 
            :loading="loading"
            :disabled="!signatureData || materiels.length === 0"
          >
            <i class="bi bi-check-circle me-2"></i>
            Valider le départ
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { 
  NModal, NButton, NCard, NForm, NFormItem, NInput, NInputNumber, 
  NSelect, NTable, NTag, NSpin 
} from 'naive-ui';
import LocationService from '../services/LocationService';

// Props et emits
const props = defineProps({
  show: Boolean,
  location: Object
});

const emit = defineEmits(['update:show', 'depart-success']);

// Références
const showModal = ref(false);
const selectedLocation = ref(null);
const loading = ref(false);
const signatureData = ref(null);
const materiels = ref([]);

// Options pour l'état du matériel
const etatOptions = [
  { label: '✅ Bon état', value: 'Bon' },
  { label: '⚠️ Usure normale', value: 'Usure' },
  { label: '🔧 Maintenance nécessaire', value: 'Maintenance' },
  { label: '❌ Détérioré', value: 'Deteriore' }
];

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

/**
 * Fonction utilitaire pour accéder aux propriétés imbriquées
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Debug complet de la structure des données
 */
const debugLocationStructure = (location) => {
  console.log('🔍 === DEBUG COMPLET DE LA STRUCTURE LOCATION ===');
  console.log('📍 Location object:', location);
  
  const pathsToCheck = [
    'reservation.materiels',
    'reservation.materiel', 
    '_original.reservation.materiels',
    '_original.reservation.materiel',
    'reservation.codeMat',
    '_original.reservation.codeMat',
    'reservation.idSalle',
    '_original.reservation.idSalle',
    'reservation.qteMat',
    '_original.reservation.qteMat',
    'materiel',
    'salle',
    'codeMat',
    'idSalle',
    'qteMat'
  ];
  
  pathsToCheck.forEach(path => {
    const value = getNestedValue(location, path);
    console.log(`📁 ${path}:`, value);
  });
  
  console.log('🔍 === FIN DEBUG ===');
};

/**
 * Formatage de date robuste
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Date non spécifiée';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('❌ Date invalide:', dateString);
      return 'Date invalide';
    }
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('❌ Erreur formatage date:', error, dateString);
    return 'Erreur date';
  }
};

// =============================================================================
// FONCTIONS D'AFFICHAGE DES DONNÉES
// =============================================================================

/**
 * Récupération du nom du client
 */
const getClientName = (location) => {
  console.log('🔍 Recherche nom client dans modal:', location);
  
  if (location.client && typeof location.client === 'string') {
    return location.client;
  }
  
  if (location._original?.client) {
    return location._original.client;
  }
  
  if (location.reservation?.client) {
    const client = location.reservation.client;
    return `${client.nomCli || ''} ${client.prenomCli || ''}`.trim();
  }
  
  if (location._original?.reservation?.client) {
    const client = location._original.reservation.client;
    return `${client.nomCli || ''} ${client.prenomCli || ''}`.trim();
  }
  
  return 'Client non spécifié';
};

/**
 * Récupération du type de location
 */
const getLocationType = (location) => {
  console.log('🔍 Recherche type location:', location);
  
  const type = location.typeLo || location.type || location._original?.typeLo;
  
  if (type) {
    return type;
  }
  
  // Déduire le type basé sur les données disponibles
  if (location.materiel || location.reservation?.materiel || location._original?.materiel) {
    return 'Matériel';
  }
  
  if (location.salle || location.reservation?.salle || location._original?.salle) {
    return 'Salle';
  }
  
  return 'Non spécifié';
};

/**
 * Couleur du tag selon le statut
 */
const getStatutTagType = (statut) => {
  const typeMap = {
    'Confirmée': 'success',
    'En cours': 'warning', 
    'Terminée': 'default',
    'En attente': 'info'
  };
  return typeMap[statut] || 'default';
};

// =============================================================================
// GESTION DU MATÉRIEL
// =============================================================================

/**
 * Initialisation complète du matériel avec recherche multi-niveaux
 */
const initializeMateriels = () => {
  if (!selectedLocation.value) {
    console.warn('📍 Aucune location sélectionnée');
    materiels.value = [];
    return;
  }
  
  console.log('🔄 Initialisation matériel...');
  const location = selectedLocation.value;
  let materielsData = [];
  
  // STRATÉGIE 1: Recherche de matériels structurés
  materielsData = findStructuredMaterials(location);
  
  // STRATÉGIE 2: Création à partir des codes
  if (materielsData.length === 0) {
    console.log('🔍 Aucun matériel structuré trouvé, recherche par codes...');
    materielsData = createMaterialsFromCodes(location);
  }
  
  // STRATÉGIE 3: Fallback - création d'un matériel par défaut
  if (materielsData.length === 0) {
    console.log('⚠️  Aucune donnée matériel trouvée, création fallback');
    materielsData = createFallbackMaterial(location);
  }
  
  console.log('🔍 Données matériel finales:', materielsData);
  
  // Transformation pour l'affichage
  materiels.value = transformMaterialsData(materielsData);
  console.log('✅ Matériels initialisés:', materiels.value);
};

/**
 * Recherche de matériels dans les structures imbriquées
 */
const findStructuredMaterials = (location) => {
  const structures = [
    { path: 'reservation.materiels', type: 'array' },
    { path: '_original.reservation.materiels', type: 'array' },
    { path: 'reservation.materiel', type: 'object' },
    { path: '_original.reservation.materiel', type: 'object' }
  ];
  
  for (const struct of structures) {
    const value = getNestedValue(location, struct.path);
    if (value) {
      console.log(`✅ Matériels trouvés dans: ${struct.path}`);
      return struct.type === 'array' ? value : [value];
    }
  }
  
  return [];
};

/**
 * Création de matériel à partir des codes
 */
const createMaterialsFromCodes = (location) => {
  const codeMat = location.reservation?.codeMat || 
                 location._original?.reservation?.codeMat ||
                 location.codeMat;
  
  const idSalle = location.reservation?.idSalle ||
                 location._original?.reservation?.idSalle ||
                 location.idSalle;
  
  console.log('🔍 Code matériel trouvé:', codeMat);
  console.log('🔍 ID salle trouvé:', idSalle);
  
  if (codeMat) {
    return [{
      codeMat: codeMat,
      designation: `Matériel ${codeMat}`,
      quantiteInitiale: location.reservation?.qteMat || 
                       location._original?.reservation?.qteMat || 
                       location.qteMat || 
                       1
    }];
  }
  
  if (idSalle) {
    return [{
      codeMat: `SALLE_${idSalle}`,
      designation: `Salle ${idSalle}`,
      quantiteInitiale: 1
    }];
  }
  
  return [];
};

/**
 * Création d'un matériel fallback
 */
const createFallbackMaterial = (location) => {
  const locationType = getLocationType(location);
  const locationId = location.idLo || location.id;
  
  return [{
    codeMat: `LOC_${locationId}`,
    designation: `${locationType} Location #${locationId}`,
    quantiteInitiale: 1,
    isFallback: true
  }];
};

/**
 * Transformation des données matériel pour l'affichage
 */
const transformMaterialsData = (materielsData) => {
  return materielsData.map((mat, index) => {
    const baseData = {
      id: index,
      codeMat: mat.codeMat || `ITEM_${index + 1}`,
      designation: mat.designation || 
                  mat.designationMat || 
                  mat.nomMat || 
                  'Élément de location',
      quantiteInitiale: mat.quantiteInitiale || 
                       mat.qteMat || 
                       mat.quantite || 
                       1,
      etatInitial: 'Bon',
      observations: '',
      isFallback: mat.isFallback || false
    };
    
    return {
      ...baseData,
      quantite: baseData.quantiteInitiale
    };
  });
};

// =============================================================================
// ACTIONS UTILISATEUR
// =============================================================================

/**
 * Simulation de signature
 */
const simulerSignature = () => {
  signatureData.value = {
    nom: getClientName(selectedLocation.value),
    date: new Date().toISOString(),
    type: 'digitale'
  };
  console.log('✅ Signature simulée:', signatureData.value);
};

/**
 * Génération du contrat PDF
 */
const genererContratDepart = async () => {
  console.log('📄 Génération PDF départ:', { 
    location: selectedLocation.value,
    materiels: materiels.value, 
    signature: signatureData.value 
  });
  
  // Implémentez la génération PDF ici
  alert('Fonctionnalité PDF à implémenter');
};

/**
 * Validation du départ
 */
const validerDepart = async () => {
  console.log('🔄 Début validerDepart');
  
  loading.value = true;
  try {
    const locationToUse = selectedLocation.value || props.location;
    
    if (!locationToUse?.idLo && !locationToUse?.id) {
      throw new Error('ID de location non défini');
    }

    const locationId = locationToUse.idLo || locationToUse.id;
    
    // Préparer les données avec gestion du fallback
    const etatLieuxData = {
      mode: 'depart',
      details: materiels.value.map(item => ({
        idMat: item.codeMat,
        qteMat: item.quantite,
        etatInitial: item.etatInitial,
        observations: item.observations,
        isFallback: item.isFallback || false
      })),
      signature: signatureData.value
    };

    console.log('📍 Données complètes envoyées:', etatLieuxData);

    // Appel à l'API
    await LocationService.submitEtatLieux(locationId, etatLieuxData);
    
    // Émettre l'événement de succès
    emit('depart-success', {
      locationId: locationId,
      materiels: materiels.value,
      nouveauStatut: 'En cours',
      hasFallbackItems: materiels.value.some(item => item.isFallback)
    });
    
    console.log('✅ Départ validé avec succès');
    
    // Message adapté selon le type de matériel
    if (materiels.value.some(item => item.isFallback)) {
      alert('Départ validé! Note: Certains éléments ont été créés automatiquement.');
    } else {
      alert('Départ validé avec succès!');
    }
    
    // Fermer le modal après un délai
    setTimeout(() => {
      showModal.value = false;
    }, 1500);
    
  } catch (error) {
    console.error('❌ Erreur validation départ:', error);
    alert(`Erreur lors de la validation du départ: ${error.response?.data?.message || error.message}`);
  } finally {
    loading.value = false;
  }
};

// =============================================================================
// WATCHERS ET CYCLE DE VIE
// =============================================================================

// Surveillance de l'état du modal
watch(showModal, (newVal) => {
  console.log('🔄 showModal changé:', newVal);
  
  if (newVal && props.location) {
    console.log('📍 Initialisation modal avec location:', props.location);
    selectedLocation.value = props.location;
    initializeMateriels();
    signatureData.value = null;
  } else {
    selectedLocation.value = null;
    materiels.value = [];
    signatureData.value = null;
  }
  emit('update:show', newVal);
});

// Synchronisation avec la prop show
watch(() => props.show, (newVal) => {
  console.log('🔄 props.show changé:', newVal);
  showModal.value = newVal;
});

// Surveillance des changements de location
watch(() => props.location, (newLocation) => {
  if (newLocation && showModal.value) {
    console.log('📍 Location props mise à jour:', newLocation);
    selectedLocation.value = newLocation;
    initializeMateriels();
  }
}, { immediate: true });
</script>

<style scoped>
.etat-lieux-content {
  max-height: 70vh;
  overflow-y: auto;
}

.signature-container {
  min-height: 120px;
  background-color: #f8f9fa;
}

:deep(.n-table th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

:deep(.n-table td) {
  vertical-align: top;
  padding: 8px;
}

.cedii-primary {
  color: #04058f;
}

/* Style pour les tags fallback */
:deep(.n-tag--warning) {
  font-size: 0.7rem;
  padding: 1px 4px;
}
</style>