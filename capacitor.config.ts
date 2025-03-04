import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.vunmi.android",
  appName: "vunmi-android",
  webDir: "dist",
  server: {
    androidScheme: "http",
  },
};

export default config;
