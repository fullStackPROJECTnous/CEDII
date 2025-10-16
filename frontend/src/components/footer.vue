<template>
  <footer class="footer mt-auto py-3 bg-light shadow-sm border-top">
    <div class="container-fluid text-center">
      <span class="text-muted">
        &copy; {{ currentYear }} CEDII. Tous droits réservés.
      </span>
      <span class="text-muted d-block mt-1">
        Gestion Patrimoniale | Version 1.0
      </span>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
    /* Utilise une couleur de fond légère et un petit padding */
    background-color: var(--cedii-light) !important;
    font-size: 0.85rem;
}
.text-muted {
    color: var(--cedii-text-secondary) !important;
}
</style>