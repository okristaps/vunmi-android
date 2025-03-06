import {
  AlignmentModeEnum,
  BarcodeSymbologyEnum,
  BarcodeTextPositionEnum,
  BitmapPrintTypeEnum,
  SunmiPrinter,
} from "@kduma-autoid/capacitor-sunmi-printer";
import logger from "@/utils/logger.js";
import logoImage from "../assets/logo.png";
import "../assets/Oswald-Regular.ttf";
import { convertImageToBase64 } from "../utils/parseImageToBase64";

class ReceiptPrinterService {
  constructor() {
    this.isConnected = false;
  }

  async connect() {
    try {
      await SunmiPrinter.bindService();
      this.isConnected = true;
      logger.log("Printer connected");
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error("Printer connection failed:", error);
      return false;
    }
  }

  async printLogo() {
    try {
      const targetWidth = 500;
      const base64Data = await convertImageToBase64(logoImage, targetWidth);
      await SunmiPrinter.printBitmapCustom({
        bitmap: base64Data,
        type: BitmapPrintTypeEnum.DEFAULT,
      });
    } catch (error) {
      console.error("Error printing custom bitmap:", error);
    }
  }

  async printHeader(user_name) {
    const width = 44;
    const line = "_".repeat(width) + "\n";

    SunmiPrinter.setAntiWhitePrintStyle({ enable: false });
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    await this.printLogo();

    SunmiPrinter.setBold({ enable: true });
    SunmiPrinter.printText({ text: "\n" });

    //shop name and address
    SunmiPrinter.setFontName({ typeface: "Oswald-Regular" });
    SunmiPrinter.setFontSize({ size: 27 });
    SunmiPrinter.printText({ text: "Vunmi Shop Test" });
    SunmiPrinter.printText({ text: "\n" });
    SunmiPrinter.setBold({ enable: false });
    SunmiPrinter.setFontSize({ size: 25 });
    SunmiPrinter.printText({ text: "Some Random Address 12, Riga, Latvia LV-1035 \n" });
    SunmiPrinter.printText({ text: "VAT No. 123.456.789\n" });
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.LEFT });
    SunmiPrinter.printText({ text: `\nSeller: ${user_name}\n` });
    SunmiPrinter.printText({ text: line });
    SunmiPrinter.setFontSize({ size: 20 });
  }

  async printItems(sale_items) {
    SunmiPrinter.printText({ text: "\n" });

    for (const item of sale_items) {
      const { name = "Unknown Item", quantity = 1, price = 0 } = item;
      SunmiPrinter.printColumnsString({
        lines: [
          { text: name, proportion: 3, align: AlignmentModeEnum.LEFT },
          { text: `CHF ${price.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
        ],
      });
      SunmiPrinter.printColumnsString({
        lines: [{ text: `${quantity}x CHF ${price.toFixed(2)}`, proportion: 3, align: AlignmentModeEnum.LEFT }],
      });
    }
  }

  async printTotals(total_money, total_tax, sale_payments) {
    const width = 44;
    const line = "_".repeat(width) + "\n";

    //separator
    SunmiPrinter.setFontSize({ size: 25 });
    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });

    //total sum
    SunmiPrinter.setBold({ enable: true });
    SunmiPrinter.setFontSize({ size: 35 });
    SunmiPrinter.printColumnsString({
      lines: [
        { text: "Total Sum", proportion: 3, align: AlignmentModeEnum.LEFT },
        { text: `CHF ${total_money.toFixed(2)}`, proportion: 3, align: AlignmentModeEnum.RIGHT },
      ],
    });

    //tax info
    SunmiPrinter.setBold({ enable: false });
    SunmiPrinter.setFontSize({ size: 30 });
    SunmiPrinter.printText({ text: "\n" });
    SunmiPrinter.printColumnsString({
      lines: [
        { text: "Tax", proportion: 3, align: AlignmentModeEnum.LEFT },
        { text: `CHF ${total_tax.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
      ],
    });

    // payment info
    SunmiPrinter.setFontSize({ size: 25 });
    for (const payment of sale_payments) {
      const { name = "Unknown", amount = 0 } = payment;
      SunmiPrinter.printColumnsString({
        lines: [
          { text: name.toUpperCase(), proportion: 3, align: AlignmentModeEnum.LEFT },
          { text: `CHF ${amount.toFixed(2)}`, proportion: 1, align: AlignmentModeEnum.RIGHT },
        ],
      });
    }
  }

  async printFooter(receipt_number, receipt_date) {
    const width = 44;
    const line = "_".repeat(width) + "\n";

    //separator
    SunmiPrinter.printText({ text: "\n" });
    SunmiPrinter.printText({ text: line });
    SunmiPrinter.printText({ text: "\n" });

    //website
    SunmiPrinter.setAlignment({ alignment: AlignmentModeEnum.CENTER });
    SunmiPrinter.printText({ text: `www.vunmi.lv` });
    SunmiPrinter.printText({ text: "\n" });

    // bardcode with receipt number
    if (receipt_number) {
      SunmiPrinter.printBarCode({
        content: receipt_number,
        symbology: BarcodeSymbologyEnum.CODE128,
        height: 50,
        width: 2,
        text_position: BarcodeTextPositionEnum.BELOW,
      });
    }

    // date and receipt number
    const receiptDate = new Date(receipt_date);
    const formattedDate = receiptDate.toLocaleString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    SunmiPrinter.printColumnsString({
      lines: [
        { text: formattedDate, proportion: 3, align: AlignmentModeEnum.LEFT },
        { text: receipt_number ? `#${receipt_number}` : "", proportion: 1, align: AlignmentModeEnum.RIGHT },
      ],
    });
  }

  async printReceipt(saleData) {
    try {
      if (!saleData || !saleData.sale) {
        console.error("Invalid sale data provided");
        return;
      }

      const {
        sale: {
          user_name = "Unknown",
          total_money = 0,
          total_tax = 0,
          receipt_number = "",
          receipt_date = new Date().toISOString(),
        } = {},
        sale_items = [],
        sale_payments = [],
      } = saleData;

      SunmiPrinter.enterPrinterBuffer();

      await this.printHeader(user_name);
      await this.printItems(sale_items);
      await this.printTotals(total_money, total_tax, sale_payments);
      await this.printFooter(receipt_number, receipt_date);
      SunmiPrinter.printText({ text: "\n" });
      SunmiPrinter.cutPaper();
      SunmiPrinter.exitPrinterBuffer();
      console.log("Receipt printed successfully");
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  }
}

const printerService = new ReceiptPrinterService();
export default printerService;
