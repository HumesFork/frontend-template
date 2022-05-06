const fs = require("fs");

module.exports = (api, options, rootOptions) => {
  // 修改 `package.json` 里的字段
  api.extendPackage({
    scripts: {
      "serve:dev": "vue-cli-service serve --mode dev",
      "build:test": "vue-cli-service build --mode test",
      "build:prod": "vue-cli-service build --mode prod",
      lint: "vue-cli-service lint",
      lintf: "eslint --ext .js ./src --fix && npm run lint",
    },
  });

  // 安装一些基础公共库
  api.extendPackage({
    dependencies: {
      "ali-oss": "^6.13.2",
      axios: "^0.21.1",
      "babel-plugin-component": "^1.1.1",
      "core-js": "^3.9.0",
      "element-ui": "^2.15.6",
      "file-saver": "^2.0.5",
      "js-base64": "^3.7.2",
      jsencrypt: "^3.2.1",
      lodash: "^4.17.15",
      puhoucorejs: "^3.0.3",
      qs: "^6.9.1",
      vue: "^2.6.10",
      "vue-promised": "^1.2.1",
      "vue-router": "^3.1.3",
    },
    devDependencies: {
      "@vue/cli-plugin-babel": "^4.0.0",
      "@vue/cli-plugin-eslint": "^4.0.0",
      "@vue/cli-plugin-router": "^4.0.0",
      "@vue/cli-service": "^4.0.0",
      "@vue/eslint-config-prettier": "^5.0.0",
      "babel-eslint": "^10.0.3",
      "babel-plugin-lodash": "^3.3.4",
      "image-conversion": "^2.1.1",
      eslint: "^5.16.0",
      "eslint-plugin-prettier": "^3.1.1",
      "eslint-plugin-vue": "^5.0.0",
      prettier: "^1.18.2",
      sass: "^1.19.0",
      "sass-loader": "^8.0.0",
      "vue-template-compiler": "^2.6.10",
      "vue-wxlogin": "^1.0.2",
    },
  });

  // 删除 vue-cli3 默认的 /src目录
  api.render((files) => {
    Object.keys(files)
      .filter((path) => path.startsWith("src/"))
      .forEach((path) => delete files[path]);
  });

  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render("../template");

  // 配置sidebar跳转路径
  if (options.title) {
  }
};
