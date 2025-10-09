<!--<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>


<template>
  <div class="login-page d-flex justify-content-center align-items-center min-vh-100 bg-dark">
    <div class="card shadow-lg p-4 login-card">
      <h2 class="text-center text-purple mb-4">Connexion</h2>

      <form @submit.prevent="login">
        <!-- Email 
        <div class="mb-3">
          <label for="email" class="form-label text-light">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Entrez votre email"
            required
          />
        </div>

        <!-- Mot de passe 
        <div class="mb-3">
          <label for="motDePasseUti" class="form-label text-light">Mot de passe</label>
          <input
            type="motDePasseUti"
            id="motDePasseUti"
            v-model="motDePasseUti"
            class="form-control"
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>

        <!-- Bouton login
       
        <router-link to="/acceuil"   type="submit"  class="btn btn-green w-100 mt-3">Se connecter</router-link>
      </form>

      <p class="text-center text-light mt-3">
        Pas encore de compte ?
        <a href="#" class="text-purple">S’inscrire</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      email: "",
      motDePasseUti: "",
    };
  },
  methods: {
    login() {
      // Ici tu peux ajouter ton appel à l’API backend
      console.log("Email:", this.email, "Mot de passe:", this.motDePasseUti);
      alert("Connexion effectuée (simulation)");
    },
  },
};
</script>

<style>
/* Card login */
.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #2c2f48;
  border-radius: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

/* Couleurs */
.btn-purple {
  background-color: #6d28d9;
  color: white;
  transition: transform 0.3s, background-color 0.3s;
}

.btn-purple:hover {
  background-color: #7c3aed;
  transform: scale(1.05);
  color: white;
}

.text-purple {
  color: #6d28d9 !important;
}
</style>


 <template>
  <div class="bg-dark text-light min-vh-100">
    <!-- Navbar 
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand text-white" to="/">CEDII</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/">Accueil</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/utilisateur">Utilisateur</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/projet">Projet</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/rapport">Rapport</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/parametre">Paramètre</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/deconnexion">Déconnexion</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Hero Section
    <header class="text-center py-5" style="background-color: #1e3a8a;">
      <div class="container">
        <h1 class="display-4 text-light">Bienvenue sur la Gestion de Patrimoine Plus</h1>
        <p class="lead text-light"></p>
        <router-link to="/services" class="btn btn-purple btn-lg mt-3">Nos services</router-link>
      </div>
    </header> 

    <!-- Features Section 
    <section class="py-5 bg-secondary bg-opacity-10">
      <div class="container">
        <div class="row text-center g-4">
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow" style="background-color: #2c2f48;">
              <div class="card-body">
                <h5 class="card-title text-primary">Nombre Matériel(s)</h5>
                <p class="card-text text-light">5</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow" style="background-color: #2c2f48;">
              <div class="card-body">
                <h5 class="card-title text-purple">Nombre Salle(s)</h5>
                <p class="card-text text-light">2</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow" style="background-color: #2c2f48;">
              <div class="card-body">
                <h5 class="card-title text-light">Nombre Chapiteau</h5>
                <p class="card-text text-light">4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer
    <footer class="text-center py-4 bg-dark text-secondary">
      © 2025 MonProjet. Tous droits réservés.
    </footer>

    <!-- Vue Router Outlet
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "acceuil",
};
</script>

<style scoped>
.btn-purple {
  background-color: #6d28d9;
  color: white;
}

.btn-purple:hover {
  background-color: #7c3aed;
  color: white;
}

.text-purple {
  color: #6d28d9 !important;
}
</style>


 <!--<template>
  <div class="dashboard d-flex min-vh-100">
     Sidebar 
    <nav class="sidebar bg-dark-purple p-3">
      <h3 class="text-white text-center mb-4">Gestion Clients</h3>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link text-light sidebar-link">Tableau de bord</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/clients" class="nav-link text-light sidebar-link">Clients</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/locations" class="nav-link text-light sidebar-link">Historique Locations</router-link>
        </li>
      </ul>
    </nav>

    <!-- Main content
    <div class="content flex-grow-1 p-4 bg-main">
      <h2 class="text-purple mb-4">Gestion des Clients</h2>

      <!-- Bouton Ajouter 
      <div class="mb-3">
        <button class="btn btn-purple" @click="showAddModal = true">Ajouter un client</button>
      </div>

      <!-- Tableau des clients 
      <table class="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom & Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(client, index) in clients" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ client.nomPrenom }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.telephone }}</td>
            <td>{{ client.adresse }}</td>
            <td>{{ client.typeClient }}</td>
            <td>{{ client.statut }}</td>
            <td>
              <button class="btn btn-sm btn-success me-1" @click="editClient(client)">Modifier</button>
              <button class="btn btn-sm btn-danger" @click="deactivateClient(client)">Désactiver</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Classement des clients 
      <div class="mt-5">
        <h4 class="text-purple mb-3">Classement des clients (simulation)</h4>
        <ul class="list-group">
          <li class="list-group-item bg-card2 text-white" v-for="(c, idx) in topClients" :key="idx">
            {{ idx + 1 }}. {{ c.nomPrenom }} - Activité: {{ c.activite }} - Rentabilité: {{ c.rentabilite }} $
          </li>
        </ul>
      </div>

      <!-- Modal Ajouter / Modifier Client 
      <div v-if="showAddModal" class="modal-backdrop">
        <div class="modal-card p-4 bg-main rounded">
          <h5 class="text-purple mb-3">{{ editingClient ? 'Modifier Client' : 'Ajouter Client' }}</h5>
          <form @submit.prevent="saveClient">
            <div class="mb-2">
              <label class="form-label text-light">Nom et Prénom</label>
              <input type="text" v-model="form.nomPrenom" class="form-control"/>
            </div>
            <div class="mb-2">
              <label class="form-label text-light">Email</label>
              <input type="email" v-model="form.email" class="form-control"/>
            </div>
            <div class="mb-2">
              <label class="form-label text-light">Téléphone</label>
              <input type="text" v-model="form.telephone" class="form-control"/>
            </div>
            <div class="mb-2">
              <label class="form-label text-light">Adresse</label>
              <input type="text" v-model="form.adresse" class="form-control"/>
            </div>
            <div class="mb-2">
              <label class="form-label text-light">Type de client</label>
              <select v-model="form.typeClient" class="form-control">
                <option>ONG</option>
                <option>Association</option>
                <option>Entreprise</option>
                <option>Particulier</option>
                <option>Institution publique</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="form-label text-light">Statut</label>
              <select v-model="form.statut" class="form-control">
                <option>Actif</option>
                <option>Inactif</option>
                <option>Bloqué</option>
              </select>
            </div>
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
              <button type="submit" class="btn btn-purple">{{ editingClient ? 'Modifier' : 'Ajouter' }}</button>
            </div>
          </form>
        </div>
      </div>

    </div>
    
     <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "GestionClients",
  data() {
    return {
      clients: [
        { nomPrenom: "Alice Martin", email: "alice@example.com", telephone: "0341234567", adresse: "Antananarivo", typeClient: "Entreprise", statut: "Actif", activite: 15, rentabilite: 2500 },
        { nomPrenom: "Bob R.", email: "bob@example.com", telephone: "0349876543", adresse: "Fianarantsoa", typeClient: "Association", statut: "Actif", activite: 10, rentabilite: 1500 }
      ],
      topClients: [
        { nomPrenom: "Alice Martin", activite: 15, rentabilite: 2500 },
        { nomPrenom: "Bob R.", activite: 10, rentabilite: 1500 }
      ],
      showAddModal: false,
      editingClient: null,
      form: {
        nomPrenom: "",
        email: "",
        telephone: "",
        adresse: "",
        typeClient: "ONG",
        statut: "Actif"
      }
    };
  },
  methods: {
    closeModal() {
      this.showAddModal = false;
      this.editingClient = null;
      this.form = { nomPrenom: "", email: "", telephone: "", adresse: "", typeClient: "ONG", statut: "Actif" };
    },
    saveClient() {
      if (this.editingClient) {
        Object.assign(this.editingClient, this.form);
      } else {
        this.clients.push({ ...this.form, activite: 0, rentabilite: 0 });
      }
      this.closeModal();
    },
    editClient(client) {
      this.editingClient = client;
      this.form = { ...client };
      this.showAddModal = true;
    },
    deactivateClient(client) {
      client.statut = "Inactif";
    }
  }
};
</script>

<style scoped>
/* Couleurs principales */
.bg-dark-purple { background-color: #02061E; }
.bg-main { background-color: #0405BF; }
.text-purple { color: #5B11EE !important; }
.btn-purple { background-color: #5B11EE; color: white; }
.btn-purple:hover { background-color: #6d28d9; color: white; }

/* Sidebar links */
.sidebar-link {
  padding: 10px;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}
.sidebar-link:hover { background-color: #5B11EE; color: #fff !important; }

/* Modal */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 999;
}
.modal-card { width: 500px; }
.bg-card2 { background-color: #0671B6; }
</style>



<template>
  <div class="dashboard d-flex min-vh-100">
    <!-- Sidebar 
    <nav class="sidebar bg-dark-purple p-3">
      <h3 class="text-white text-center mb-4">Locations / Réservations</h3>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link text-light sidebar-link">Tableau de bord</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/catalogue" class="nav-link text-light sidebar-link">Catalogue</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/reservations" class="nav-link text-light sidebar-link">Mes Réservations</router-link>
        </li>
      </ul>
    </nav>

    <!-- Main content 
    <div class="content flex-grow-1 p-4 bg-main">
      <h2 class="text-purple mb-4">Catalogue et Réservation</h2>

      <!-- Catalogue 
      <div class="mb-4">
        <h4 class="text-purple mb-3">Catalogue disponible</h4>
        <table class="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Type</th>
              <th>Capacité / Quantité</th>
              <th>Tarif</th>
              <th>Disponibilité</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in catalogue" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.nom }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.capacite || item.quantite }}</td>
              <td>{{ item.tarif }}</td>
              <td>{{ item.disponibilite }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formulaire de réservation / location 
      <div class="reservation-form p-4 bg-card4 rounded">
        <h4 class="text-purple mb-3">Demande de réservation / location</h4>
        <form @submit.prevent="submitReservation">
          <div class="mb-2">
            <label class="form-label text-light">Sélectionner un catalogue</label>
            <select v-model="form.catalogueId" class="form-control">
              <option v-for="item in catalogue" :key="item.id" :value="item.id">
                {{ item.nom }} ({{ item.type }})
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label text-light">Type de réservation / location</label>
            <select v-model="form.typeLocation" class="form-control">
              <option>Heure</option>
              <option>Demi-journée</option>
              <option>Journée</option>
              <option>Par jour</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label text-light">Nombre de personnes (pour salle)</label>
            <input type="number" v-model="form.nombrePersonnes" class="form-control"/>
          </div>
          <div class="mb-2">
            <label class="form-label text-light">Quantité de matériel</label>
            <input type="number" v-model="form.quantiteMateriel" class="form-control"/>
          </div>
          <div class="mb-2">
            <label class="form-label text-light">Date début</label>
            <input type="date" v-model="form.dateDebut" class="form-control"/>
          </div>
          <div class="mb-2">
            <label class="form-label text-light">Date fin / retour</label>
            <input type="date" v-model="form.dateFin" class="form-control"/>
          </div>
          <div class="mb-3">
            <label class="form-label text-light">Tarif total</label>
            <input type="text" :value="calculateTarif()" class="form-control" readonly/>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-purple">Soumettre la demande</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">Annuler</button>
          </div>
        </form>
      </div>

      <!-- Historique des réservations 
      <div class="mt-5">
        <h4 class="text-purple mb-3">Mes réservations (simulation)</h4>
        <table class="table table-dark table-striped table-hover">
          <thead>
            <tr>
              <th>ID Demande</th>
              <th>Catalogue</th>
              <th>Type</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Quantité / Personnes</th>
              <th>Tarif Total</th>
              <th>Etat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in reservations" :key="res.id">
              <td>{{ res.id }}</td>
              <td>{{ res.catalogueNom }}</td>
              <td>{{ res.typeLocation }}</td>
              <td>{{ res.dateDebut }}</td>
              <td>{{ res.dateFin }}</td>
              <td>{{ res.quantiteMateriel || res.nombrePersonnes }}</td>
              <td>{{ res.tarifTotal }} $</td>
              <td>{{ res.etat }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "GestionReservations",
  data() {
    return {
      catalogue: [
        { id: 1, nom: "Salle A", type: "Salle", capacite: 30, tarif: 50, disponibilite: "Disponible" },
        { id: 2, nom: "Chapiteau", type: "Matériel", quantite: 5, tarif: 30, disponibilite: "Disponible" },
      ],
      reservations: [
        { id: 1, catalogueNom: "Salle A", typeLocation: "Heure", dateDebut: "2025-09-27", dateFin: "2025-09-27", nombrePersonnes: 20, quantiteMateriel: null, tarifTotal: 50, etat: "Validée" }
      ],
      form: {
        catalogueId: 1,
        typeLocation: "Heure",
        nombrePersonnes: 1,
        quantiteMateriel: 1,
        dateDebut: "",
        dateFin: ""
      }
    };
  },
  methods: {
    calculateTarif() {
      const item = this.catalogue.find(c => c.id === this.form.catalogueId);
      if (!item) return 0;
      let baseTarif = item.tarif;
      // Simulation simple du tarif
      if (this.form.typeLocation === "Heure") return baseTarif;
      if (this.form.typeLocation === "Demi-journée") return baseTarif * 4;
      if (this.form.typeLocation === "Journée" || this.form.typeLocation === "Par jour") return baseTarif * 8;
      return baseTarif;
    },
    submitReservation() {
      const catalogueItem = this.catalogue.find(c => c.id === this.form.catalogueId);
      this.reservations.push({
        id: this.reservations.length + 1,
        catalogueNom: catalogueItem.nom,
        typeLocation: this.form.typeLocation,
        dateDebut: this.form.dateDebut,
        dateFin: this.form.dateFin,
        nombrePersonnes: catalogueItem.type === "Salle" ? this.form.nombrePersonnes : null,
        quantiteMateriel: catalogueItem.type === "Matériel" ? this.form.quantiteMateriel : null,
        tarifTotal: this.calculateTarif(),
        etat: "En attente"
      });
      alert("Demande soumise (simulation)");
      this.resetForm();
    },
    resetForm() {
      this.form = { catalogueId: 1, typeLocation: "Heure", nombrePersonnes: 1, quantiteMateriel: 1, dateDebut: "", dateFin: "" };
    }
  }
};
</script>

<!--<style scoped>
.bg-dark-purple { background-color: #02061E; }
.bg-main { background-color: #0405BF; }
.text-purple { color: #5B11EE !important; }
.btn-purple { background-color: #5B11EE; color: white; }
.btn-purple:hover { background-color: #6d28d9;
}-->

<template>
  <div class="login-wrapper d-flex justify-content-center align-items-center">
    <div class="card shadow-lg p-4 login-card">
      <div class="card-body">
          <img src="/src/logoCEDII.jpeg" alt="Logo CEDII" class="sidebar-logo me-2">
        <h3 class="card-title text-center cedii-text-dark mb-4">
          CEDII Patrimoine Plus
        </h3>
        <p class="text-center text-muted mb-4">Connexion pour la Gestion Patrimoniale</p>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="loginUti" class="form-label">Identifiant ou Email</label>
            <input type="text" id="loginUti" v-model="credentials.loginUti" class="form-control" required />
          </div>

          <div class="mb-4">
            <label for="motDePasseUti" class="form-label">Mot de passe</label>
            <input type="motDePasseUti" id="motDePasseUti" v-model="credentials.motDePasseUti" class="form-control" required />
          </div>

          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

          <button type="submit" class="btn cedii-btn-primary w-100"  >
            Se Connecter
          </button>
          <div class="text-center mt-3">
    Vous n'avez pas de compte ? 
    <router-link to="/register" class="cedii-text-action">S'inscrire</router-link>
</div>
        </form>
      </div>
      <div class="card-footer text-center mt-3 bg-white border-0">
         <small class="text-muted">Copyright CEDII - 2025</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 💡 Importation réelle du service d'authentification
import AuthService from '../services/AuthService'; 

const router = useRouter();
const credentials = ref({
  loginUti: '',
  motDePasseUti: ''
});
const error = ref('');

async function handleLogin() {
  error.value = '';
  try {
    // 🚀 Appel au service qui envoie les données au backend
    const userData = await AuthService.login(credentials.value.loginUti, credentials.value.motDePasseUti);
    
    // Si le backend renvoie un jeton, la connexion est réussie.
    if (userData.accessToken) {
      // Redirection vers la page d'accueil (acceuil)
      router.push('/home'); 
    }
  } catch (err) {
    // Récupérer le message d'erreur du backend (401 Unauthorized, etc.)
    const msg = err.response?.data?.message || "Échec de la connexion. Vérifiez le serveur et les identifiants.";
    error.value = msg;
  }
}
</script>

<!--<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const credentials = ref({
  loginUti: '',
  motDePasseUti: ''
});
const error = ref('');



  // ⚠️ SIMULATION DE LOGIN CÔTÉ FRONTEND ⚠️
  // Cette logique devra être remplacée par un appel API vers votre backend Express
  // (Exemple: axios.post('http://localhost:5000/api/auth/login', credentials.value))
  
 // 🚨 Importez le service
//import AuthService from '../services/AuthService'; 

// ... autres variables (credentials, error) ...

async function handleLogin() {
  error.value = '';
  try {
    // 🚨 Appel API réel
    const userData = await AuthService.login(credentials.value.loginUti, credentials.value.motDePasseUti);
    
    // Succès: stocker le token (fait dans AuthService) et rediriger
    if (userData.accessToken) {
      router.push('/home'); 
    }
  } catch (err) {
    // Échec de connexion ou erreur réseau
    const msg = err.response?.data?.message || "Échec de la connexion. Vérifiez le serveur et les identifiants.";
    error.value = msg;
  }
}

</script>
-->
<style scoped>
/* Les styles spécifiques de la page de login */
.login-wrapper {
  min-height: 100vh;
  /* Utilisation de la couleur dark de votre palette */
  background-color: var(--cedii-dark); /* #02061E [cite: 3] */
}

.sidebar-logo {
    width: 80px; /* Taille du logo */
    height: 80px;
    
    /* 🚨 C'est ce qui rend la bordure parfaitement ronde */
    border-radius: 50%; 
    
    /* Optionnel : Ajoute une petite bordure blanche pour qu'il ressorte */
    border: 2px solid white; 
    
    object-fit: cover; /* Assure que l'image remplit la zone sans distorsion */
}
.login-card {
  max-width: 400px;
  width: 100%;
  border-radius: 10px;
}

/* Redéfinition des classes CEDII pour ce composant si elles ne sont pas globales */
.cedii-text-dark {
    color: var(--cedii-dark);
}
.cedii-btn-primary {
    background-color: var(--cedii-primary-light); /* #5B11EE [cite: 1] */
    border-color: var(--cedii-primary-light);
    color: white;
}
.cedii-btn-primary:hover {
    background-color: var(--cedii-primary-dark); /* #0405BF [cite: 2] */
    border-color: var(--cedii-primary-dark);
}
</style>