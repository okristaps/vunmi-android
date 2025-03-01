import { ref } from "vue";
import type { Ref } from "vue";

export function useKeyboardInput() {
  const amount: Ref<string> = ref("");
  const maxLength = 10;

  const addDigit = (digit: string): void => {
    // handle special case for '00'
    if (digit === "00" && amount.value.length + 2 <= maxLength) {
      amount.value += digit;
    } else if (digit.length === 1 && amount.value.length < maxLength) {
      amount.value += digit;
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
