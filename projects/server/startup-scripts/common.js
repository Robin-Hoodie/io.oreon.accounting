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
  }
};
