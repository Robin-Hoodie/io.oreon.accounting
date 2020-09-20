const concurrently = require("concurrently");
const { typescriptCommand, defaultOptions, successCb, errorCb } = require("./common");

concurrently([
  {
    command: "firebase functions:shell",
    name: "firebase",
    prefixColor: "red"
  },
  typescriptCommand
], {
  ...defaultOptions,
  defaultInputTarget: "firebase"
}).then(successCb, errorCb);
