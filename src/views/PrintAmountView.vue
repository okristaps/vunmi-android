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
        <ion-button @click="openKeyboard" class="print-btn">
          Enter Amount to Print
        </ion-button>
      </div>

      <keyboard-modal
        v-model:is-open="isKeyboardOpen"
        @charge="handleCharge"
      />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'

import { SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer'
import KeyboardModal from '../components/keyboard-modal/KeyboardModal.vue'

const isKeyboardOpen = ref(false)

const openKeyboard = () => {
  isKeyboardOpen.value = true
}

const handleCharge = async (amount) => {
  try {
    await SunmiPrinter.printText({ text: `Amount: CHF ${amount.toFixed(2)}` })
    console.log(`Printed amount: CHF ${amount.toFixed(2)}`)
  } catch (error) {
    console.error("Error printing amount:", error)
  }
}
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
}
</style> 