const en = require('../../locales/en/transalation');

module.exports = function DatabaseException(
  message = 'error_in_creating_user'
) {
  this.status = 400;
  this.message = en[message];
};
