const en = require('../../locale/en/translation');

module.exports = function UserChatCreationException(message) {
  this.status = 400;
  this.message = en[message];
};
