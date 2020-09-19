const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const inDevelopment = process.env.NODE_ENV === "development";

module.exports = {
  lintOnSave: inDevelopment,
  chainWebpack: (config) => {
    config.plugin("html")
      .tap((args) => {
        return [{
          ...args[0],
          title: "Oreon Accounting"
        }];
      });

    config.plugin("bundle-analyzer")
      .use(BundleAnalyzerPlugin, [{
        analyzerMode: inDevelopment ? "server" : "static",
        defaultSizes: "gzip",
        openAnalyzer: false
      }]);
  }
};
