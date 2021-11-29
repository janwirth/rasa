const path = require('path');

module.exports = function (context, options) {
  return {
    name: '@rasahq/docusaurus-theme-tabula',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getClientModules() {
      return [require.resolve('./styles/tabula.scss')];
    },

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'preconnect',
              href: 'https://assets.rasa.com',
            },
          },
        ],
      };
    },

    /*
      TODOs

      - `configurePostCss` method
      - `configureWebpack` method
      - `contentLoaded` async method
     */
  };
};
