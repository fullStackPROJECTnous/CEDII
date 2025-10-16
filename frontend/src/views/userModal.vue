<template>
  <div v-if="isVisible" class="modal-backdrop">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" @click="$emit('close')"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="saveUser">
                    <div class="mb-3">
                        <label for="loginUti" class="form-label">Login</label>
                        <input type="text" class="form-control" id="loginUti" v-model="userForm.loginUti" required>
                    </div>

                    <div class="mb-3">
                        <label for="roleUti" class="form-label">Rôle</label>
                        <select class="form-select" id="roleUti" v-model="userForm.roleUti" required>
                            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="motDePasseUti" class="form-label">Mot de passe</label>
                        <input type="password" class="form-control" id="motDePasseUti" v-model="userForm.motDePasseUti" :required="mode === 'add'">
                        <small v-if="mode === 'edit'" class="form-text text-muted">Laisser vide pour ne pas changer le mot de passe.</small>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="$emit('close')">Annuler</button>
                        <button type="submit" class="btn btn-primary">{{ mode === 'add' ? 'Ajouter' : 'Sauvegarder' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
//import UserService from '../services/ServiceUser'; 
import { useToast } from 'vue-toastification';
import ServiceUser from '../services/ServiceUser';

const props = defineProps({
    isVisible: Boolean,
    mode: String, // 'add' ou 'edit'
    initialUser: Object
});

const emit = defineEmits(['close', 'user-saved']);
const toast = useToast();

const roles = ['admin', 'reception', 'finance', 'client']; // Les rôles de votre cahier des charges
const defaultForm = { loginUti: '', motDePasseUti: '', roleUti: 'client' };
const userForm = ref({ ...defaultForm });

const modalTitle = computed(() => props.mode === 'add' ? 'Ajouter un nouvel utilisateur' : `Modifier ${props.initialUser?.loginUti}`);

watch(() => props.isVisible, (newVal) => {
    if (newVal) {
        if (props.mode === 'edit' && props.initialUser) {
            // Remplir le formulaire pour la modification (sauf le mot de passe)
            userForm.value = {
                loginUti: props.initialUser.loginUti,
                roleUti: props.initialUser.roleUti,
                motDePasseUti: '' // Ne jamais pré-remplir le mot de passe
            };
        } else {
            // Réinitialiser pour l'ajout
            userForm.value = { ...defaultForm };
        }
    }
}, { immediate: true });

const saveUser = async () => {
    try {
        if (props.mode === 'add') {
            await ServiceUser.saveUser(userForm.value);
            toast.success("Utilisateur ajouté avec succès.");
        } else {
            // Modification (passe l'ID)
            const idUti = props.initialUser.idUti;
            await ServiceUser.updateUser(idUti, userForm.value);
            toast.success("Utilisateur mis à jour.");
        }
        
        emit('user-saved'); // Signale au parent de rafraîchir la liste
        emit('close');
    } catch (error) {
        console.error("Erreur de sauvegarde:", error);
        toast.error(`Échec de l'opération: ${error.response?.data?.message || error.message}`);
    }
};
</script>

<style scoped>
/* Styles de base pour la modale Vue.js (si vous n'utilisez pas directement les composants Bootstrap JS) */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050; /* Doit être au-dessus de tout */
}
.modal-content {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>