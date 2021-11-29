require('dotenv').config();
const { NODE_ENV, NETLIFY, CONTEXT } = process.env;

module.exports = {
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
  isDeployPreview: NETLIFY && CONTEXT === 'deploy-preview',
};
