<!-- PaiementModal.vue -->
<template>
  <n-space vertical size="large">
    <!-- Informations de la location -->
    <n-card size="small">
      <n-space vertical>
        <n-text strong>Location L-{{ location.idLo }}</n-text>
        <n-text depth="3">Client: {{ getClientName(location) }}</n-text>
        <n-text depth="3">Échéance: {{ formatDate(location.dateEcheance) }}</n-text>
      </n-space>
    </n-card>

    <!-- Détails financiers -->
    <n-descriptions label-placement="left" bordered size="small">
      <n-descriptions-item label="Montant Total">
        <n-text strong>{{ formatCurrency(location.montantTotal) }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item label="Montant Dû Initial">
        {{ formatCurrency(location.montantDuInitial) }}
      </n-descriptions-item>
      <n-descriptions-item label="Pénalité de Retard" v-if="location.montantPenalite > 0">
        <n-text type="error">{{ formatCurrency(location.montantPenalite) }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item label="Total à Payer">
        <n-text strong type="primary">{{ formatCurrency(location.montantTotalDu) }}</n-text>
      </n-descriptions-item>
    </n-descriptions>

    <!-- Formulaire de paiement -->
    <n-form ref="formRef" :model="formValue">
      <n-form-item label="Montant Payé" path="montantPaye">
        <n-input-number
          v-model:value="formValue.montantPaye"
          :min="0"
          :max="location.montantTotalDu"
          :precision="2"
          placeholder="Entrez le montant payé"
          clearable
        />
      </n-form-item>

      <n-form-item label="Mode de Paiement" path="modePaie">
        <n-select
          v-model:value="formValue.modePaie"
          :options="modePaieOptions"
          placeholder="Sélectionnez le mode de paiement"
        />
      </n-form-item>

      <n-form-item label="Notes" path="notes">
        <n-input
          v-model:value="formValue.notes"
          type="textarea"
          placeholder="Notes optionnelles..."
          :rows="3"
        />
      </n-form-item>
    </n-form>

    <!-- Actions -->
    <n-space justify="end">
      <n-button @click="$emit('close')">
        Annuler
      </n-button>
      <n-button 
        type="primary" 
        @click="handleSubmit"
        :loading="submitting"
        :disabled="!formValue.montantPaye || !formValue.modePaie"
      >
        Enregistrer le Paiement
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { ref } from 'vue';
import {
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NInput,
  NSpace,
  NButton,
  NText,
  NCard,
  NDescriptions,
  NDescriptionsItem
} from 'naive-ui';
import FinanceService from '../services/FinanceService';

const props = defineProps({
  location: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['paiement-success', 'close']);

const formRef = ref(null);
const submitting = ref(false);
const formValue = ref({
  montantPaye: props.location.montantTotalDu,
  modePaie: null,
  notes: ''
});

const modePaieOptions = [
  { label: '💵 Cash', value: 'Cash' },
  { label: '🏦 Virement', value: 'Virement' },
  { label: '📱 Mobile Money', value: 'MobileMoney' },
  { label: '💳 Carte', value: 'Carte' }
];

const formatCurrency = (value) => {
  if (typeof value === 'string') value = parseFloat(value);
  if (isNaN(value)) return '0,00 MGA';
  return `${value.toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR');
};

const getClientName = (location) => {
  try {
    const client = location.Client;
    if (client && client.nomCli) {
      return `${client.nomCli} ${client.prenomCli || ''}`.trim();
    }
    return 'N/A';
  } catch (e) {
    return 'N/A';
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await FinanceService.recordPaiement(props.location.idLo, formValue.value);
    emit('paiement-success');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    alert('Erreur lors de l\'enregistrement du paiement');
  } finally {
    submitting.value = false;
  }
};
</script>