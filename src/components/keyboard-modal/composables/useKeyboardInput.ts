import { ref } from "vue";
import type { Ref } from "vue";

export type InputMode = "free" | "restricted";

interface KeyboardConfig {
  mode: InputMode;
}

export function useKeyboardInput(config: KeyboardConfig) {
  const amount: Ref<string> = ref("");
  const maxLength = 20;

  const isValidInput = (currentValue: string, newDigit: string): boolean => {
    // prevent leading zeros
    if (currentValue === "" && (newDigit === "0" || newDigit === "00")) {
      return false;
    }

    if (config.mode === "free") return true;

    //  restricted mode (only numbers ending in 0 or 5)
    const newValue = currentValue + newDigit;
    if (newValue.length === 1) return true; //  any first digit
    return newValue.endsWith("0") || newValue.endsWith("5");
  };

  const addDigit = (digit: string): void => {
    // handle special case  '00'
    if (digit === "00") {
      if (amount.value.length + 2 <= maxLength && isValidInput(amount.value, "00")) {
        amount.value += digit;
      }
      return;
    }

    // handle single digits
    if (digit.length === 1 && amount.value.length < maxLength) {
      if (isValidInput(amount.value, digit)) {
        amount.value += digit;
      }
    }
  };

  const clearAmount = (): void => {
    amount.value = "";
  };

  const backspace = (): void => {
    amount.value = amount.value.slice(0, -1);
  };

  const formatAmount = (value: string): string => {
    if (!value) return "0.00";
    const numericValue = parseFloat(value) / 100;
    return numericValue.toFixed(2);
  };

  return {
    amount,
    addDigit,
    clearAmount,
    backspace,
    formatAmount,
  };
}
