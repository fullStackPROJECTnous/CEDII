<template>
  <n-modal
    :show="isVisible"
    preset="dialog"
    :title="modalTitle"
    positive-text="Sauvegarder"
    negative-text="Annuler"
    :loading="isSubmitting"
    @positive-click="saveUser"
    @negative-click="closeModal"
    @close="closeModal"
    @update:show="$emit('update:isVisible', $event)"
    style="width: 500px"
    class="scrollable-modal"
  >
    <div class="modal-scroll-content">
      <n-form :model="userForm" :rules="userRules" ref="userFormRef">
        <n-grid :cols="1" :x-gap="16" :y-gap="16">
          <!-- Login -->
          <n-gi>
            <n-form-item label="Login" path="loginUti" required>
              <n-input 
                v-model:value="userForm.loginUti" 
                placeholder="Nom d'utilisateur" 
                autofocus
                :maxlength="50"
              />
              <template #feedback>
                <div class="small text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  Le login sera utilisé pour se connecter
                </div>
              </template>
            </n-form-item>
          </n-gi>

          <!-- Rôle -->
          <n-gi>
            <n-form-item label="Rôle" path="roleUti" required>
              <n-select
                v-model:value="userForm.roleUti"
                :options="roleOptions"
                placeholder="Sélectionner le rôle"
                filterable
              />
            </n-form-item>
          </n-gi>

          <!-- Mot de passe -->
          <n-gi>
            <n-form-item 
              :label="mode === 'add' ? 'Mot de passe' : 'Nouveau mot de passe'" 
              path="motDePasseUti" 
              :required="mode === 'add'"
            >
              <n-input 
                v-model:value="userForm.motDePasseUti" 
                type="password"
                :placeholder="mode === 'add' ? 'Mot de passe (minimum 6 caractères)' : 'Laisser vide pour ne pas changer'" 
                show-password-on="click"
                :minlength="mode === 'add' ? 6 : 0"
              />
              <template #feedback>
                <div class="small text-muted">
                  <i class="bi bi-shield-check me-1"></i>
                  Minimum 6 caractères recommandés
                </div>
              </template>
            </n-form-item>
          </n-gi>

         
        </n-grid>
      </n-form>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import ServiceUser from '../services/ServiceUser';
import { 
  NModal, 
  NForm, 
  NFormItem, 
  NInput, 
  NSelect, 
  NGrid, 
  NGi, 
  NAlert 
} from 'naive-ui';

const props = defineProps({
  isVisible: Boolean,
  mode: String, // 'add' ou 'edit'
  initialUser: Object
});

const emit = defineEmits(['close', 'user-saved', 'update:isVisible']);

const toast = useToast();

// États
const userForm = ref({});
const userFormRef = ref(null);
const isSubmitting = ref(false);

// Options pour les selects
const roleOptions = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Réception', value: 'reception' },
  { label: 'Finance', value: 'finance' },
  { label: 'Client', value: 'client' }
];

// Règles de validation
const userRules = {
  loginUti: {
    required: true,
    message: 'Le login est requis',
    trigger: ['blur', 'input'],
    validator: (rule, value) => {
      if (!value || value.trim().length === 0) {
        return new Error('Le login est requis');
      }
      if (value.length < 3) {
        return new Error('Le login doit contenir au moins 3 caractères');
      }
      return true;
    }
  },
  motDePasseUti: {
    required: false,
    message: 'Le mot de passe est requis pour un nouvel utilisateur',
    trigger: ['blur'],
    validator: (rule, value) => {
      if (props.mode === 'add' && (!value || value.length === 0)) {
        return new Error('Le mot de passe est requis pour un nouvel utilisateur');
      }
      if (value && value.length > 0 && value.length < 6) {
        return new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      return true;
    }
  },
  roleUti: {
    required: true,
    message: 'Le rôle est requis',
    trigger: ['blur', 'change']
  }
};

// Computed properties
const modalTitle = computed(() => 
  props.mode === 'add' ? 'Ajouter un Nouvel Utilisateur' : `Modifier l'Utilisateur`
);

// Fonction pour fermer la modal
const closeModal = () => {
  emit('update:isVisible', false);
  emit('close');
};

// Watch pour initialiser le formulaire
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.initialUser) {
      // Remplir le formulaire pour la modification
      userForm.value = {
        loginUti: props.initialUser.loginUti,
        roleUti: props.initialUser.roleUti,
        motDePasseUti: '' // Ne jamais pré-remplir le mot de passe
      };
    } else {
      // Réinitialiser pour l'ajout
      userForm.value = {
        loginUti: '',
        motDePasseUti: '',
        roleUti: 'client'
      };
    }
    
    // Réinitialiser la validation du formulaire
    setTimeout(() => {
      if (userFormRef.value) {
        userFormRef.value.restoreValidation();
      }
    }, 100);
  }
}, { immediate: true });

// Fonction de sauvegarde
const saveUser = async () => {
  try {
    // Valider le formulaire avant de continuer
    await userFormRef.value.validate();
    
    isSubmitting.value = true;
    
    // Préparer les données pour l'API
    const userData = {
      loginUti: userForm.value.loginUti,
      roleUti: userForm.value.roleUti || 'client'
    };
    
    // Ajouter le mot de passe seulement s'il est fourni
    if (userForm.value.motDePasseUti && userForm.value.motDePasseUti.length > 0) {
      userData.motDePasseUti = userForm.value.motDePasseUti;
    }
    
    console.log('📤 Données utilisateur à envoyer:', userData);
    console.log('Mode:', props.mode);
    
    if (props.mode === 'add') {
      const response = await ServiceUser.saveUser(userData);
      console.log('📥 Réponse création:', response);
      toast.success('Utilisateur créé avec succès');
    } else {
      if (!props.initialUser?.idUti) {
        throw new Error('ID utilisateur manquant pour la modification');
      }
      const response = await ServiceUser.updateUser(props.initialUser.idUti, userData);
      console.log('📥 Réponse modification:', response);
      toast.success('Utilisateur modifié avec succès');
    }
    
    emit('user-saved'); // Signale au parent de rafraîchir la liste
    closeModal();
    
  } catch (error) {
    console.error("❌ Erreur détaillée de sauvegarde:", error);
    
    if (error.name === 'ValidateError') {
      toast.error('Veuillez remplir tous les champs obligatoires');
    } else {
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.error || 
                      error.message || 
                      'Erreur inconnue lors de la sauvegarde';
      toast.error(`Erreur: ${errorMsg}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* Modales avec scroll */
:deep(.scrollable-modal .n-dialog) {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

:deep(.scrollable-modal .n-dialog__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-scroll-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scrollbars pour les modales */
.modal-scroll-content::-webkit-scrollbar {
  width: 8px;
}

.modal-scroll-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-scroll-content::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 4px;
}

.modal-scroll-content::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}

/* Style pour les feedback de formulaire */
.small.text-muted {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
}

/* Pour les formulaires dans les modales */
:deep(.n-form-item) {
  margin-bottom: 8px;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  color: #495057;
}

:deep(.n-input) {
  border-radius: 6px;
}

:deep(.n-input:focus) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

:deep(.n-select) {
  border-radius: 6px;
}

:deep(.n-select:focus) {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Style pour l'alerte info */
:deep(.n-alert) {
  border-radius: 6px;
  margin-top: 8px;
}

/* Icônes dans les champs de formulaire */
:deep(.n-input-prefix) {
  color: #6c757d;
}

/* Responsive pour les petits écrans */
@media (max-width: 576px) {
  .modal-scroll-content {
    max-height: 50vh;
  }
  
  :deep(.n-form-item-label) {
    font-size: 0.9rem;
  }
  
  :deep(.n-input) {
    font-size: 0.9rem;
  }
}

/* Animation de fade in pour la modale */
:deep(.n-dialog) {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>