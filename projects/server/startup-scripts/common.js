module.exports = {
  typescriptCommand: {
    command: "yarn build:watch",
    name: "tsc",
    prefixColor: "cyan"
  },
  defaultOptions: {
    restartTries: 2,
    restartDelay: 5000,
    killOthers: ["success", "failure"]
  },
  successCb: () => process.exit(0),
  errorCb: err => {
    console.error("Concurrently error! ", err);
    process.exit(1);
  }
};
