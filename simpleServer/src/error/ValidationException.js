const en = require('../../locales/en/transalation');

module.exports = function ValidationException(
  errors = '',
  message = 'validation_failure'
) {
  this.status = 400;
  this.errors = errors;
  this.message = en[message];
};
