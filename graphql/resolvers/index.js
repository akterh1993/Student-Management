const authResolver = require('./auth');
const subjectsResolver = require('./subject');
const registerResolver = require('./assign');

const rootResolver = {
  ...authResolver,
  ...subjectsResolver,
  ...registerResolver
};

module.exports = rootResolver;