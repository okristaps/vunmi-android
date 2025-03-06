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
        <p v-if="printerConnected" class="status connected">Printer connected!</p>
        <p v-else class="status connecting">
          Test build? Connecting to printer...
          <span v-if="connectionError" class="error"> Error: {{ connectionError }} </span>
        </p>
        <div class="button-container">
          <ion-button
            @click="handlePrintClick"
            class="print-btn"
            :disabled="!printerConnected || isPrinting"
          >
            <ion-spinner v-if="isPrinting" name="crescent"></ion-spinner>
            <span v-else>Print Receipt</span>
          </ion-button>

          <ion-button
            @click="handleShiftPrintClick"
            class="print-btn"
            :disabled="!printerConnected || isShiftPrinting"
            color="secondary"
          >
            <ion-spinner v-if="isShiftPrinting" name="crescent"></ion-spinner>
            <span v-else>Print Shift Report</span>
          </ion-button>

          <ion-button @click="goToPrintAmount" class="print-btn" :disabled="isPrinting">
            Print Amount
          </ion-button>

          <ion-button 
            @click="goToLogin" 
            class="print-btn" 
            color="tertiary"
          >
            Enter PIN
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import printerService from "@/services/ReceiptPrinterService";
import shiftPrinterService from "@/services/shiftPrinterService";

const router = useRouter();
const printerConnected = ref(false);
const connectionError = ref("");
const isPrinting = ref(false);
const isShiftPrinting = ref(false);

const goToPrintAmount = () => {
  router.push("/print-amount");
};

const goToLogin = () => {
  router.push("/login");
};

const saleData = {
  sale: {
    id: 32,
    created_at: "2025-03-04T11:32:42.412Z",
    receipt_number: "A4-32",
    total_money: 21.5,
    total_tax: 0.56,
    receipt_date: "2025-03-04T11:32:42.412Z",
    user_id: 1,
    pos_id: 4,
    shift_id: 13,
    user_name: "Max"
  },
  sale_items: [
    {
      id: 35,
      sale_id: 32,
      name: "Apfelmost 5 Liter pasteurisiert",
      product_id: 6,
      quantity: 1,
      price: 15,
      total_money: 0
    },
    {
      id: 36,
      sale_id: 32,
      name: "Apfelringli mit Schale 100g",
      product_id: 5,
      quantity: 1,
      price: 6.5,
      total_money: 0
    }
  ],
  sale_payments: [
    {
      id: 45,
      sale_id: 32,
      name: "cash",
      type: "cash",
      amount: 21.5,
      paid_at: "2025-03-04T11:32:42.412Z"
    }
  ]
};

// Sample shift data
const shiftData = {
  shift_id: 1,
  pos_name: "Pos auto 1",
  opened_at: "2024-01-01T01:00",
  closed_at: "2024-01-01T02:00",
  opener_name: "Janis",
  closer_name: "Janis",
  total_sales_count: 87,
  total_gross: 1203,
  total_card: 1000,
  total_cash: 203,
  total_tax: 23,
  total_money_in: 100,
  total_money_out: 100,
  total_balance: 200,
  total_money_in_info: [
    {
      type: "cash",
      amount: 100,
      comment: "",
      created_at: "2024-01-01T01:00"
    }
  ],
  total_money_out_info: [
    {
      type: "cash",
      amount: 100,
      comment: "",
      created_at: "2024-01-01T01:00"
    }
  ],
  report_print_date: "2024-01-01T02:00"
};

const handlePrintClick = async () => {
  isPrinting.value = true;
  try {
    await printerService.printReceipt(saleData);
  } catch (error) {
    console.error("Error printing receipt:", error);
  } finally {
    isPrinting.value = false;
  }
};

const handleShiftPrintClick = async () => {
  isShiftPrinting.value = true;
  try {
    await shiftPrinterService.printShiftReport(shiftData);
  } catch (error) {
    console.error("Error printing shift report:", error);
  } finally {
    isShiftPrinting.value = false;
  }
};

onMounted(async () => {
  printerConnected.value = await printerService.connect() && await shiftPrinterService.connect();
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
