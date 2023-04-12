const en = require('../../locale/en/translation');

module.exports = function NotFoundException(message = 'user_not_found') {
  this.status = 404;
  this.message = en[message];
};
