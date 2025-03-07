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
        <div class="amount-label" :class="{ 'invalid': !isValidAmount && mode === 'restricted' }">
          <span class="amount-prefix" v-if="mode !== 'int'">CHF</span>
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
          <div 
            class="ok-cell" 
            :class="{ 'invalid': !isValidAmount && mode === 'restricted' }"
            @click="handleCharge"
          >
            OK
          </div>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script>
import { IonModal, IonIcon } from '@ionic/vue';
import { closeOutline, backspaceOutline } from 'ionicons/icons';
import { useKeyboardInput } from './composables/useKeyboardInput';
import { computed, defineComponent, watch } from 'vue';
import logger from '@/utils/logger';

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
      validator: (value) => ['free', 'restricted', 'int'].includes(value)
    },
    initialValue: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['update:isOpen', 'charge'],
  setup(props, { emit }) {
    const { amount, addDigit, backspace, formatAmount, isValidAmount, getNumericAmount, setAmount } = useKeyboardInput({
      mode: props.mode
    });

    watch(() => props.initialValue, (newValue) => {
      if (newValue !== undefined && newValue !== '') {
        setAmount(newValue.toString());
      }
    }, { immediate: true });

    const formattedAmount = computed(() => {
      if (props.mode === 'int') {
        return amount.value || '0';
      }
      return formatAmount(amount.value);
    });

    const handleClose = () => {
      logger.debug('Modal closing');
      emit('update:isOpen', false);
    };

    const handleCharge = () => {
      if (!amount.value) {
        logger.debug('No amount entered');
        return;
      }
      
      if (props.mode === 'restricted' && !isValidAmount.value) {
        logger.debug('Invalid amount in restricted mode:', amount.value);
        return;
      }
      
      const numericAmount = getNumericAmount();
      logger.log('Processing charge:', numericAmount.toString());
      emit('charge', numericAmount.toNumber());
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
      backspaceOutline,
      isValidAmount
    };
  }
});
</script>

<style scoped>
@import './styles/modal.css';
@import './styles/keyboard.css';

.keyboard-modal {
  --width: 80%;
  --height: 95%;
  --background: transparent;
  --backdrop-opacity: 0.5;
  --border-radius: 8px;
  --box-shadow: none;
}

.keyboard-modal::part(content) {
  border: none;
  border-radius: 8px;
  box-shadow: none;
}

.modal-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.amount-label.invalid .amount-value {
  color: #dc3545;
}

.ok-cell.invalid {
  background-color: #dc3545;
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 