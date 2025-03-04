const logger = {
  log: (...args) => {
    console.log("[App]", ...args);
  },
  error: (...args) => {
    console.error("[App Error]", ...args);
  },
  debug: (...args) => {
    console.debug("[App Debug]", ...args);
  },
};

export default logger;
