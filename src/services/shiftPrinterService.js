import { AlignmentModeEnum, SunmiPrinter } from "@kduma-autoid/capacitor-sunmi-printer";
import logger from "@/utils/logger.js";

const width = 48;
const line = "_".repeat(width) + "\n";

class ShiftPrinterService {
  constructor() {
    this.isConnected = false;
  }

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

  async printShiftHeader(shiftData) {
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.setFontSize({ size: 24 });

    // Title
    SunmiPrinter.setBold({ enable: true });
    SunmiPrinter.printText({ text: "Shift report\n" });
    SunmiPrinter.setBold({ enable: false });

    SunmiPrinter.printText({ text: "\n" });

    // Basic info
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.LEFT });
    SunmiPrinter.printText({ text: `Shift number: ${shiftData.shift_id}\n` });
    SunmiPrinter.printText({ text: `POS: ${shiftData.pos_name}\n` });
    // SunmiPrinter.printText({ text: "\n" });
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });
    // SunmiPrinter.printText({ text: "\n" });
    // Shift opened info
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.LEFT });
    SunmiPrinter.printText({ text: "Shift opened:\n" });
    SunmiPrinter.printText({ text: shiftData.opener_name });

    // Format and print the opening time on the right
    const openDate = new Date(shiftData.opened_at);
    const formattedOpenDate = openDate
      .toLocaleString("de-CH", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    SunmiPrinter.printColumnsString({
      lines: [
        { text: "", proportion: 2, align: AlignmentModeEnum.LEFT },
        { text: formattedOpenDate, proportion: 1, align: AlignmentModeEnum.RIGHT },
      ],
    });
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.printText({ text: line });
  }

  async printCashDrawerSection(shiftData) {
    SunmiPrinter.printText({ text: "\n" });
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.printText({ text: "Cash drawer\n" });
    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });
    const cashItems = [
      { label: "Starting cash", amount: 0 },
      { label: "Cash payments", amount: shiftData.total_cash },
      { label: "Money in", amount: shiftData.total_money_in },
      { label: "Money out", amount: shiftData.total_money_out },
      { label: "Expected cash amount", amount: shiftData.total_balance, isBold: true },
    ];

    for (const item of cashItems) {
      if (item.isBold) {
        SunmiPrinter.setBold({ enable: true });
      }
      SunmiPrinter.printColumnsString({
        lines: [
          { text: item.label, proportion: 2, align: AlignmentModeEnum.LEFT },
          { text: `CHF ${item.amount.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
        ],
      });
      if (item.isBold) {
        SunmiPrinter.setBold({ enable: false });
      }
    }

    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });
  }

  async printSalesSummary(shiftData) {
    SunmiPrinter.printText({ text: "Sales summary\n" });

    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });
    const salesItems = [
      { label: "Gross sales", amount: shiftData.total_gross },
      { label: "Net sales", amount: shiftData.total_gross - shiftData.total_tax, isBold: true },
      { label: "Card", amount: shiftData.total_card },
      { label: "Cash", amount: shiftData.total_cash },
      { label: "Taxes", amount: shiftData.total_tax },
    ];

    for (const item of salesItems) {
      if (item.isBold) {
        SunmiPrinter.setBold({ enable: true });
      }
      SunmiPrinter.printColumnsString({
        lines: [
          { text: item.label, proportion: 2, align: AlignmentModeEnum.LEFT },
          { text: `CHF ${item.amount.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
        ],
      });
      if (item.isBold) {
        SunmiPrinter.setBold({ enable: false });
      }
    }
    SunmiPrinter.printText({ text: line });
  }

  async printFooter(shiftData) {
    // Print report date
    const reportDate = new Date(shiftData.report_print_date);
    const formattedReportDate = reportDate
      .toLocaleString("de-CH", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.RIGHT });
    SunmiPrinter.printText({ text: formattedReportDate });
  }

  async printShiftReport(shiftData) {
    try {
      if (!shiftData) {
        console.error("Invalid shift data provided");
        return;
      }

      SunmiPrinter.enterPrinterBuffer();

      // Print each section
      await this.printShiftHeader(shiftData);
      await this.printCashDrawerSection(shiftData);
      await this.printSalesSummary(shiftData);
      await this.printFooter(shiftData);

      // Final formatting
      SunmiPrinter.printText({ text: "\n" });
      SunmiPrinter.cutPaper();
      SunmiPrinter.exitPrinterBuffer();

      console.log("Shift report printed successfully");
    } catch (error) {
      console.error("Error printing shift report:", error);
    }
  }
}

// Create and export a singleton instance
const shiftPrinterService = new ShiftPrinterService();
export default shiftPrinterService;
