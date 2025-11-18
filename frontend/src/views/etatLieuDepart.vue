<template>
  <n-modal v-model:show="showModal" preset="dialog" :mask-closable="false" style="width: 90%; max-width: 700px;">
    <template #header>
      <div class="d-flex align-items-center">
        <i class="bi bi-box-arrow-right me-2 cedii-primary"></i>
        <span>État des Lieux Départ - Location #{{ selectedLocation?.idLo }}</span>
      </div>
    </template>

    <div v-if="selectedLocation" class="etat-lieux-content">
      <!-- Informations de la location -->
      <n-card title="Détails de la location" size="small" class="mb-3">
        <div class="row">
          <div class="col-md-6">
            <strong>Client:</strong> {{ selectedLocation.client }}<br>
            <strong>Type:</strong> {{ selectedLocation.typeLo }}<br>
            <strong>Début:</strong> {{ formatDate(selectedLocation.debLo) }}<br>
          </div>
          <div class="col-md-6">
            <strong>Référence:</strong> #{{ selectedLocation.idLo }}<br>
            <strong>Fin prévue:</strong> {{ formatDate(selectedLocation.finLo) }}<br>
            <strong>Statut actuel:</strong> 
            <n-tag :type="getStatutTagType(selectedLocation.statut)" size="small">
              {{ selectedLocation.statut }}
            </n-tag>
          </div>
        </div>
      </n-card>

      <!-- Liste du matériel -->
      <n-card title="Inventaire Départ" size="small">
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
                <strong>{{ item.designation }}</strong>
                <br>
                <small class="text-muted">Code: {{ item.codeMat }}</small>
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

        <!-- Signature -->
        <n-form-item label="Signature du client" class="mt-3">
          <div class="signature-container border rounded p-3 text-center">
            <p class="text-muted mb-2">Espace pour signature du client</p>
            <n-button type="dashed" @click="simulerSignature">
              <i class="bi bi-pen me-2"></i>Simuler la signature
            </n-button>
            <div v-if="signatureData" class="mt-2">
              <n-tag type="success">Signature enregistrée</n-tag>
            </div>
          </div>
        </n-form-item>
      </n-card>
    </div>

    <template #action>
      <div class="d-flex justify-content-between w-100">
        <div>
          <n-button @click="genererContratDepart" type="info" :loading="loading">
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
            :disabled="!signatureData"
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
  NSelect, NTable, NTag 
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
  { label: '🔧 Maintenance nécessaire', value: 'Maintenance' }
];

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const getStatutTagType = (statut) => {
  const typeMap = {
    'Confirmée': 'success',
    'En cours': 'warning', 
    'Terminée': 'default',
    'En attente': 'info'
  };
  return typeMap[statut] || 'default';
};

const initializeMateriels = () => {
  if (!selectedLocation.value) return;
  
  const locationMateriels = selectedLocation.value.reservation?.materiels || 
                           [{
                             codeMat: selectedLocation.value.reservation?.codeMat,
                             designation: selectedLocation.value.reservation?.materiel?.designationMat || 'Matériel principal',
                             quantiteInitiale: selectedLocation.value.qteMat || 1,
                             quantite: selectedLocation.value.qteMat || 1,
                             etatInitial: 'Bon',
                             observations: ''
                           }];
  
  materiels.value = locationMateriels.map(mat => ({
    codeMat: mat.codeMat,
    designation: mat.designation,
    quantiteInitiale: mat.quantiteInitiale || mat.qteMat || 1,
    quantite: mat.quantiteInitiale || mat.qteMat || 1,
    etatInitial: 'Bon',
    observations: ''
  }));
};

const simulerSignature = () => {
  signatureData.value = {
    nom: 'Client',
    date: new Date().toISOString(),
    type: 'digitale'
  };
};

const genererContratDepart = async () => {
  console.log('Génération PDF départ:', { materiels: materiels.value, signature: signatureData.value });
};

const validerDepart = async () => {
  console.log('🔄 Début validerDepart');
  
  loading.value = true;
  try {
    const locationToUse = selectedLocation.value || props.location;
    
    console.log('📍 Location à utiliser:', locationToUse);
    console.log('📍 ID disponible:', locationToUse?.idLo);
    
    if (!locationToUse?.idLo) {
      throw new Error('ID de location non défini');
    }

    const etatLieuxData = {
      mode: 'depart',
      details: materiels.value.map(item => ({
        idMat: item.codeMat,
        qteMat: item.quantite,
        etatInitial: item.etatInitial,
        observations: item.observations
      })),
      signature: signatureData.value
    };

    console.log('📍 Données envoyées:', etatLieuxData);

    await LocationService.submitEtatLieux(locationToUse.idLo, etatLieuxData);
    
    // 🔥 CORRECTION: Ne pas fermer le modal immédiatement, juste émettre l'événement
    emit('depart-success', {
      locationId: locationToUse.idLo,
      materiels: materiels.value,
      nouveauStatut: 'En cours' // 🔥 Indiquer le nouveau statut
    });
    
    // 🔥 CORRECTION: Afficher message de succès mais garder le modal ouvert
    console.log('✅ Départ validé avec succès - Statut changé à "En cours"');
    
  } catch (error) {
    console.error('❌ Erreur validation départ:', error);
    alert(`Erreur lors de la validation du départ: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Watchers
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
  }
  emit('update:show', newVal);
});

watch(() => props.show, (newVal) => {
  showModal.value = newVal;
});
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
</style>