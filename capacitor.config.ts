import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vunmi.android",
  appName: "vunmi-android",
  webDir: "dist",
  plugins: {
    SunmiPrinter: {
      bindOnLoad: true,
    },
  },
};

export default config;
