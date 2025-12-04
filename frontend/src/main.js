import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import { createPinia } from 'pinia'; 
import App from './App.vue'
import router from './router/router.js';

//import '/style.css'
import { create } from 'naive-ui'


import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // N'oubliez pas le CSS !

// 🚨 1. Importation du CSS de Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';
// 🚨 2. Importation des Icônes Bootstrap (très utiles pour les boutons de votre CRUD)
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// Bootstrap
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { 
 // create, 
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NConfigProvider,

} from 'naive-ui'

const naive = create({
  components: [
    NMessageProvider,
    NNotificationProvider, 
    NDialogProvider,
    NConfigProvider
  ]
})

// Création de l'instance Naive UI


const app = createApp(App);
const pinia = createPinia();

// Utilisez le plugin ici, AVANT de monter l'application
app.use(pinia); 
app.use(naive);
app.use(router);
app.use(Toast, {
    // Options de configuration (vous pouvez laisser vide pour les options par défaut)
    timeout: 3000, 
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
});

app.mount('#app');

