const path = require('path');
const fs = require('fs');
const mockDir = path.resolve(__dirname, './mock');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const tsImportPluginFactory = require('ts-import-plugin');


const defaultCssVars = require('@cloudpivot/common/styles/variable').pc;

const extendLessVars = require('./extends/theme');

const modifyVars = Object.assign({}, defaultCssVars, extendLessVars);

const CopyWebpackPlugin = require('copy-webpack-plugin');


let pages = {
  main: {
    entry: 'src/main.ts',
    template: 'public/index.html',
    filename: 'index.html'
  },
  externalLinkOld: {
    entry: 'src/views/externalLink/externalLink-old/main.ts',
    template: 'src/views/externalLink/externalLink-old/externalLink.html',
    filename: 'externalLink.html'
  },
  externalLink: {
    entry: 'src/views/externalLink/externalLink/main.ts',
    template: 'src/views/externalLink/externalLink/el.html',
    filename: 'el.html'
  }
};

module.exports = {
  pages,
  filenameHashing: true,
  productionSourceMap: true,
  // 处理IE兼容————vuex持久化脚本语法转译
  transpileDependencies: ['vuex-persist', 'flatted','ansi-regex', /@cloudpivot\/[\w-]+/],
  configureWebpack: config => {

    return {

      plugins: [
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../../modules/@cloudpivot/form/src/renderer/components/pc/input-textarea/tinymcelib'),
            to: 'tinymcelib',
            ignore: ['.*']
          }
        ])
      ]

    }
  },
  devServer: {
    port: 9100,
    open: true,
    proxy: {
      '/api/': {
        target: process.env.VUE_APP_API + '/',
        changeOrigin: true,
      },
      '/externalLink/': {
        target: process.env.VUE_APP_API + '/',
        changeOrigin: true,
      },
      '/apis/': {
        target: process.env.VUE_APP_OAUTH_HOST + '/',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        },
      },
      '/v1/': {
        target: process.env.VUE_APP_PORTAL_HOST + '/',
        changeOrigin: true,
      }
    },
    before: (app) => {
      (function setMock(mockDir) {
        fs.readdirSync(mockDir).forEach(function (file) {
          let filePath = path.resolve(mockDir, file);
          let mocks;
          if (fs.statSync(filePath).isDirectory()) {
            setMock(filePath)
          } else {
            mocks = require(filePath);
            mocks.forEach((mock) => {
              app.use(mock.api, mock.response);
            });

          }
        })
      })(mockDir)
      /**
       * 支持跨域访问
       */
      app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('X-Powered-By', '3.2.1');
        if (req.method == 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: modifyVars,
        javascriptEnabled: true
      }
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('assets', path.resolve(__dirname, './src/assets'))
      .set('styles', path.resolve(__dirname, './src/styles'))
      .set('components', path.resolve(__dirname, './src/components'));

    // 移除 prefetch 插件
    ['externalLinkOld', 'main', 'externalLink']
      .map(name => config.plugins.delete(`prefetch-${name}`))


    config.module.rule('ts').use('ts-loader').tap(options => Object.assign(options, {
      getCustomTransformers: () => ({
        before: [tsImportPluginFactory([
          {
            libraryName: 'h3-antd-vue',
            libraryDirectory: 'lib',
            style: true,
          }, {
            libraryName: '@h3/awesome-ui',
            libraryDirectory: 'lib',
            style: true,
          }, {
            libraryName: '@h3/report',
            libraryDirectory: 'lib',
            style: true,
          }
        ])]
      }),
      // include: path.join(__dirname, 'node_modules/h3-antd-pro/components'),
    }));

    // 优化打包
    config.optimization
    .splitChunks({
      minSize: 300000,
      maxInitialRequests: 6
    })

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 1024 }))
  }
};
