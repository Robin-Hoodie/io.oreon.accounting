const concurrently = require("concurrently");

const options = {
  restartTries: 2,
  restartDelay: 5000,
  killOthers: ["failure"]
};
const start = async () => {
  try {
    await concurrently([
      {
        command: "yarn build:watch",
        name: "babel-cli",
        prefixColor: "cyan"
      },
      {
        command: "netlify dev",
        name: "functions",
        prefixColor: "red"
      }
    ], options);
    process.exit();
  } catch (e) {
    console.error("Concurrently error ", e);
    process.exit();
  }
};

start();
