<!--<template>
  <n-modal v-model:show="showModal" preset="dialog" :mask-closable="false" style="width: 90%; max-width: 700px;">
    <template #header>
      <div class="d-flex align-items-center">
        <i class="bi bi-box-arrow-right me-2 cedii-primary"></i>
        <span>État des Lieux Départ - Location #{{ selectedLocation?.idLo || selectedLocation?.id }}</span>
      </div>
    </template>

    <div v-if="selectedLocation" class="etat-lieux-content">
      <!-- Informations de la location
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

      <!-- Liste du matériel 
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

        <!-- Message si pas de matériel 
        <div v-if="materiels.length === 0" class="text-center p-4 text-muted">
          <i class="bi bi-inbox" style="font-size: 2rem;"></i>
          <p class="mt-2 mb-0">Aucun matériel trouvé pour cette location</p>
        </div>

        <!-- Signature 
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

    <!-- Loading state
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
</style> -->

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
              <th width="120">Stock actuel</th>
              <th width="100">Quantité à louer</th>
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
                <div class="text-center">
                  <div class="fw-bold">{{ item.qteActuelStock || 0 }}</div>
                  <small v-if="item.qteTotDispo !== undefined" class="text-muted">
                    Total: {{ item.qteTotDispo }}
                  </small>
                </div>
              </td>
              <td>
                <n-input-number 
                  v-model:value="item.quantite"
                  :min="1"
                  :max="getMaxQuantite(item)"
                  :disabled="loading"
                  @update:value="validerQuantite(item)"
                />
                <div v-if="showStockWarning(item)" class="text-danger small mt-1">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Stock insuffisant
                </div>
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

        <!-- Résumé des modifications de stock -->
        <div v-if="materiels.length > 0" class="stock-summary mt-3 p-3 bg-light rounded">
          <h6 class="mb-2"><i class="bi bi-calculator me-2"></i>Résumé des modifications de stock</h6>
          <div v-for="item in materiels" :key="item.codeMat" class="small mb-1">
            <span class="fw-bold">{{ item.codeMat }}:</span> 
            Stock actuel {{ item.qteActuelStock || 0 }} - Quantité à louer {{ item.quantite }} = 
            <span :class="['fw-bold', getCalculResultColor(item)]">
              Nouveau stock: {{ calculateNewStock(item) }}
            </span>
            <span v-if="!item.isFallback" class="ms-2 text-muted">
              (En location: {{ item.qteEnLocation || 0 }} → {{ calculateNewLocation(item) }})
            </span>
          </div>
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
            :disabled="!signatureData || materiels.length === 0 || hasStockIssues()"
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
import MaterielService from '../services/MaterielService';

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
// FONCTIONS DE GESTION DU STOCK
// =============================================================================

/**
 * Charger les stocks actuels du matériel
 */
const loadCurrentStocks = async () => {
  console.log('🔄 Chargement des stocks actuels...');
  
  try {
    // Charger les informations de stock pour chaque matériel réel
    for (const item of materiels.value) {
      if (!item.isFallback && item.codeMat && !item.codeMat.startsWith('SALLE_')) {
        try {
          const response = await MaterielService.getMaterielByCode(item.codeMat);
          if (response.data) {
            const materiel = response.data;
            item.qteActuelStock = materiel.qteActuelStock || 0;
            item.qteTotDispo = materiel.qteTotDispo || 0;
            item.qteEnLocation = materiel.qteEnLocation || 0;
            
            // Mettre à jour la quantité initiale si nécessaire
            if (item.quantiteInitiale > item.qteActuelStock) {
              item.quantiteInitiale = item.qteActuelStock;
            }
            
            // Ajuster la quantité si elle dépasse le stock
            if (item.quantite > item.qteActuelStock) {
              item.quantite = item.qteActuelStock;
            }
          }
        } catch (error) {
          console.warn(`⚠️ Impossible de charger le stock pour ${item.codeMat}:`, error);
        }
      }
    }
    
    console.log('✅ Stocks chargés:', materiels.value);
  } catch (error) {
    console.error('❌ Erreur chargement stocks:', error);
  }
};

/**
 * Calculer la quantité maximale pouvant être louée
 */
const getMaxQuantite = (item) => {
  if (item.isFallback) return item.quantiteInitiale;
  
  const stockActuel = item.qteActuelStock || 0;
  const quantiteInitiale = item.quantiteInitiale || 1;
  
  // Retourner le minimum entre le stock actuel et la quantité initiale
  return Math.min(stockActuel, quantiteInitiale);
};

/**
 * Valider la quantité saisie
 */
const validerQuantite = (item) => {
  const max = getMaxQuantite(item);
  if (item.quantite > max) {
    item.quantite = max;
  }
  if (item.quantite < 1) {
    item.quantite = 1;
  }
};

/**
 * Vérifier si un avertissement de stock est nécessaire
 */
const showStockWarning = (item) => {
  if (item.isFallback) return false;
  
  const stockActuel = item.qteActuelStock || 0;
  const quantiteDemandee = item.quantite || 0;
  
  return stockActuel < quantiteDemandee;
};

/**
 * Calculer le nouveau stock après location
 */
const calculateNewStock = (item) => {
  if (item.isFallback) return item.qteActuelStock || 0;
  
  const stockActuel = item.qteActuelStock || 0;
  const quantiteLouer = item.quantite || 0;
  
  return Math.max(0, stockActuel - quantiteLouer);
};

/**
 * Calculer la nouvelle quantité en location
 */
const calculateNewLocation = (item) => {
  if (item.isFallback) return 0;
  
  const enLocation = item.qteEnLocation || 0;
  const quantiteLouer = item.quantite || 0;
  
  return enLocation + quantiteLouer;
};

/**
 * Obtenir la couleur du résultat du calcul
 */
const getCalculResultColor = (item) => {
  const nouveauStock = calculateNewStock(item);
  if (nouveauStock < 0) return 'text-danger';
  if (nouveauStock < 3) return 'text-warning';
  return 'text-success';
};

/**
 * Vérifier s'il y a des problèmes de stock
 */
const hasStockIssues = () => {
  return materiels.value.some(item => {
    if (item.isFallback) return false;
    const stockActuel = item.qteActuelStock || 0;
    const quantiteDemandee = item.quantite || 0;
    return stockActuel < quantiteDemandee;
  });
};

// =============================================================================
// GESTION DU MATÉRIEL
// =============================================================================

/**
 * Initialisation complète du matériel avec recherche multi-niveaux
 */
const initializeMateriels = async () => {
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
  materiels.value = await transformMaterialsData(materielsData);
  console.log('✅ Matériels initialisés:', materiels.value);
  
  // Charger les stocks actuels après initialisation
  await loadCurrentStocks();
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
const transformMaterialsData = async (materielsData) => {
  const transformed = [];
  
  for (const mat of materielsData) {
    const baseData = {
      id: transformed.length,
      codeMat: mat.codeMat || `ITEM_${transformed.length + 1}`,
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
      isFallback: mat.isFallback || false,
      qteActuelStock: 0,
      qteTotDispo: 0,
      qteEnLocation: 0
    };
    
    // Si ce n'est pas un fallback et a un codeMat valide, on initialise les valeurs par défaut
    if (!baseData.isFallback && baseData.codeMat && !baseData.codeMat.startsWith('SALLE_')) {
      baseData.qteActuelStock = 0; // Chargé plus tard
      baseData.qteTotDispo = 0; // Chargé plus tard
      baseData.qteEnLocation = 0; // Chargé plus tard
    }
    
    transformed.push({
      ...baseData,
      quantite: baseData.quantiteInitiale // Initialiser avec la quantité initiale
    });
  }
  
  return transformed;
};

// =============================================================================
// FONCTION POUR METTRE À JOUR LE STOCK
// =============================================================================

/**
 * Mettre à jour les quantités de stock dans la base de données
 */
const updateStockQuantities = async () => {
  console.log('🔄 Début mise à jour des stocks...');
  
  try {
    // Mettre à jour chaque matériel
    for (const item of materiels.value) {
      if (!item.isFallback && item.codeMat && !item.codeMat.startsWith('SALLE_')) {
        const quantiteLouer = item.quantite || 0;
        const ancienStock = item.qteActuelStock || 0;
        const ancienneLocation = item.qteEnLocation || 0;
        
        // Calculer les nouvelles valeurs selon votre formule
        const nouveauStock = ancienStock - quantiteLouer;
        const nouvelleLocation = ancienneLocation + quantiteLouer;
        
        console.log(`📊 Mise à jour stock pour ${item.codeMat}:`);
        console.log(`   - Ancien stock: ${ancienStock}`);
        console.log(`   - Quantité à louer: ${quantiteLouer}`);
        console.log(`   - Nouveau stock: ${nouveauStock}`);
        console.log(`   - Ancien en location: ${ancienneLocation}`);
        console.log(`   - Nouveau en location: ${nouvelleLocation}`);
        
        // Vérifier que le stock ne devient pas négatif
        if (nouveauStock < 0) {
          throw new Error(`Stock insuffisant pour ${item.codeMat}. Stock actuel: ${ancienStock}, Quantité demandée: ${quantiteLouer}`);
        }
        
        // Préparer les données de mise à jour selon votre schéma de base de données
        const updateData = {
          qteActuelStock: nouveauStock,
          qteEnLocation: nouvelleLocation
          // Note: qteTotDispo reste le même car c'est le total disponible initial
        };
        
        console.log('📤 Données envoyées à l\'API:', updateData);
        
        // Appel à l'API pour mettre à jour le matériel
        const response = await MaterielService.updateMaterielStock(item.codeMat, updateData);
        
        if (response && response.success) {
          console.log(`✅ Stock mis à jour pour ${item.codeMat}`);
        } else {
          console.error(`❌ Échec mise à jour stock pour ${item.codeMat}:`, response);
          throw new Error(`Échec mise à jour du stock pour ${item.codeMat}`);
        }
      }
    }
    
    console.log('✅ Tous les stocks ont été mis à jour');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur mise à jour des stocks:', error);
    throw error;
  }
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
 * Validation du départ avec mise à jour du stock
 */
const validerDepart = async () => {
  console.log('🔄 Début validerDepart avec mise à jour stock');
  
  loading.value = true;
  try {
    const locationToUse = selectedLocation.value || props.location;
    
    if (!locationToUse?.idLo && !locationToUse?.id) {
      throw new Error('ID de location non défini');
    }

    const locationId = locationToUse.idLo || locationToUse.id;
    
    // 1. Mettre à jour les stocks dans la base de données
    await updateStockQuantities();
    
    // 2. Préparer les données de l'état des lieux
    const etatLieuxData = {
      mode: 'depart',
      details: materiels.value.map(item => ({
        idMat: item.codeMat,
        qteMat: item.quantite,
        etatInitial: item.etatInitial,
        observations: item.observations,
        isFallback: item.isFallback || false,
        nouveauStock: calculateNewStock(item),
        nouvelleLocation: calculateNewLocation(item)
      })),
      signature: signatureData.value
    };

    console.log('📍 Données état des lieux:', etatLieuxData);

    // 3. Appel à l'API pour l'état des lieux
    await LocationService.submitEtatLieux(locationId, etatLieuxData);
    
    // 4. Émettre l'événement de succès
    emit('depart-success', {
      locationId: locationId,
      materiels: materiels.value,
      nouveauStatut: 'En cours',
      hasFallbackItems: materiels.value.some(item => item.isFallback),
      stocksUpdated: materiels.value
        .filter(item => !item.isFallback && item.codeMat && !item.codeMat.startsWith('SALLE_'))
        .map(item => ({
          codeMat: item.codeMat,
          ancienStock: item.qteActuelStock,
          quantiteLouer: item.quantite,
          nouveauStock: calculateNewStock(item),
          nouvelleLocation: calculateNewLocation(item)
        }))
    });
    
    console.log('✅ Départ validé avec succès et stocks mis à jour');
    
    // Message de confirmation
    let message = '✅ Départ validé avec succès!\n\n';
    const materielUpdates = materiels.value
      .filter(item => !item.isFallback && item.codeMat && !item.codeMat.startsWith('SALLE_'));
    
    if (materielUpdates.length > 0) {
      message += '📊 Stocks mis à jour:\n';
      materielUpdates.forEach(item => {
        message += `• ${item.codeMat}:\n`;
        message += `  Stock: ${item.qteActuelStock} → ${calculateNewStock(item)} (-${item.quantite})\n`;
        message += `  En location: ${item.qteEnLocation} → ${calculateNewLocation(item)} (+${item.quantite})\n\n`;
      });
    }
    
    if (materiels.value.some(item => item.isFallback)) {
      message += '📝 Note: Certains éléments ont été créés automatiquement.';
    }
    
    alert(message);
    
    // 5. Recharger les stocks pour vérification
    await loadCurrentStocks();
    
    // Fermer le modal après un délai
    setTimeout(() => {
      showModal.value = false;
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erreur validation départ:', error);
    
    let errorMessage = error.message;
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    alert(`❌ Erreur lors de la validation du départ:\n\n${errorMessage}`);
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

.stock-summary {
  border-left: 4px solid #007bff;
  font-family: 'Courier New', monospace;
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

/* Style pour les messages d'avertissement */
.text-danger.small {
  font-size: 0.75rem;
}

/* Style pour les calculs */
.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>