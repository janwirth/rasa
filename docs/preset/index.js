/**
 * TIP: It is recommended to edit this file with VS code to benefit from the JS type checking
 * TIP: use VS code bracket guides
 * The docusaurus preset has many requirements to fulfill from making MDX more powerful
 * to rendering OpenAPI specs as subpages.
 *
 * Each part of the configuration has a specific purpose but if we mark up everything in one big object
 * we get a mix of small configurations within properties of the root configuration. This mix of
 * properties is difficult to parse and to understand why something was configured in a specific way.
 *
 * To alleviate this problem, the configuration file is structured around features.
 * One feature is a functions that decorates the base configuration. Like this, every topic can be its own
 * self-contained mess.
 *
 * The 'feature functions' modify the passed configuration, we do not care about statefulness because we are working
 * with configurations that are loaded once, not complex UI state that changes over time and is shared between many
 * different components.
 *
 * CAVEAT: The feature function can only adjust the preset settings, it can not touch the site settings. However, some features require
 * also the site settings to be modified. This is done in the `use` function.
 * */
// @ts-check

const deepExtend = require('deep-extend');

require('dotenv').config();
const { NODE_ENV, NETLIFY, CONTEXT } = process.env;
const environment = {
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  isDeployPreview: NETLIFY && CONTEXT === 'deploy-preview',
};

/**
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {any} options
 * @returns {import('@docusaurus/types').DocusaurusConfig}
 */
module.exports = function preset(context, options = {}) {
  /** @type {any}
   * @description create some empty structures so that we don't need extra duck typing / plumbing
   */
  var config = { themes: [], plugins: [] };
  // THEMING
  useCustomizedClassicTheme(context, options, config);
  // CONTENTS
  useGeneratePagesFromDocsDirectory(context, options, config);
  // @ts-ignore
  useApiDocumentationPages(context, config, context.siteConfig.customFields);
  useMarkupPostprocessing(context, config);
  // INFORMATION ARCHITECTURE
  useAlgolia(context, config);
  useGenerateSitemap(context, config);
  // OTHER
  useDebug(context, options, config);
  useImageOptimization(context, config);
  useGtm(context, config);
  config.trailingSlash = true;
  config.plugins.push(require.resolve('./plugins/plugin-css'));

  return config;
};

/**
 * This function is a generator for docusaurus configurations.
 * Why is a preset not enough? Because we need to 1. acccess the siteConfig and 2. the themeConfig
 * IDEA: Theoretically we do not even need to create a preset, perhaps we can just hook the plugins / themes from the preset right into the siteConfig that we generate?
 * @typedef {{specs? : any[], productKey : string}} TabulaConfig
 * It does
 * 1. configure the siteConfig (what you describe in a docusaurus.config.js) including the themeConfig (which configures whatever themes you are using for docusaurus)
 * 2. build a preset and injects it into the siteconfig
 * @param {import('@docusaurus/types').DocusaurusConfig} docusaurusConfig
 * @param {TabulaConfig} tabulaConfig
 * the specs are API specs to be rendered in the sidebar, the productKey is rasa / rasa-x / rasa-sdk and MUST equal the part of the URL behind docs on production
 * @returns {import('@docusaurus/types').DocusaurusConfig}
 */

module.exports.use = function (docusaurusConfig, tabulaConfig) {
  // merge with defaults
  docusaurusConfig = deepExtend({}, createBaseConfig(tabulaConfig), docusaurusConfig);
  useNavigationWithProductPortfolio(docusaurusConfig, tabulaConfig);
  return docusaurusConfig;
};
/**
 * @description
 * The core functionality of docusaurus: generate HTML/ React pages from MDX files.
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {any} options
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useGeneratePagesFromDocsDirectory(context, options, config) {
  const pluginDocsDefaults = require('./defaults/plugin-docs');
  config.plugins.push([
    require.resolve('@docusaurus/plugin-content-docs'),
    deepExtend({}, pluginDocsDefaults, options.pluginDocs),
  ]);
}

/**
 * @description
 * monkey patch the google tags manager to satisfy EU data regulations.
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useGtm(context, config) {
  const gtmPlugin = require('@ionic-internal/docusaurus-plugin-tag-manager');
  /** @type {any} */
  const patched = (context) => {
    /** @type {any} */
    const pluginInstance = gtmPlugin(context);
    /** @type {any} */
    const injectHtmlTags = () => {
      // discard evil GDPR-violating iframe that's in preBodyTags
      const { headTags = [] } = pluginInstance.injectHtmlTags();
      // add tracking of netlify context
      const netlifyContext = `window.dataLayer = window.dataLayer || [{
              deployContext: (window.netlifyMeta && window.netlifyMeta.CONTEXT) || 'development',
              branchName: window.netlifyMeta && window.netlifyMeta.BRANCH,
            }];`;
      headTags.forEach((t) => {
        if (t.attributes['data-name'] == 'analytics') {
          t.innerHTML = netlifyContext + t.innerHTML;
        }
      });
      // add klaro consent scripts
      headTags.push({
        tagName: 'script',
        attributes: {
          defer: true,
          src: 'https://assets.rasa.com/scripts/klaro_config.js',
        },
      });
      headTags.push({
        tagName: 'script',
        attributes: {
          defer: true,
          src: 'https://assets.rasa.com/scripts/klaro.js',
        },
      });
      headTags.push({
        tagName: 'link',
        attributes: {
          rel: 'stylesheet',
          href: 'https://assets.rasa.com/styles/klaro.css',
        },
      });

      // optimize perf
      headTags.push({
        tagName: 'link',
        attributes: {
          rel: 'preconnect',
          href: 'https://www.google-analytics.com',
        },
      });
      return { headTags };
    };
    const path = require('path')
    const getClientModules = () => [
          path.resolve(__dirname, 'plugins/google-tagmanager/client.js')
        ]
    return { name: pluginInstance.name, injectHtmlTags, getClientModules };
  };
  config.plugins.push(patched);
}
const tagManager = {
  trackingID: 'GTM-MMHSZCS',
};

/**
 * @description
 * This is a simple one: Optimizes images for production.
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useImageOptimization(context, config) {
  config.plugins.push([
    '@docusaurus/plugin-ideal-image',
    {
      sizes: [160, 226, 320, 452, 640, 906, 1280, 1810, 2560],
      quality: 70,
    },
  ]);
}

/**
 * @description
 * The base theme for rasa documentation pages is a modified version of docusaurus-theme-classic.
 * On top of that is layered the theme-tabula which
 * 1. updates some styling to incorporate rasa branding and make the docs a bit prettier
 * 2. overrides (see 'swizzling' in docusaurus docs) some components from theme-classic where styling is not enough for the visual adjustments
 * 3. adds custom components that are needed in most rasa documentation pages.
 *
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {any} options
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useCustomizedClassicTheme(context, options, config) {
  /** @type {any[]} */
  const customizedTheme = [
    [require.resolve('@docusaurus/theme-classic'), { ...options.themeClassic }],
    require.resolve('./themes/tabula'),
  ];
  config.themes = [...config.themes, ...customizedTheme];
}

/**
 * @description Enable debug plugin if in debug environment or if options.debug is set to true
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {any} options
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useDebug(context, options, config) {
  const { isProd } = options;

  const debug = typeof options.debug !== 'undefined' ? Boolean(options.debug) : !isProd;
  config.plugins = [...config.plugins, debug && require.resolve('@docusaurus/plugin-debug')];
}

/**
 * @description For consistent and better SEO performance we generate a sitemap.
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useGenerateSitemap(context, config) {
  const pluginSitemapDefaults = {
    changefreq: 'weekly',
    priority: 0.5,
  };
  const { isProd } = environment;
  /** @type{null | [string, any]} */
  const sitemapPlugin = isProd && [require.resolve('@docusaurus/plugin-sitemap'), pluginSitemapDefaults];
  config.plugins = [...config.plugins, sitemapPlugin];
}

/**
 * @description We use algolia to provide page-wide search in our application
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useAlgolia(context, config) {
  const algoliaTheme_ = require('@docusaurus/theme-search-algolia');

  // monkey-patch the algolia theme
  const algoliaTheme = function (theme) {
    const result = algoliaTheme_(theme);
    // suppress openSearch plugin XML output because it is not a widely supported standard
    // and we do not want to confuse users with incorrect configuration
    delete result.postBuild;
    delete result.injectHtmlTags;
    return result;
  };

  // TODO: enable contextualSearch
  config.themes.push([algoliaTheme, algoliaThemeConfig]);
}
// configure themeConfig part of it.

const algoliaThemeConfig = (tabulaConfig) => ({
  // this is configured via DocSearch here:
  // contextualSearch: true,
  apiKey: '1f9e0efb89e98543f6613a60f847b176',
  indexName: 'rasa',
  inputSelector: '.search-bar',
  searchParameters: {
    facetFilters: [`tags:${tabulaConfig.customFields.productKey}`],
  },
});

/**
 * @description We use redoc to render OpenAPI documentation as a site within our documentation
 * The entries in the sidebar are added in the swizzled DocSidebar component
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @param {TabulaConfig} tabulaConfig
 * @returns {void}
 */
function useApiDocumentationPages(context, config, tabulaConfig) {
  const { baseUrl } = context;
  const path = require('path');
  // load the specs from the customFields in the theme if possible
  /** @type {{title : string, config: import("docusaurus-plugin-redoc").PluginOptions}[]} */
  const specs = context.siteConfig.themeConfig.customFields.customFields.specs;
  if (!specs) {
    return;
  }

  // prepare plugins and that insert the redoc stuff
  const redocusaurus = require('redocusaurus');
  /** @type {any} */
  const redoc = redocusaurus.default(context, {
    specs: specs.map(({ config }) => {
      config.apiDocComponent = '@theme/ApiDocWithBackButton';
      return config;
    }),
  });

  // merge everything into main config
  config.plugins = [...config.plugins, ...redoc.plugins];
  config.themes = [...config.themes, ...redoc.themes];
}

/**
 * @description Make markdown and HTML more powerful
 * @param {import('@docusaurus/types').LoadContext} context
 * @param {import('@docusaurus/types').DocusaurusConfig} config
 * @returns {void}
 */
function useMarkupPostprocessing(context, config) {
  var found = false;
  // this configuration is a parameter for the classic theme
  // so we need to interate through existing themes and add it.
  for (let theme of config.themes) {
    var isClassicTheme = false;
    try {
      isClassicTheme = theme[0].indexOf('classic') > -1;
    } catch {}
    if (isClassicTheme) {
      const { remarkProgramOutput } = require('./plugins/program_output');
      const remarkIncludeSourceCode = require('./plugins/included_source');
      theme[1].remarkPlugins = [remarkIncludeSourceCode, remarkProgramOutput];
      found = true;
    }
  }
  if (!found) {
    throw new Error('could not configure MDX plugins because theme-classic was not found.');
  }
}

const { isDev, isProd, isDeployPreview } = require('./context');
const createBaseConfig = (tabulaConfig) => ({
  presets: [['@rasahq/docusaurus-preset-tabula', tabulaConfig]],
  // defaults
  title: 'Default Title',
  tagline: 'Default tagline for Rasa Documentation site',
  organizationName: 'rasahq',
  favicon: 'img/favicon.ico',
  baseUrlIssueBanner: true,
  trailingSlash: true,
  noIndex: isDeployPreview,
  onBrokenLinks: 'ignore', // TODO: fix
  onDuplicateRoutes: 'ignore', // TODO: fix
  onBrokenMarkdownLinks: 'ignore', // TODO: fix
  // BUILD CONFIGURATION
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'jsx',
        format: isServer ? 'cjs' : undefined,
        target: isServer ? 'node12' : 'es2017',
      },
    }),
  },
  themeConfig: {
    algolia: algoliaThemeConfig(tabulaConfig),
    tagManager,
    colorMode: { disableSwitch: true },
    customFields: {
      // FIXME: this is a simplistic solution to https://github.com/RasaHQ/rasa/issues/7011
      // either (A): create a more sophisticated solution to link the precise branch and doc to be edited, according to branch settings
      // or (B): create a README document (or a section in the main README) which explains how to contribute docs fixes, and link all edit links to this
      rootEditUrl: 'https://github.com/rasahq/rasa/',
      productLogo: '/img/logo-rasa-oss.png',
      versionLabels: {
        current: 'Master/Unreleased',
      },
      legacyVersions: [
        {
          label: 'Legacy 1.x',
          href: 'https://legacy-docs-v1.rasa.com',
          target: '_blank',
          rel: 'nofollow noopener noreferrer',
        },
      ],
      ...tabulaConfig,
    },

    favicon: '/img/favicon.ico',
    organizationName: 'RasaHQ',
    projectName: tabulaConfig.productKey,

    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Rasa Technologies GmbH`,
    },
  },
});

/**
 * @description
 * Configure the urls where the site is hosted and provide links to sibling pages, community and blog.
 * @param {import('@docusaurus/types').DocusaurusConfig} siteConfig
 * @param {TabulaConfig} tabulaConfig
 * @returns {void}
 */
function useNavigationWithProductPortfolio(siteConfig, tabulaConfig) {
  var config = siteConfig;
  const isDev = process.env.NODE_ENV === 'development';
  const PROD_URL = 'https://rasa.com';
  const URLS = {
    path: require('path'),
    isDev,
    isStaging: process.env.NETLIFY && process.env.CONTEXT === 'staging',
    isPreview: process.env.NETLIFY && process.env.CONTEXT === 'deploy-preview',

    BASE_URL: `/${tabulaConfig.productKey}/`,
    PROD_URL,
    // NOTE: this allows switching between local dev instances of rasa/rasa-x
    SWAP_URL: isDev ? 'http://localhost:3001' : PROD_URL,
  };

  const path = require('path');
  const { BASE_URL, SWAP_URL } = URLS;

  // CONFIGURE URLs
  config.themeConfig.url = PROD_URL;
  config.themeConfig.baseUrl = BASE_URL;

  // CONFIGURE NAVBAR
  const communityLinks = {
    label: 'Community',
    position: 'right',
    items: [
      {
        target: 'blank',
        href: 'https://rasa.com/community/join/',
        label: 'Community Hub',
      },
      {
        target: 'blank',
        href: 'https://forum.rasa.com',
        label: 'Forum',
      },
      {
        target: 'blank',
        href: 'https://rasa.com/community/contribute/',
        label: 'How to Contribute',
      },
      {
        target: 'blank',
        href: 'https://rasa.com/showcase/',
        label: 'Community Showcase',
      },
    ],
  };
  const siblingDocs = [
    {
      target: '_self',
      label: 'Rasa Open Source',
      position: 'left',
      href: `${SWAP_URL}/docs/rasa/`,
    },
    {
      target: '_self',
      label: 'Rasa X',
      position: 'left',
      href: `${SWAP_URL}/docs/rasa-x/`,
    },
    {
      target: '_self',
      label: 'Rasa Action Server',
      position: 'left',
      href: `${SWAP_URL}/docs/action-server/`,
    },
  ];
  const blogAndGithub = [
    {
      href: 'https://github.com/rasahq/rasa',
      className: 'header-github-link',
      'aria-label': 'GitHub repository',
      position: 'right',
    },
    {
      target: '_self',
      href: 'https://blog.rasa.com/',
      label: 'Blog',
      position: 'right',
    },
  ];

  config.themeConfig.navbar = {
    hideOnScroll: false,
    title: 'Rasa Open Source',
    items: [...siblingDocs, ...blogAndGithub, communityLinks],
  };
}
