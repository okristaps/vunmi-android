<template>
  <ion-page>
    <ion-content>
      <div class="login-container">
        <div class="logo-section">
          <img src="@/assets/logo.png" alt="Loyverse" class="logo" />
          <div class="pin-display">
            <div class="pin-text" :class="{ error: showError }">
              {{ errorMessage }}
            </div>
            <div class="pin-dots" :class="{ error: showError }">
              <div 
                v-for="i in PIN_LENGTH" 
                :key="i" 
                class="pin-dot" 
                :class="{ filled: pin.length >= i, error: showError }"
              />
            </div>
          </div>
        </div>
        <div class="numpad">
          <div 
            v-for="row in numpadRows" 
            :key="row[0]" 
            class="numpad-row"
          >
            <button 
              v-for="num in row" 
              :key="num" 
              class="numpad-button"
              @click="handleNumpadPress(num)"
              :class="{ 
                'function-button': num === 'Clear', 
                'empty': num === ' ' 
              }"
            >
              {{ num }}
            </button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';

const PIN_LENGTH = 4;
const CORRECT_PIN = '1234';
const ERROR_TIMEOUT = 1000;

const router = useRouter();


const pin = ref('');
const showError = ref(false);


const errorMessage = computed(() => showError.value ? 'Incorrect PIN' : 'Enter PIN');


const numpadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [' ', '0', 'Clear']
];


const resetPin = () => {
  pin.value = '';
  showError.value = false;
};

const handlePinSubmit = () => {
  if (pin.value === CORRECT_PIN) {
    showError.value = false;
    resetPin();
    router.push('/home');
    return;
  }
  
  showError.value = true;
  setTimeout(resetPin, ERROR_TIMEOUT);
};

const handleNumpadPress = (value) => {
  if (showError.value) return;

  if (value === 'Clear') {
    resetPin();
    return;
  }
  
  if (value === ' ') return;
  
  if (pin.value.length < PIN_LENGTH) {
    pin.value += value;
  }

  if (pin.value.length === PIN_LENGTH) {
    handlePinSubmit();
  }
};
</script>

<style scoped>
.login-container {
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #2f3241;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.logo {
  width: 180px;
  height: auto;
}

.pin-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pin-text {
  font-size: 1rem;
  color: white;
  font-weight: normal;
}

.pin-text.error {
  color: #ff4444;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.pin-dots {
  display: flex;
  gap: 0.75rem;
}

.pin-dots.error {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.pin-dot {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.pin-dot.filled {
  background-color: white;
}

.pin-dot.error {
  border-color: #ff4444;
}

.pin-dot.error.filled {
  background-color: #ff4444;
}

.numpad {
  width: 70%;
  display: flex;
  flex-direction: column;
}

.numpad-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.numpad-button {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  min-height: 135px;
  max-height: 100%;
  padding: 0;
}

.numpad-button:active {
  background-color: rgba(255, 255, 255, 0.05);
}

.function-button {
  color: white;
  font-size: 1rem;
}

.numpad-button.empty {
  border: none;
  background: transparent;
  cursor: default;
}

.numpad-button.empty:active {
  background: transparent;
}
</style> 