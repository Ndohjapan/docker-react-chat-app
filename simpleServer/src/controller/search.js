const { UserSchema } = require('../models/User');

exports.search = async (displayName) => {
  return await UserSchema.findOne({ displayName });
};
