

      <template>
  <div class="vh-100 d-flex flex-column">
    <ClientNavbar />
    <main class="main-content flex-grow-1 overflow-auto bg-light">
      <div class="container-fluid py-4">
        <!-- EN-TÊTE AMÉLIORÉE -->
        <div class="page-header mb-4">
          <div class="header-container p-4 rounded-4 shadow-sm">
            <!-- Première ligne : Titre principal et badge -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon-container">
                  <i class="bi bi-person-badge-fill header-icon"></i>
                </div>
                <div>
                  <h1 class="header-title mb-0">Mon Espace Client</h1>
                  <p class="header-subtitle mb-0 text-muted">Tableau de bord personnel</p>
                </div>
              </div>
              
              <n-tag type="info" size="large" class="custom-tag">
                <template #icon>
                  <n-icon>
                    <i class="bi bi-shield-check"></i>
                  </n-icon>
                </template>
                Compte {{ clientInfo.status || 'Actif' }}
              </n-tag>
            </div>
            
            <!-- Deuxième ligne : Informations rapides -->
            <div class="header-info-row">
              <div class="row g-4">
                <!-- Nom du client -->
                <div class="col-md-4">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-person-circle text-primary"></i>
                      <span class="info-label">Nom complet</span>
                    </div>
                    <div class="info-value fw-bold text-dark">{{ clientName }}</div>
                  </div>
                </div>
                
                <!-- Type de client -->
                <div class="col-md-4">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-tag text-primary"></i>
                      <span class="info-label">Type de client</span>
                    </div>
                    <div class="info-value">
                      <n-tag :type="clientInfo.type === 'Particulier' ? 'info' : 'warning'" size="small" round>
                        {{ clientInfo.type || 'Non spécifié' }}
                      </n-tag>
                    </div>
                  </div>
                </div>
                
                <!-- Membre depuis 
                <div class="col-md-4">
                  <div class="info-card p-3 rounded-3">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <i class="bi bi-calendar-event text-primary"></i>
                      <span class="info-label">Membre depuis</span>
                    </div>
                    <div class="info-value text-dark">{{ clientInfo.memberSince || 'Non spécifié' }}</div>
                  </div>
                </div>-->
              </div>
            </div>
            
            <!-- Troisième ligne : Actions rapides -->
            <div class="header-actions mt-4 pt-3 border-top">
              <div class="d-flex gap-3">
                <n-button type="primary" ghost size="small" class="action-btn" @click="scrollToSection('coordonnees')">
                  <template #icon>
                    <i class="bi bi-pencil-square"></i>
                  </template>
                  Modifier mon profil
                </n-button>
               
                <n-button type="success" ghost size="small" class="action-btn" @click="scrollToSection('historique')">
                  <template #icon>
                    <i class="bi bi-clock-history"></i>
                  </template>
                  Voir historique complet
                </n-button>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENU PRINCIPAL -->
        <div class="row g-3">
          <!-- Colonne gauche - Coordonnées -->
          <div class="col-lg-5" id="coordonnees">
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

              </div>
            </n-card>
          </div>
        </div>

        <!-- Historique des locations -->
        <n-card title="Historique des Locations" class="mt-3 shadow-sm" :bordered="false" size="small" id="historique">
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
  NH3,
  useMessage
} from 'naive-ui';
import ClientNavbar from '../components/clientNavbar.vue'; 
import ClientService from '../services/ClientService'; 

const message = useMessage();
const clientName = ref('Client'); 
const clientInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  type: '',
  status: '',
  memberSince: ''
});
const nextReservation = ref({});
const pastReservations = ref([]);
const isLoading = ref(true);

// Configuration des colonnes du tableau
const columns = [
  /*{
    title: 'ID',
    key: 'idRes',
    width: 70,
    align: 'center'
  },*/
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
    
    // Formatage du nom du client
    clientName.value = `${clientData.prenomCli || ''} ${clientData.nomCli || ''}`.trim() || 'Client';
    
    // Mise à jour de clientInfo avec toutes les données
    clientInfo.value = {
      name: `${clientData.nomCli || ''} ${clientData.prenomCli || ''}`.trim(),
      email: clientData.emailCli || 'Non spécifié',
      phone: clientData.telephoneCli || 'Non spécifié',
      address: clientData.addresseCli || 'Non spécifiée',
      type: clientData.typeCli === 'particulier' ? 'Particulier' : 
            clientData.typeCli === 'entreprise' ? 'Entreprise' : 
            clientData.typeCli || 'Non spécifié',
      status: clientData.statutCli === 'actif' ? 'Actif' : 
              clientData.statutCli === 'inactif' ? 'Inactif' : 
              clientData.statutCli || 'Inconnu',
      memberSince: clientData.createdAt ? new Date(clientData.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Non spécifiée'
    };

    // Charger les réservations avec l'ID client
    if (clientData.idCli) {
      await fetchReservations(clientData.idCli);
    } else {
      console.warn("⚠️ Aucun ID client trouvé pour charger les réservations");
    }
    
  } catch (error) {
    console.error("❌ Erreur chargement données:", error);
    message.error("Erreur lors du chargement de vos données");
    clientName.value = 'Erreur de chargement';
  } finally {
    isLoading.value = false;
  }
};
const fetchReservations = async (clientId) => {
  try {
    const response = await ClientService.getClientReservations(clientId);
    const reservations = response.reservations || [];
    console.log("📋 Réservations reçues:", reservations);
    
    // SIMPLIFICATION: Toujours afficher toutes les réservations dans l'historique
    // La "prochaine" n'est qu'une vue, pas un filtre
    
    // Trier toutes les réservations par date
    const sortedReservations = [...reservations].sort((a, b) => {
      try {
        return new Date(b.debRes) - new Date(a.debRes);
      } catch (e) {
        return 0;
      }
    });
    
    // La première réservation future est la "prochaine"
    const now = new Date();
    const next = sortedReservations.find(res => {
      try {
        return new Date(res.debRes) > now;
      } catch (e) {
        return false;
      }
    });
    
    nextReservation.value = next || {};
    
    // TOUTES les réservations vont dans l'historique
    pastReservations.value = sortedReservations;
    
    console.log("✅ Prochaine réservation:", nextReservation.value);
    console.log("✅ Historique total:", pastReservations.value.length, "réservations");
    
  } catch (error) {
    console.error("❌ Erreur chargement réservations:", error);
    message.error("Erreur lors du chargement de vos réservations");
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Date invalide';
  }
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
/*
const getStatusType = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmée':
    case 'validée':
    case 'confirmé':
    case 'validé': return 'success';
    case 'en attente':
    case 'en cours': return 'warning';
    case 'annulée':
    case 'refusée':
    case 'annulé':
    case 'refusé': return 'error';
    case 'terminée':
    case 'clôturée':
    case 'terminé':
    case 'clôturé': return 'info';
    default: return 'default';
  }
};
*/

const getStatusType = (status) => {
  if (!status) return 'default';
  
  const statusLower = status.toLowerCase();
  
  // Statuts positifs
  if (['confirmée', 'confirmé', 'validée', 'validé', 'acceptée', 'accepté'].includes(statusLower)) {
    return 'success';
  }
  
  // Statuts en attente/en cours
  if (['en attente', 'en cours', 'en traitement', 'pending', 'processing'].includes(statusLower)) {
    return 'warning';
  }
  
  // Statuts négatifs
  if (['annulée', 'annulé', 'refusée', 'refusé', 'rejetée', 'rejeté', 'cancelled', 'refused', 'rejected'].includes(statusLower)) {
    return 'error';
  }
  
  // Statuts terminés
  if (['terminée', 'terminé', 'clôturée', 'clôturé', 'complétée', 'complété', 'completed', 'closed'].includes(statusLower)) {
    return 'info';
  }
  
  return 'default';
};
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const viewReservationDetails = (reservationId) => {
  message.info(`Détails de la réservation #${reservationId}`);
  // Ici vous pourriez rediriger vers une page de détails
  // router.push({ name: 'ReservationDetails', params: { id: reservationId } });
};

onMounted(() => {
  fetchClientData();
});
</script>

<style scoped>
.main-content {
  background-color: #f8f9fa;
}

/* STYLES DU HEADER AMÉLIORÉ */
.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border: 1px solid rgba(4, 5, 143, 0.1);
}

.header-container {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 255, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.header-icon-container {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #04058f 0%, #5811EE 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 2rem;
  color: white;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #02061E;
  letter-spacing: -0.5px;
}

.header-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.custom-tag {
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(88, 17, 238, 0.1) 0%, rgba(4, 5, 143, 0.1) 100%);
  border: 1px solid rgba(88, 17, 238, 0.2);
}

/* Cartes d'informations */
.info-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  height: 100%;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 17, 238, 0.1);
  border-color: rgba(88, 17, 238, 0.2);
}

.info-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #02061E;
}

/* Boutons d'actions */
.action-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-width: 2px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* STYLES EXISTANTS MODIFIÉS */
.cedii-btn-primary { 
  background-color: #5811EE;
  color: white;
  border-color: #5811EE;
}

.cedii-btn-primary:hover {
  background-color: #04058F;
  border-color: #04058F;
}

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

/* Overrides Naive UI */
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

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 1.5rem !important;
  }
  
  .header-icon-container {
    width: 50px;
    height: 50px;
  }
  
  .header-icon {
    font-size: 1.5rem;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .header-subtitle {
    font-size: 0.85rem;
  }
  
  .header-info-row .row {
    flex-direction: column;
  }
  
  .header-actions .d-flex {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .action-btn {
    flex: 1;
    min-width: 140px;
  }
}

@media (max-width: 576px) {
  .header-title {
    font-size: 1.25rem;
  }
  
  .custom-tag {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .info-card {
    padding: 1rem !important;
  }
  
  .action-btn {
    font-size: 0.85rem;
  }
}
</style>

