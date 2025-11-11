<template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    <main class="main-content flex-grow-1 overflow-auto bg-white">
      <div class="container-fluid py-3">
        <!-- En-tête de page -->
        <n-card class="mb-3 border-0" content-style="padding: 0;">
          <div class="d-flex justify-content-between align-items-center p-3">
            <div>
              <n-h1 class="mb-1 fs-4" style="color: #02061E;">Mon Compte Client</n-h1>
              <n-text class="text-muted small">Gérez vos informations personnelles et vos réservations</n-text>
            </div>
            <n-tag type="info" size="medium">
              <template #icon>
                <n-icon>
                  <i class="bi bi-person-circle"></i>
                </n-icon>
              </template>
              Bienvenue, {{ clientName }} !
            </n-tag>
          </div>
        </n-card>

        <!-- Bannière d'information -->
        <n-alert title="Informations du compte" type="info" class="mb-3" :bordered="false" size="small">
          <template #icon>
            <i class="bi bi-info-circle-fill"></i>
          </template>
          Vous pouvez consulter vos informations et votre historique ci-dessous.
        </n-alert>

        <!-- Section principale -->
        <div class="row g-3">
          <!-- Colonne gauche - Coordonnées -->
          <div class="col-lg-5">
            <n-card title="Mes Coordonnées" size="small" class="h-100 shadow-sm" :bordered="false">
              <template #header-extra>
                <n-icon size="18" color="#5811EE">
                  <i class="bi bi-person-badge"></i>
                </n-icon>
              </template>
              
              <n-spin :show="isLoading">
                <n-list v-if="clientInfo.name" bordered size="small">
                  <n-list-item class="py-2">
                    <n-thing title="Nom complet" :description="clientInfo.name" />
                  </n-list-item>
                  <n-list-item class="py-2">
                    <n-thing title="Email" :description="clientInfo.email" />
                  </n-list-item>
                  <n-list-item class="py-2">
                    <n-thing title="Téléphone" :description="clientInfo.phone" />
                  </n-list-item>
                  <n-list-item class="py-2">
                    <n-thing title="Adresse" :description="clientInfo.address" />
                  </n-list-item>
                  <n-list-item class="py-2">
                    <n-thing title="Type de client">
                      <n-tag :type="clientInfo.type === 'Particulier' ? 'info' : 'warning'" size="small">
                        {{ clientInfo.type }}
                      </n-tag>
                    </n-thing>
                  </n-list-item>
                  <n-list-item class="py-2">
                    <n-thing title="Statut du compte">
                      <n-tag :type="clientInfo.status === 'Actif' ? 'success' : 'error'" size="small">
                        {{ clientInfo.status }}
                      </n-tag>
                    </n-thing>
                  </n-list-item>
                </n-list>
                
                <div v-else class="text-center p-3">
                  <n-empty description="Chargement des données..." size="small">
                    <template #icon>
                      <n-spin size="small" />
                    </template>
                  </n-empty>
                </div>
              </n-spin>
            </n-card>
          </div>

          <!-- Colonne droite - Prochaine location -->
          <div class="col-lg-7">
            <n-card title="Ma Prochaine Location" size="small" class="h-100" :bordered="false"
                    :class="nextReservation.etatRes === 'Confirmée' ? 'border-success-subtle' : 'border-warning-subtle'"
                    style="border: 1px solid; border-radius: 6px;">
              <template #header-extra>
                <n-icon size="18" color="#5811EE">
                  <i class="bi bi-arrow-right-circle-fill"></i>
                </n-icon>
              </template>

              <div class="d-flex flex-column h-100 p-3">
                <div v-if="nextReservation.idRes" class="flex-grow-1">
                  <n-h3 class="text-dark mb-3 fs-5">{{ `Réservation #${nextReservation.idRes}` }}</n-h3>
                  
                  <!-- Affichage vertical des informations -->
                  <div class="reservation-details-vertical">
                    <div class="detail-item mb-3">
                      <div class="detail-label text-muted small">Type de réservation</div>
                      <div class="detail-value fw-semibold">{{ nextReservation.typeRes }}</div>
                    </div>
                    
                    <div class="detail-item mb-3">
                      <div class="detail-label text-muted small">Date de début</div>
                      <div class="detail-value">{{ formatDate(nextReservation.debRes) }}</div>
                    </div>
                    
                    <div class="detail-item mb-3">
                      <div class="detail-label text-muted small">Date de fin</div>
                      <div class="detail-value">{{ formatDate(nextReservation.finRes) }}</div>
                    </div>
                    
                    <div class="detail-item mb-3">
                      <div class="detail-label text-muted small">Statut</div>
                      <div class="detail-value">
                        <n-tag :type="getStatusType(nextReservation.etatRes)" size="small">
                          {{ nextReservation.etatRes }}
                        </n-tag>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-else class="text-center flex-grow-1 d-flex flex-column justify-content-center py-3">
                  <n-empty description="Aucune réservation à venir" size="medium">
                    <template #icon>
                      <i class="bi bi-calendar-x" style="font-size: 2rem; color: #55555E;"></i>
                    </template>
                  </n-empty>
                </div>

                <div class="mt-auto pt-3">
                  
                </div>
              </div>
            </n-card>
          </div>
        </div>

        <!-- Historique des locations -->
        <n-card title="Historique des Locations" class="mt-3 shadow-sm" :bordered="false" size="small">
          <template #header-extra>
            <n-icon size="18" color="#02061E">
              <i class="bi bi-clock-history"></i>
            </n-icon>
          </template>

          <n-data-table
            :columns="columns"
            :data="pastReservations"
            :bordered="false"
            :striped="true"
            :loading="isLoading"
            flex-height
            :min-height="250"
            size="small"
          />
          
          <template #footer v-if="pastReservations.length === 0 && !isLoading">
            <div class="text-center py-3">
              <n-empty description="Aucune réservation dans votre historique" size="medium">
                <template #icon>
                  <i class="bi bi-inbox" style="font-size: 2rem; color: #55555E;"></i>
                </template>
              </n-empty>
            </div>
          </template>
        </n-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue';
import { 
  NCard, 
  NH1, 
  NText, 
  NTag, 
  NAlert, 
  NList, 
  NListItem, 
  NThing, 
  NSpin, 
  NEmpty, 
  NButton, 
  NIcon, 
  NDescriptions, 
  NDescriptionsItem,
  NDataTable,
  NH3
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue'; 
import ClientService from '../services/ClientService'; 

const clientName = ref('Client'); 
const clientInfo = ref({});
const nextReservation = ref({});
const pastReservations = ref([]);
const isLoading = ref(true);

// Configuration des colonnes du tableau
const columns = [
  {
    title: 'ID',
    key: 'idRes',
    width: 70,
    align: 'center'
  },
  {
    title: 'Type',
    key: 'typeRes',
    width: 100
  },
  {
    title: 'Date Début',
    key: 'debRes',
    width: 120,
    render: (row) => formatDate(row.debRes)
  },
  {
    title: 'Date Fin',
    key: 'finRes',
    width: 120,
    render: (row) => formatDate(row.finRes)
  },
  {
    title: 'Statut',
    key: 'etatRes',
    width: 100,
    render: (row) => h(
      NTag,
      {
        type: getStatusType(row.etatRes),
        size: 'small'
      },
      { default: () => row.etatRes }
    )
  },
  {
    title: 'Tarif',
    key: 'tarifTot',
    width: 120,
    align: 'right',
    render: (row) => formatCurrency(row.tarifTot)
  }
];

const fetchClientData = async () => {
  try {
    console.log("🔍 Chargement des données client...");
    
    const clientData = await ClientService.getMyProfile(); 
    console.log("✅ Données client reçues:", clientData);
    
    clientName.value = `${clientData.prenomCli || ''} ${clientData.nomCli || ''}`.trim() || 'Client';
    
    clientInfo.value = {
      name: `${clientData.nomCli || ''} ${clientData.prenomCli || ''}`.trim(),
      email: clientData.emailCli || 'Non spécifié',
      phone: clientData.telephoneCli || 'Non spécifié',
      address: clientData.addresseCli || 'Non spécifiée',
      type: clientData.typeCli === 'particulier' ? 'Particulier' : 'Entreprise',
      status: clientData.statutCli === 'actif' ? 'Actif' : 'Inactif',
      memberSince: clientData.createdAt ? new Date(clientData.createdAt).toLocaleDateString('fr-FR') : 'Non spécifiée'
    };

    await fetchReservations(clientData.idCli);
    
  } catch (error) {
    console.error("❌ Erreur chargement données:", error);
    clientName.value = 'Erreur de chargement';
  } finally {
    isLoading.value = false;
  }
};

const fetchReservations = async (clientId) => {
  try {
    const response = await ClientService.getClientReservations(clientId);
    const reservations = response.reservations || [];
    
    const now = new Date();
    const upcoming = reservations
      .filter(res => new Date(res.debRes) > now)
      .sort((a, b) => new Date(a.debRes) - new Date(b.debRes))[0];
    
    nextReservation.value = upcoming || {};
    
    pastReservations.value = reservations
      .filter(res => res !== upcoming)
      .sort((a, b) => new Date(b.debRes) - new Date(a.debRes));
      
  } catch (error) {
    console.error("❌ Erreur chargement réservations:", error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Date invalide';
  }
};

const formatCurrency = (amount) => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA'
  }).format(amount);
};

const getStatusType = (status) => {
  switch (status) {
    case 'Confirmée': return 'success';
    case 'En attente': return 'warning';
    case 'Annulée': return 'error';
    case 'Terminée': return 'info';
    default: return 'default';
  }
};

onMounted(() => {
  fetchClientData();
});
</script>

<style scoped>
.main-content {
  background-color: #ffffff;
}

.cedii-btn-primary { 
  background-color: #5811EE;
  color: white;
  border-color: #5811EE;
}

.cedii-btn-primary:hover {
  background-color: #04058F;
  border-color: #04058F;
}

/* Style pour l'affichage vertical des détails de réservation */
.reservation-details-vertical .detail-item {
  border-left: 3px solid #5811EE;
  padding-left: 12px;
}

.reservation-details-vertical .detail-label {
  font-size: 0.8rem;
  margin-bottom: 2px;
}

.reservation-details-vertical .detail-value {
  font-size: 0.9rem;
  color: #02061E;
}

:deep(.n-card__content) {
  padding: 0;
}

:deep(.n-list) {
  padding: 0;
}

:deep(.n-thing .n-thing-main .n-thing-header .n-thing-header__title) {
  font-weight: 600;
  color: #02061E;
  font-size: 0.9rem;
}

:deep(.n-thing .n-thing-main .n-thing-header .n-thing-header__description) {
  color: #55555E;
  font-size: 0.85rem;
}

:deep(.n-card-header__main) {
  font-size: 0.95rem;
  font-weight: 600;
}
</style>