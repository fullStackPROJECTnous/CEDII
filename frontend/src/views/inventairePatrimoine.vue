<template>
    <div class="retour">
     <router-link to="/home" class="btn btn-sm btn-outline-primary mt-3">
      Retour à l'Acceuil
    </router-link>
  </div>
  <div class="inventaire-patrimoine p-4">
    <h1 class="mb-4 text-primary"><i class="bi bi-box-seam me-2"></i> Inventaire & Patrimoine</h1>
    
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <router-link 
          to="/patrimoine/materiel" 
          :class="['nav-link', { active: $route.path.includes('/patrimoine/materiel') }]">
          Matériel
        </router-link>
      </li>
      <li class="nav-item">
        <router-link 
          to="/patrimoine/salle" 
          :class="['nav-link', { active: $route.path.includes('/patrimoine/salle') }]">
          Salles
        </router-link>
      </li>
    </ul>

    <div class="tab-content">
      <router-view></router-view> 
    </div>

  </div>
</template>


<style scoped>
.text-primary { color: #5B11EE !important; }
.nav-tabs {
    border-bottom: 2px solid #ddd;
}
.nav-link {
    color: #0405BF; /* Couleur sombre du thème */
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
}
.nav-link.active {
    color: white;
    background-color: #5B11EE; /* Couleur primaire du thème */
    border-color: #5B11EE #5B11EE #5B11EE; /* Enlever la ligne du bas qui est remplacée par la couleur de fond */
    border-bottom: none;
}
.nav-link:not(.active):hover {
    color: #5B11EE;
    border-color: #eee #eee #ddd;
}
.retour{
    float: right;
}

/* Assurez-vous d'avoir les styles cedii-primary-light/dark définis dans votre CSS global ou dans les composants enfants */
</style>