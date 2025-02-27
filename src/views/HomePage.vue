<template>
  <ion-page>
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-title>Sunmi Printer Demo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen="true">
      <div id="container" style="padding: 16px;">
        <div v-if="printerConnected">
          <p>Printer connected!</p>
          <ion-button @click="printHelloWorld">
            Print "Hello World"
          </ion-button>
        </div>
        <div v-else>
          <p>Connecting to printer...</p>
          <p v-if="connectionError" style="color: red;">
            Error: {{ connectionError }}
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {SunmiPrinter} from '@kduma-autoid/capacitor-sunmi-printer'


const printerConnected = ref(false)
const connectionError = ref('')

async function bindPrinterService() {
  try {
    // bind service?
    await SunmiPrinter.bindService()
    printerConnected.value = true
    console.log("Printer service bound successfully")
  } catch (error) {
    connectionError.value = error.message || 'Unknown error'
    console.error("Error binding to printer service:", error)
  }
}

async function printHelloWorld() {
  try {
    await SunmiPrinter.printText({ text: "Hello World" })
    console.log("Printed: Hello World")
  } catch (error) {
    console.error("Error printing text:", error)
  }
}

onMounted(() => {
  //bind on mount
  bindPrinterService()
})
</script>
