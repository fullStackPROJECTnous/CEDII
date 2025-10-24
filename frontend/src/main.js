import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import { createPinia } from 'pinia'; 
import App from './App.vue'
import router from './router/router.js';


// 🚨 IMPORTEZ ET UTILISEZ LE PLUGIN DE TOASTIFICATION
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // N'oubliez pas le CSS !

// 🚨 1. Importation du CSS de Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';
// 🚨 2. Importation des Icônes Bootstrap (très utiles pour les boutons de votre CRUD)
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// Bootstrap
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App);
const pinia = createPinia();

// Utilisez le plugin ici, AVANT de monter l'application
app.use(pinia); 
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
//import Chart from "chart.js";

//import client from './client.vue'



/*createApp(App)
  .use(router) // 🚨 UTILISATION DU ROUTER
  .mount('#app');

*/
