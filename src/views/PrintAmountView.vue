<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Print Amount</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Print Amount</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-button @click="openFreeKeyboard" class="print-btn">
          Enter Any Amount
        </ion-button>
        
        <ion-button @click="openRestrictedKeyboard" class="print-btn restricted">
          Enter Amount (0.05 steps)
        </ion-button>

        <ion-button @click="openIntegerKeyboard" class="print-btn integer">
          Enter Integer
        </ion-button>

        <ion-button @click="openInitialValueKeyboard" class="print-btn initial">
          Edit Amount (100.50)
        </ion-button>
      </div>

      <keyboard-modal
        v-model:is-open="isFreeKeyboardOpen"
        mode="free"
        @charge="handleCharge"
      />

      <keyboard-modal
        v-model:is-open="isRestrictedKeyboardOpen"
        mode="restricted"
        @charge="handleCharge"
      />

      <keyboard-modal
        v-model:is-open="isIntegerKeyboardOpen"
        mode="int"
        @charge="handleCharge"
      />

      <keyboard-modal
        v-model:is-open="isInitialValueKeyboardOpen"
        mode="free"
        :initial-value="100.50"
        @charge="handleCharge"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer';
import KeyboardModal from '../components/keyboard-modal/KeyboardModal.vue';

export default defineComponent({
  name: 'PrintAmountView',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    KeyboardModal
  },
  setup() {
    const isFreeKeyboardOpen = ref(false);
    const isRestrictedKeyboardOpen = ref(false);
    const isIntegerKeyboardOpen = ref(false);
    const isInitialValueKeyboardOpen = ref(false);

    const openFreeKeyboard = () => {
      isFreeKeyboardOpen.value = true;
    };

    const openRestrictedKeyboard = () => {
      isRestrictedKeyboardOpen.value = true;
    };

    const openIntegerKeyboard = () => {
      isIntegerKeyboardOpen.value = true;
    };

    const openInitialValueKeyboard = () => {
      isInitialValueKeyboardOpen.value = true;
    };

    const handleCharge = async (amount) => {
      try {
        await SunmiPrinter.printText({ text: `Amount: CHF ${amount.toFixed(2)}` });
        console.log(`Printed amount: CHF ${amount.toFixed(2)}`);
      } catch (error) {
        console.error("Error printing amount:", error);
      }
    };

    return {
      isFreeKeyboardOpen,
      isRestrictedKeyboardOpen,
      isIntegerKeyboardOpen,
      isInitialValueKeyboardOpen,
      openFreeKeyboard,
      openRestrictedKeyboard,
      openIntegerKeyboard,
      openInitialValueKeyboard,
      handleCharge
    };
  }
});
</script>

<style scoped>
#container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px); 
  background: #f9f9f9;
  text-align: center;
}

.print-btn {
  --background: #1976d2;
  --color: #fff;
  --border-radius: 8px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-size: 1.1rem;
  text-transform: none;
  margin-top: 12px;
  width: 100%;
  max-width: 300px;
}

.print-btn.restricted {
  --background: #27ae60;
}

.print-btn.integer {
  --background: #9c27b0;
}

.print-btn.initial {
  --background: #ff9800;
}
</style> 