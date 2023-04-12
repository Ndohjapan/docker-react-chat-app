const en = require('../../locale/en/translation');

module.exports = function ValidationException(
  errors = '',
  message = 'validation_failure'
) {
  this.status = 400;
  this.errors = errors;
  this.message = en[message];
};
