# Docusaurus configuration for rasa products

## Installation

```
npm i --save @rasahq/docusaurus-preset-tabula
```

## Usage

```docusaurus.config.js
const tabula = require('@rasahq/docusaurus-preset-tabula');

module.exports = tabula.use({
  customFields: {
      title: 'Rasa Open Source Documentation',
      tagline: 'An open source machine learning framework for automated text and voice-based conversations',
    productLogo: '/img/logo-rasa-oss.png',
    legacyVersions: [{
      label: 'Legacy 1.x',
      href: 'https://legacy-docs-v1.rasa.com',
      target: '_blank',
      rel: 'nofollow noopener noreferrer',
    }],
    redocPages: [
      {
        title: 'Rasa HTTP API',
        specUrl: '/spec/rasa.yml',
        slug: '/pages/http-api',
      }
    ],
    announcementBar: {
      id: 'pre_release_notice', // Any value that will identify this message.
      content: 'These docs are for version 3.x of Rasa Open Source. <a href="https://rasa.com/docs/rasa/2.x/">Docs for the 2.x series can be found here.</a>',
      backgroundColor: '#6200F5', // Defaults to `#fff`.
      textColor: '#fff', // Defaults to `#000`.
      // isCloseable: false, // Defaults to `true`.
    }
  }
};

```

## Development

To start dev environment run the following commands in the root of the monorepo:

```
yarn
yarn workspace testing-rasa dev
```

To understand how we are building the configuration and which business and user needs it covers, please refer to the documentation comments in the index.js

Often docusaurus does not register a change so it makes sense to restart the dev server.
