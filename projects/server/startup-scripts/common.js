module.exports = {
  typescriptCommand: {
    command: "yarn build:watch",
    name: "typescript-watcher",
    prefixColor: "cyan"
  },
  defaultOptions: {
    restartTries: 2,
    restartDelay: 5000,
    killOthers: ["failure"]
  }
};
