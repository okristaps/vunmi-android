<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="handleClose"
    class="keyboard-modal"
  >
    <div class="modal-container">
      <div class="header-row">
        <span class="product-name">ENTER AMOUNT</span>
        <ion-icon
          :icon="closeOutline"
          class="close-icon"
          @click="handleClose"
        />
      </div>

      <div class="amount-row">
        <div class="amount-label">
          <span class="amount-prefix">CHF</span>
          <span class="amount-value">{{ formattedAmount }}</span>
        </div>
      </div>

      <div class="keyboard-container">
        <div class="numpad-grid">
          <div
            v-for="n in 9"
            :key="n"
            class="grid-cell"
            @click="addDigit(n.toString())"
          >
            {{ n }}
          </div>
          <div class="grid-cell" @click="addDigit('0')">0</div>
          <div class="grid-cell double-zero" @click="addDigit('00')">00</div>
        </div>
        <div class="side-buttons">
          <div class="delete-btn" @click="backspace">
            <ion-icon :icon="backspaceOutline" />
          </div>
          <div class="ok-cell" @click="handleCharge">OK</div>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script>
import { IonModal, IonIcon } from '@ionic/vue';
import { closeOutline, backspaceOutline } from 'ionicons/icons';
import { useKeyboardInput } from './composables/useKeyboardInput';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'KeyboardModal',
  components: {
    IonModal,
    IonIcon
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'free',
      validator: (value) => ['free', 'restricted'].includes(value)
    }
  },
  emits: ['update:isOpen', 'charge'],
  setup(props, { emit }) {
    const { amount, addDigit, backspace, formatAmount } = useKeyboardInput({
      mode: props.mode
    });

    const formattedAmount = computed(() => formatAmount(amount.value));

    const handleClose = () => emit('update:isOpen', false);

    const handleCharge = () => {
      if (!amount.value) return;
      const numericAmount = parseFloat(amount.value) / 100;
      emit('charge', numericAmount);
      handleClose();
    };

    return {
      amount,
      addDigit,
      backspace,
      formattedAmount,
      handleClose,
      handleCharge,
      closeOutline,
      backspaceOutline
    };
  }
});
</script>

<style scoped>
@import './styles/modal.css';
@import './styles/keyboard.css';
</style> 