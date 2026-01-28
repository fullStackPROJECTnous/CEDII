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
    </div>

  

    <template #action>
      <div class="d-flex justify-content-between w-100">
        <div>
          
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