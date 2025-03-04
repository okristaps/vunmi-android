<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Sunmi Printer Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Sunmi Printer Demo</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <p v-if="printerConnected" class="status connected">
          Printer connected!
        </p>
        <p v-else class="status connecting">
          Test build? Connecting to printer...
          <span v-if="connectionError" class="error">
            Error: {{ connectionError }}
          </span>
        </p>
        <div class="button-container">
          <ion-button 
            @click="printHelloWorld" 
            class="print-btn"
            :disabled="isPrinting"
          >
            <ion-spinner v-if="isPrinting" name="dots"></ion-spinner>
            <span v-else>"Spied šito!"</span>
          </ion-button>
          <ion-button 
            @click="goToPrintAmount" 
            class="print-btn"
            :disabled="isPrinting"
          >
            Print Amount
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonSpinner 
} from '@ionic/vue'
import { SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer'
import { useRouter } from 'vue-router'
import logger from '@/utils/logger.js'

const router = useRouter()
const printerConnected = ref(false)
const connectionError = ref('')
const isPrinting = ref(false)

const goToPrintAmount = () => {
  router.push('/print-amount')
}

async function bindPrinterService() {
  try {
    await SunmiPrinter.bindService()
    printerConnected.value = true
    logger.log("Printer connected")
  } catch (error) {
    connectionError.value = error.message || 'Unknown error'
    logger.error("Printer connection failed:", error)
  }
}

async function printHelloWorld() {
  if (isPrinting.value) return;
  
  try {
    isPrinting.value = true
    await SunmiPrinter.printText({ text: "Spied šito!" })
    logger.log("Print successful")
  } catch (error) {
    logger.error("Print failed:", error)
    connectionError.value = error.message || 'Print failed'
  } finally {
    isPrinting.value = false
  }
}

onMounted(() => {
  bindPrinterService()
})
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

.status {
  font-size: 1.1rem;
  margin: 0;
}

.connected {
  color: #2e7d32;
  font-weight: 600;
}

.connecting {
  color: #555;
}

.error {
  color: #d32f2f;
  font-weight: bold;
  margin-left: 8px;
}

.print-btn {
  --background: #1976d2;
  --color: #fff;
  --border-radius: 8px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  --padding-start: 24px;
  --padding-end: 24px;
  font-size: 1rem;
  text-transform: none;
  min-width: 200px;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}

ion-spinner {
  margin: 0 auto;
}
</style>
