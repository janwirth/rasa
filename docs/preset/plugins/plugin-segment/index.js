const path = require('path');

const { tagDefs } = require('@rasahq/react-tabula/dist/vendor/segment');

module.exports = function (context, { writeKey, cdnHost, apiHost, apiMethods }) {
  return {
    name: 'plugin-segment',

    getClientModules() {
      return [path.resolve(__dirname, './client')];
    },

    injectHtmlTags() {
      return tagDefs;
    },
  };
};
