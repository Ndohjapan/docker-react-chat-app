const en = require('../../locales/en/transalation');

module.exports = function UserChatCreationException(message) {
  this.status = 400;
  this.message = en[message];
};
