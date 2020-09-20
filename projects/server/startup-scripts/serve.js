const concurrently = require("concurrently");
const { typescriptCommand, defaultOptions, successCb, errorCb } = require("./common");

concurrently([
  {
    command: "firebase emulators:start --only functions",
    name: "firebase",
    prefixColor: "red"
  },
  typescriptCommand
], defaultOptions)
  .then(successCb, errorCb);
