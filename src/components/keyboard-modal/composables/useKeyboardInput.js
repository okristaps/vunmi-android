import { ref, computed } from "vue";
import Big from "big.js";
import logger from "@/utils/logger";

export function useKeyboardInput(config) {
  const amount = ref("");
  const maxLength = 20;

  const isValidInput = (currentValue, newDigit) => {
    if (currentValue === "" && (newDigit === "0" || newDigit === "00")) {
      logger.debug("Preventing leading zeros");
      return false;
    }
    return true;
  };

  const addDigit = (digit) => {
    if (digit === "00") {
      if (config.mode === "int") {
        logger.debug("Double zero not allowed in integer mode");
        return;
      }
      if (amount.value.length + 2 <= maxLength && isValidInput(amount.value, "00")) {
        amount.value += digit;
        logger.debug("Added 00:", amount.value);
      }
      return;
    }

    if (digit.length === 1 && amount.value.length < maxLength) {
      if (isValidInput(amount.value, digit)) {
        amount.value += digit;
        logger.debug("Added digit:", digit, "Current amount:", amount.value);
      }
    }
  };

  const clearAmount = () => {
    amount.value = "";
    logger.debug("Amount cleared");
  };

  const setAmount = (value) => {
    if (config.mode === "int") {
      amount.value = value.replace(/[^0-9]/g, "");
    } else {
      const numericValue = new Big(value).times(100).toString();
      amount.value = numericValue.replace(/[^0-9]/g, "");
    }
    logger.debug("Amount set to:", amount.value);
  };

  const backspace = () => {
    const oldValue = amount.value;
    amount.value = amount.value.slice(0, -1);
    logger.debug("Backspace:", oldValue, "->", amount.value);
  };

  const formatAmount = (value) => {
    if (!value) return "0.00";
    try {
      const numericValue = new Big(value).div(100);
      return numericValue.toFixed(2);
    } catch (error) {
      logger.error("Error formatting amount:", error);
      return "0.00";
    }
  };

  const isValidAmount = computed(() => {
    if (!amount.value || config.mode === "free") return true;
    if (config.mode === "int") return true;

    const cents = amount.value.slice(-2);
    const isValid = cents.endsWith("0") || cents.endsWith("5");
    if (!isValid) {
      logger.debug("Invalid amount in restricted mode:", amount.value);
    }
    return isValid;
  });

  const getNumericAmount = () => {
    if (!amount.value) return new Big(0);
    if (config.mode === "int") {
      return new Big(amount.value);
    }
    return new Big(amount.value).div(100);
  };

  return {
    amount,
    addDigit,
    clearAmount,
    setAmount,
    backspace,
    formatAmount,
    isValidAmount,
    getNumericAmount,
  };
}
