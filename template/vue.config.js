const pkg = require("./package.json");
const webpack = require("webpack");
const Timestamp = new Date().getTime();
process.env.VUE_APP_VERSION = pkg.version;

module.exports = {
  publicPath: "./",
  assetsDir: "./",
  productionSourceMap: false,
  filenameHashing: true,
  transpileDependencies: ["vue-echarts", "resize-detector"],
  devServer: {
    host: "0.0.0.0",
    port: "8088",
    hot: true,
    open: true,
    historyApiFallback: true, // 不跳转vb
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://10.1.52.52:18185",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
      "/layerapi": {
        target: "http://58.213.118.50:6080",
        changeOrigin: true,
        pathRewrite: {
          "^/layerapi": "",
        },
      },
    },
  },
  chainWebpack: (webpackConfig) => {
    webpackConfig.output.filename("js/[name]." + Timestamp + ".js").end();
    webpackConfig.output.chunkFilename("js/[name]." + Timestamp + ".js").end();

    webpackConfig.plugins.delete("prefetch");
    webpackConfig.plugins.delete("preload");

    // webpackConfig.module
    //   .rule("vue")
    //   .use("vue-loader")
    //   .tap(args => {
    //     args.compilerOptions.whitespace;
    //     console.log(args);
    //   });
    webpackConfig.plugin("provide").use(webpack.ProvidePlugin, [
      {
        Vue: ["vue/dist/vue.runtime.esm.js", "default"],
        _: ["lodash"],
      },
    ]);
  },
  configureWebpack: {
    devtool: "source-map",
    // optimization: {
    //   runtimeChunk: {
    //     name: entrypoint => `runtime~${entrypoint.name}`
    //   },
    //   splitChunks: {
    //     minChunks: 1,
    //     minSize: 100,
    //     maxAsyncRequests: 100,
    //     maxInitialRequests: 100,
    //     name: false
    //   }
    // }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/style/_var.scss";',
      },
    },
  },
};
