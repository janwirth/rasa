// https://git.cryto.net/joepie91/fix-esm/pulls/6
'use strict';

const babelCore = require('@babel/core');
const Module = require('module').Module;
const fs = require('fs');

function transpile(code, filename) {
  return babelCore.transformSync(code, {
    filename,
    plugins: [
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      require.resolve('@babel/plugin-transform-modules-commonjs'),
    ],
  });
}

let oldJSLoader, oldMJSLoader;

module.exports = {
  register: function () {
    // NOTE: We only capture these at register time, to ensure that we don't interfere with any other custom require hooks
    oldJSLoader = Module._extensions['.js'];
    oldMJSLoader = Module._extensions['.mjs'];

    let newLoader = function (mod, filename) {
      try {
        return oldJSLoader(mod, filename);
      } catch (error) {
        if (error.code === 'ERR_REQUIRE_ESM') {
          // NOTE: We completely bypass the default internal loader, as we cannot patch the `type: module` check out of that. Please open a PR if you have a better solution!
          let code = fs.readFileSync(filename, 'utf8');
          let transpiledCode = transpile(code, filename);
          mod._compile(transpiledCode.code, filename);
        } else {
          throw error;
        }
      }
    };

    Module._extensions['.js'] = newLoader;
    Module._extensions['.mjs'] = newLoader;
  },
  unregister: function () {
    Module._extensions['.js'] = oldJSLoader;
    Module._extensions['.mjs'] = oldMJSLoader;
  },
  require: function (...args) {
    this.register();
    let required = require(...args);
    this.unregister();
    return required;
  },
};
