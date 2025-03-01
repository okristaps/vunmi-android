import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "vunmi-android",
  webDir: "dist",
  plugins: {
    SunmiPrinter: {
      bindOnLoad: true,
    },
  },
};

export default config;
