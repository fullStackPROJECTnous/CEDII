<template>
  <n-modal v-model:show="showModal" preset="dialog" :mask-closable="false" style="width: 90%; max-width: 800px;">
    <template #header>
      <div class="d-flex align-items-center">
        <i class="bi bi-box-arrow-in-left me-2 cedii-primary"></i>
        <span>Retour de Matériel - Location #{{ selectedLocation?.idLo }}</span>
      </div>
    </template>

    <div v-if="selectedLocation" class="retour-materiel-content">
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
            <strong>Retard:</strong> 
            <n-tag :type="joursRetard > 0 ? 'error' : 'success'" size="small">
              {{ joursRetard }} jour(s)
            </n-tag>
          </div>
        </div>
      </n-card>

      <!-- Liste du matériel à retourner -->
      <n-card title="État des lieux - Retour" size="small">
        <n-form ref="formRef" :model="formData" :rules="rules">
          <n-table :bordered="true" :single-line="false" class="mb-3">
            <thead>
              <tr>
                <th>Matériel</th>
                <th width="100">Quantité</th>
                <th width="120">État</th>
                <th width="150">Dommages</th>
                <th width="120">Coût réparation</th>
                <th width="100">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in formData.materiels" :key="index">
                <td>
                  <strong>{{ item.designation }}</strong>
                  <br>
                  <small class="text-muted">Code: {{ item.codeMat }}</small>
                </td>
                <td>
                  <n-input-number 
                    v-model:value="item.quantiteRetournee"
                    :min="0"
                    :max="item.quantiteInitiale"
                    :disabled="loading"
                  />
                </td>
                <td>
                  <n-select
                    v-model:value="item.etat"
                    :options="etatOptions"
                    placeholder="État"
                    :disabled="loading"
                  />
                </td>
                <td>
                  <n-input
                    v-model:value="item.dommageDescription"
                    type="textarea"
                    placeholder="Description des dommages..."
                    :rows="2"
                    :disabled="loading || item.etat !== 'Endommagé'"
                  />
                </td>
                <td>
                  <n-input-number
                    v-model:value="item.coutReparation"
                    :min="0"
                    :disabled="loading || item.etat !== 'Endommagé'"
                    placeholder="0"
                  >
                    <template #suffix>Ar</template>
                  </n-input-number>
                </td>
                <td>
                  <n-button
                    type="error"
                    size="small"
                    @click="removeMateriel(index)"
                    :disabled="loading || formData.materiels.length <= 1"
                  >
                    <i class="bi bi-trash"></i>
                  </n-button>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-form>
>

        <!-- Observations générales -->
        <n-form-item label="Observations générales" class="mb-0">
          <n-input
            v-model:value="formData.observations"
            type="textarea"
            :rows="3"
            placeholder="Notes supplémentaires sur l'état de retour..."
            :disabled="loading"
          />
        </n-form-item>
      </n-card>

      <!-- Résumé et pénalités -->
      <n-card v-if="hasDommages" title="Résumé des dommages et pénalités" size="small" class="mt-3">
        <div class="row">
          <div class="col-md-6">
            <strong>Matériels endommagés:</strong> {{ materielsEndommagesCount }}<br>
            <strong>Coût total réparation:</strong> {{ formatPrix(coutTotalReparation) }}<br>
          </div>
          <div class="col-md-6">
            <strong>Pénalité de retard:</strong> {{ formatPrix(penaliteRetard) }}<br>
            <strong class="text-primary">Montant total dû:</strong> {{ formatPrix(montantTotalDu) }}<br>
          </div>
        </div>
      </n-card>
    </div>

    <template #action>
      <div class="d-flex justify-content-between w-100">
        <div>
          <n-button @click="genererContratRetour" type="info" :loading="loading">
            <i class="bi bi-file-pdf me-2"></i>Générer PDF
          </n-button>
        </div>
        <div class="d-flex gap-2">
          <n-button @click="showModal = false" :disabled="loading">
            Annuler
          </n-button>
          <n-button 
            type="primary" 
            @click="validerRetour" 
            :loading="loading"
            :disabled="!isFormValid"
          >
            <i class="bi bi-check-circle me-2"></i>
            Valider le retour ({{ formatPrix(montantTotalDu) }})
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>
Donc : c’est un processus (processus de gestion des déclarations fiscales).


<script setup>
import { ref, computed, watch } from 'vue';
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

const emit = defineEmits(['update:show', 'retour-success']);

// Références
const showModal = ref(false);
const selectedLocation = ref(null);
const loading = ref(false);
const formRef = ref(null);

// Données du formulaire
const formData = ref({
  materiels: [],
  observations: '',
  dateRetour: new Date()
});

// Options pour l'état du matériel
const etatOptions = [
  { label: '✅ Bon état', value: 'Bon' },
  { label: '⚠️ Usure normale', value: 'Usure' },
  { label: '❌ Endommagé', value: 'Endommagé' },
  { label: '🔧 Maintenance', value: 'Maintenance' },
  { label: '💀 Hors service', value: 'HorsService' }
];

// Règles de validation
const rules = {
  materiels: {
    validator: (rule, value) => {
      return value.every(item => 
        item.quantiteRetournee > 0 && 
        item.etat && 
        (item.etat !== 'Endommagé' || item.dommageDescription)
      );
    },
    message: 'Veuillez remplir tous les champs obligatoires',
    trigger: ['blur', 'change']
  }
};

// Computed properties
const joursRetard = computed(() => {
  if (!selectedLocation.value) return 0;
  const finPrevue = new Date(selectedLocation.value.finLo);
  const aujourdhui = new Date();
  const diff = aujourdhui - finPrevue;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
});

const penaliteRetard = computed(() => {
  return joursRetard.value * 5000; // 5000 Ar par jour de retard
});

const materielsEndommagesCount = computed(() => {
  return formData.value.materiels.filter(item => item.etat === 'Endommagé').length;
});

const coutTotalReparation = computed(() => {
  return formData.value.materiels.reduce((total, item) => 
    total + (item.coutReparation || 0), 0
  );
});

const montantTotalDu = computed(() => {
  return penaliteRetard.value + coutTotalReparation.value;
});

const hasDommages = computed(() => {
  return materielsEndommagesCount.value > 0 || penaliteRetard.value > 0;
});

const isFormValid = computed(() => {
  return formData.value.materiels.length > 0 && 
         formData.value.materiels.every(item => 
           item.quantiteRetournee > 0 && 
           item.etat && 
           (item.etat !== 'Endommagé' || item.dommageDescription)
         );
});

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const formatPrix = (montant) => {
  return `${montant?.toLocaleString('fr-FR')} Ar` || '0 Ar';
};

const initializeMateriels = () => {
  if (!selectedLocation.value) return;
  
  // Récupérer les matériels de la location
  const materiels = selectedLocation.value.reservation?.materiels || 
                   [{
                     codeMat: selectedLocation.value.reservation?.codeMat,
                     designation: selectedLocation.value.reservation?.materiel?.designationMat || 'Matériel principal',
                     quantiteInitiale: selectedLocation.value.qteMat || 1,
                     quantiteRetournee: selectedLocation.value.qteMat || 1,
                     etat: 'Bon',
                     dommageDescription: '',
                     coutReparation: 0
                   }];
  
  formData.value.materiels = materiels.map(mat => ({
    codeMat: mat.codeMat,
    designation: mat.designation,
    quantiteInitiale: mat.quantiteInitiale || mat.qteMat || 1,
    quantiteRetournee: mat.quantiteInitiale || mat.qteMat || 1,
    etat: 'Bon',
    dommageDescription: '',
    coutReparation: 0
  }));
};

const addMateriel = () => {
  formData.value.materiels.push({
    codeMat: '',
    designation: 'Nouveau matériel',
    quantiteInitiale: 1,
    quantiteRetournee: 1,
    etat: 'Bon',
    dommageDescription: '',
    coutReparation: 0
  });
};

const removeMateriel = (index) => {
  formData.value.materiels.splice(index, 1);
};

const genererContratRetour = async () => {
  // Implémentez la génération du PDF de retour
  console.log('Génération PDF retour:', formData.value);
  // Utilisez votre service PDF existant
};

// Dans etatLieu.vue - Mettre à jour validerRetour
const validerRetour = async () => {
  loading.value = true;
  try {
    const etatLieuxData = {
      mode: 'retour',
      details: formData.value.materiels.map(item => ({
        idMat: item.codeMat,
        qteMat: item.quantiteRetournee,
        estEndommage: item.etat === 'Endommagé',
        dommageDescription: item.dommageDescription,
        coutReparation: item.coutReparation
      })),
      observations: formData.value.observations,
      penaliteRetard: penaliteRetard.value,
      montantTotal: montantTotalDu.value
    };

    await LocationService.submitEtatLieux(selectedLocation.value.idLo, etatLieuxData);
    
    // 🔥 CORRECTION: Émettre le succès avec les informations
    emit('retour-success', {
      locationId: selectedLocation.value.idLo,
      montantTotal: montantTotalDu.value,
      materiels: formData.value.materiels,
      nouveauStatut: 'Terminée' // 🔥 Indiquer le nouveau statut
    });
    
    showModal.value = false;
    
  } catch (error) {
    console.error('Erreur validation retour:', error);
    alert('Erreur lors de la validation du retour');
  } finally {
    loading.value = false;
  }
};

// Watchers
watch(() => props.show, (newVal) => {
  showModal.value = newVal;
});

watch(showModal, (newVal) => {
  if (newVal && props.location) {
    selectedLocation.value = props.location;
    initializeMateriels();
  } else {
    formData.value.materiels = [];
    formData.value.observations = '';
  }
  emit('update:show', newVal);
});
</script>

<style scoped>
.retour-materiel-content {
  max-height: 70vh;
  overflow-y: auto;
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