const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // github pagesへデプロイ用の設定
  assetsDir: './',
  publicPath: './'
});
