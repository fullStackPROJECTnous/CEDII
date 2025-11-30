<script setup>
import { 
  NMessageProvider, 
  NDialogProvider, 
  NNotificationProvider,
  NLoadingBarProvider,
  NConfigProvider
} from 'naive-ui';

// Optionnel: Définir un thème ou une configuration si nécessaire.
// import { darkTheme } from 'naive-ui'; 
</script>


<template>
  <n-config-provider> 
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-message-provider>
            <router-view /> 
          </n-message-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>


<style> 
/* Ceci force les éléments racine à prendre 100% de la hauteur de la fenêtre */
html, body, #app {
  height: 100%; 
  width: 100%;
  margin: 0;
  padding: 0;
  /* 🛑 L'astuce principale : masque le défilement général du corps */
  overflow: hidden; 
}

/* L'élément principal du dashboard gère son propre défilement interne */
.main-content {
  flex-grow: 1; 
  /* Cette classe permet au contenu principal de défiler si nécessaire */
  overflow-y: auto; 
}
</style>

<style scoped>
/* Le reste de votre style scoped peut rester inchangé */
router-view {
  width: 100%;
  height: 100%;
}
</style>