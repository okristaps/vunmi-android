import { ref } from "vue";

/**
 * @typedef {'free' | 'restricted'} InputMode
 */

/**
 * @typedef {Object} KeyboardConfig
 * @property {InputMode} mode - The input mode for the keyboard
 */

/**
 * Creates a keyboard input handler with the specified configuration
 * @param {KeyboardConfig} config - The configuration object for the keyboard
 * @returns {Object} An object containing keyboard input handling methods and state
 */
export function useKeyboardInput(config) {
  const amount = ref("");
  const maxLength = 20;

  /**
   * Validates if the input combination is allowed based on the current mode
   * @param {string} currentValue - The current value in the input
   * @param {string} newDigit - The new digit to be added
   * @returns {boolean} Whether the input is valid
   */
  const isValidInput = (currentValue, newDigit) => {
    // prevent leading zeros
    if (currentValue === "" && (newDigit === "0" || newDigit === "00")) {
      return false;
    }

    if (config.mode === "free") return true;

    // restricted mode (only numbers ending in 0 or 5)
    const newValue = currentValue + newDigit;
    if (newValue.length === 1) return true; // any first digit
    return newValue.endsWith("0") || newValue.endsWith("5");
  };

  /**
   * Adds a digit to the current amount
   * @param {string} digit - The digit to add
   */
  const addDigit = (digit) => {
    // handle special case '00'
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

  /**
   * Clears the current amount
   */
  const clearAmount = () => {
    amount.value = "";
  };

  /**
   * Removes the last digit from the amount
   */
  const backspace = () => {
    amount.value = amount.value.slice(0, -1);
  };

  /**
   * Formats the amount as a decimal number
   * @param {string} value - The value to format
   * @returns {string} The formatted amount
   */
  const formatAmount = (value) => {
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
