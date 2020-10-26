const concurrently = require("concurrently");
const { typescriptCommand, defaultOptions, successCb, errorCb } = require("./common");

const serve = async () => {
  try {
    await concurrently([
      {
        command: "firebase emulators:start --only functions,firestore",
        name: "firebase",
        prefixColor: "red"
      },
      typescriptCommand
    ], defaultOptions);
    process.exit();
  } catch (e) {
    console.error("Concurrently error ", e);
    process.exit();
  }
}

serve();
