const en = require('../../locale/en/translation');

module.exports = function DatabaseException(
  message = 'error_in_creating_user'
) {
  this.status = 400;
  this.message = en[message];
};
