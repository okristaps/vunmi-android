import { AlignmentModeEnum, SunmiPrinter } from "@kduma-autoid/capacitor-sunmi-printer";
import logger from "@/utils/logger.js";

class ShiftPrinterService {
  constructor() {
    this.isConnected = false;
    this.width = 48;
    this.line = "_".repeat(this.width) + "\n";
  }

  // Utility methods for common printer operations
  setFontStyle(size = 24, isBold = false, alignment = AlignmentModeEnum.LEFT) {
    SunmiPrinter.setFontSize({ size });
    SunmiPrinter.setBold({ enable: isBold });
    SunmiPrinter.setAlignment({ alignment });
  }

  printLine() {
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.printText({ text: this.line });
  }

  printAmount(label, amount, isBold = false) {
    if (isBold) SunmiPrinter.setBold({ enable: true });
    SunmiPrinter.printColumnsString({
      lines: [
        { text: label, proportion: 2, align: AlignmentModeEnum.LEFT },
        { text: `CHF ${amount.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
      ],
    });
    if (isBold) SunmiPrinter.setBold({ enable: false });
  }

  formatDate(date) {
    return new Date(date)
      .toLocaleString("de-CH", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  }

  // Connection management
  async connect() {
    try {
      await SunmiPrinter.bindService();
      this.isConnected = true;
      logger.log("Shift Printer connected");
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error("Shift Printer connection failed:", error);
      return false;
    }
  }

  // Print section methods
  async printShiftHeader(shiftData) {
    // Title
    this.setFontStyle(24, true, AlignmentModeEnum.CENTER);
    SunmiPrinter.printText({ text: "Shift report\n\n" });

    // Basic info
    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    SunmiPrinter.printText({ text: `Shift number: ${shiftData.shift_id}\n` });
    SunmiPrinter.printText({ text: `POS: ${shiftData.pos_name}\n` });
    this.printLine();
    SunmiPrinter.printText({ text: "\n" });

    // Shift opened info
    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    SunmiPrinter.printText({ text: "Shift opened:\n" });
    SunmiPrinter.printText({ text: shiftData.opener_name });

    // Opening time
    SunmiPrinter.printColumnsString({
      lines: [
        { text: "", proportion: 2, align: AlignmentModeEnum.LEFT },
        { text: this.formatDate(shiftData.opened_at), proportion: 1, align: AlignmentModeEnum.RIGHT },
      ],
    });
    this.printLine();
  }

  async printCashDrawerSection(shiftData) {
    SunmiPrinter.printText({ text: "\n" });
    this.setFontStyle(24, false, AlignmentModeEnum.CENTER);
    SunmiPrinter.printText({ text: "Cash drawer\n" });
    this.printLine();
    SunmiPrinter.printText({ text: "\n" });

    const cashItems = [
      { label: "Starting cash", amount: 0 },
      { label: "Cash payments", amount: shiftData.total_cash },
      { label: "Money in", amount: shiftData.total_money_in },
      { label: "Money out", amount: shiftData.total_money_out },
      { label: "Expected cash amount", amount: shiftData.total_balance, isBold: true },
    ];

    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    for (const item of cashItems) {
      this.printAmount(item.label, item.amount, item.isBold);
    }

    this.printLine();
    SunmiPrinter.printText({ text: "\n" });
  }

  async printSalesSummary(shiftData) {
    this.setFontStyle(24, false, AlignmentModeEnum.CENTER);
    SunmiPrinter.printText({ text: "Sales summary\n" });
    this.printLine();
    SunmiPrinter.printText({ text: "\n" });

    const salesItems = [
      { label: "Gross sales", amount: shiftData.total_gross, isBold: true },
      { label: "Refunds", amount: 0 },
      { label: "Discounts", amount: 0 },
      { label: "Net sales", amount: shiftData.total_gross - shiftData.total_tax, isBold: true },
      { label: "Card", amount: shiftData.total_card },
      { label: "Cash", amount: shiftData.total_cash },
      { label: "Taxes", amount: shiftData.total_tax },
    ];

    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    for (const item of salesItems) {
      this.printAmount(item.label, item.amount, item.isBold);
    }
    this.printLine();
  }

  async printFooter(shiftData) {
    SunmiPrinter.printText({ text: "\n" });
    this.printLine();

    // Print report date
    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    SunmiPrinter.printText({ text: `Report date: ${this.formatDate(shiftData.report_print_date)}\n` });

    // Print current time
    const now = new Date();
    this.setFontStyle(24, false, AlignmentModeEnum.LEFT);
    SunmiPrinter.printText({ text: `Print time: ${this.formatDate(now)}` });
  }

  // Main print method
  async printShiftReport(shiftData) {
    try {
      if (!shiftData) {
        throw new Error("Invalid shift data provided");
      }

      SunmiPrinter.enterPrinterBuffer();

      await this.printShiftHeader(shiftData);
      await this.printCashDrawerSection(shiftData);
      await this.printSalesSummary(shiftData);
      await this.printFooter(shiftData);

      SunmiPrinter.printText({ text: "\n" });
      SunmiPrinter.cutPaper();
      SunmiPrinter.exitPrinterBuffer();

      logger.log("Shift report printed successfully");
    } catch (error) {
      logger.error("Error printing shift report:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const shiftPrinterService = new ShiftPrinterService();
export default shiftPrinterService;
