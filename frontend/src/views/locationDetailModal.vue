<!-- LocationDetailModal.vue -->
<template>
  <n-space vertical size="large">
    <n-descriptions label-placement="left" bordered>
      <n-descriptions-item label="Référence Location">
        L-{{ location.idLo }}
      </n-descriptions-item>
      <n-descriptions-item label="Référence Réservation">
        R-{{ location.idRes }}
      </n-descriptions-item>
      <n-descriptions-item label="Type">
        <n-tag :type="getTagType(location.typeLo)">{{ location.typeLo }}</n-tag>
      </n-descriptions-item>
      <n-descriptions-item label="Date Création">
        {{ formatDate(location.dateCre) }}
      </n-descriptions-item>
      <n-descriptions-item label="Début Location">
        {{ formatDate(location.debLo) }}
      </n-descriptions-item>
      <n-descriptions-item label="Fin Location">
        {{ formatDate(location.finLo) }}
      </n-descriptions-item>
      <n-descriptions-item label="Tarif Total">
        <span class="fw-bold text-primary">{{ formatCurrency(location.tarifTot) }}</span>
      </n-descriptions-item>
      <n-descriptions-item label="État">
        <n-tag :type="getStatusType(location.etatLo)">{{ location.etatLo }}</n-tag>
      </n-descriptions-item>
    </n-descriptions>

    <n-space justify="end">
      <n-button type="primary" @click="$emit('close')">
        Fermer
      </n-button>
    </n-space>
  </n-space>
</template>

<script setup>
import { NDescriptions, NDescriptionsItem, NTag, NSpace, NButton } from 'naive-ui';

defineProps({
  location: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  if (!value) return '0,00 MGA';
  return `${parseFloat(value).toLocaleString('fr-MG', { minimumFractionDigits: 2 })} MGA`;
};

const formatDate = (datetime) => {
  if (!datetime) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(datetime).toLocaleDateString('fr-FR', options);
};

const getTagType = (type) => {
  const types = {
    'Salle': 'info',
    'Materiel': 'success',
    'Mixte': 'warning'
  };
  return types[type] || 'default';
};

const getStatusType = (status) => {
  const statusTypes = {
    'Confirmée': 'success',
    'En attente': 'warning',
    'Annulée': 'error',
    'Terminée': 'default'
  };
  return statusTypes[status] || 'default';
};
</script>