const isProd = process.env.NODE_ENV === 'production';
const cssModuleIdent = isProd ? `[hash:base64]` : `[name]__[local]`;
// TODO: set sass-loader and postcss options
const sassLoaderOptions = {};
const postcssOptions = {};

module.exports = function (_, { id, ...options }) {
  return {
    name: 'plugin-css',
    configurePostCss(defaultPostcssOptions) {
      return defaultPostcssOptions;
    },
    configureWebpack(_, isServer, utils) {
      const { getStyleLoaders } = utils;
      return {
        /*
          merge strategy
            https://docusaurus.io/docs/lifecycle-apis#merge-strategy
            https://github.com/survivejs/webpack-merge#mergewithrules
        */
        // mergeStrategy: { 'module.rules': 'append' },
        module: {
          rules: [
            // TODO: figure out how to adjust css module idents
            // {
            //   test: /\.css$/,
            //   oneOf: [
            //     {
            //       test: /\.module\.css$/,
            //       use: [
            //         ...getStyleLoaders(isServer, {
            //           modules: {
            //             localIdentName: cssModuleIdent,
            //             exportOnlyLocals: isServer,
            //           },
            //           sourceMap: !isProd,
            //           importLoaders: 2,
            //         }),
            //       ],
            //     },
            //     {
            //       use: [...getStyleLoaders(isServer)],
            //     },
            //   ],
            // },
            {
              test: /\.s[ca]ss$/,
              oneOf: [
                {
                  test: /\.module\.s[ca]ss$/,
                  use: [
                    ...getStyleLoaders(isServer, {
                      modules: {
                        localIdentName: cssModuleIdent,
                        exportOnlyLocals: isServer,
                      },
                      sourceMap: !isProd,
                      importLoaders: 2,
                    }),
                    {
                      loader: 'sass-loader',
                      options: sassLoaderOptions,
                    },
                  ],
                },
                {
                  use: [
                    ...getStyleLoaders(isServer),
                    {
                      loader: 'sass-loader',
                      options: sassLoaderOptions,
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
    },
  };
};
