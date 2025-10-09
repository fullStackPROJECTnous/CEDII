import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js';
//import Chart from "chart.js";

//import client from './client.vue'

// 🚨 1. Importation du CSS de Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';
// 🚨 2. Importation des Icônes Bootstrap (très utiles pour les boutons de votre CRUD)
import 'bootstrap-icons/font/bootstrap-icons.css'; 

// Bootstrap
//import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'


createApp(App)
  .use(router) // 🚨 UTILISATION DU ROUTER
  .mount('#app');


