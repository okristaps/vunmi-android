const logger = {
  log: (...args: any[]) => {
    console.log("[App]", ...args);
  },
  error: (...args: any[]) => {
    console.error("[App Error]", ...args);
  },
  debug: (...args: any[]) => {
    console.debug("[App Debug]", ...args);
  },
};

export default logger;
