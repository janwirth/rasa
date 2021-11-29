# Docusaurus configuration for rasa products

## Installation

```
npm i --save @rasahq/docusaurus-preset-tabula
```

## Usage

```docusaurus.config.js

const tabula = require('@rasahq/docusaurus-preset-tabula');

// add an API documentation redoc page
const tabulaConfig = {
  specs: [{
    title: "Example OpenApi Redoc spec", config: {
    spec: 'openapi.yaml', // your openAPI does not have to be in the root path
    routePath: '/spec-yaml'
  }],
}}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = tabula.use({
  title: 'Rasa Testing',
  tagline: 'A codebase for developing Rasa documentation themes',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/docs/rasa/'
}, tabulaConfig);


```

## Development

To start dev environment run the following commands in the root of the monorepo:

```
yarn
yarn workspace testing-rasa dev
```

To understand how we are building the configuration and which business and user needs it covers, please refer to the documentation comments in the index.js

Often docusaurus does not register a change so it makes sense to restart the dev server.
