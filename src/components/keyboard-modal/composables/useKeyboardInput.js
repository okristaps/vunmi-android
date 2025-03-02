import { ref, computed } from "vue";

export function useKeyboardInput(config) {
  const amount = ref("");
  const maxLength = 20;

  const isValidInput = (currentValue, newDigit) => {
    if (currentValue === "" && (newDigit === "0" || newDigit === "00")) {
      return false;
    }
    return true;
  };

  const addDigit = (digit) => {
    if (digit === "00") {
      if (amount.value.length + 2 <= maxLength && isValidInput(amount.value, "00")) {
        amount.value += digit;
      }
      return;
    }

    if (digit.length === 1 && amount.value.length < maxLength) {
      if (isValidInput(amount.value, digit)) {
        amount.value += digit;
      }
    }
  };

  const clearAmount = () => {
    amount.value = "";
  };

  const backspace = () => {
    amount.value = amount.value.slice(0, -1);
  };

  const formatAmount = (value) => {
    if (!value) return "0.00";
    const numericValue = parseFloat(value) / 100;
    return numericValue.toFixed(2);
  };

  const isValidAmount = computed(() => {
    if (!amount.value || config.mode === "free") return true;
    const cents = amount.value.slice(-2);
    return cents.endsWith("0") || cents.endsWith("5");
  });

  return {
    amount,
    addDigit,
    clearAmount,
    backspace,
    formatAmount,
    isValidAmount,
  };
}
