const express = require('express');
const { check, validationResult } = require('express-validator');
const en = require('../../locales/en/transalation');
const ValidationException = require('../error/ValidationException');
const { addUserToChat, getUserChat } = require('../controller/userchat');
const router = express.Router();

function checkValues() {
  return [
    check('uids')
      .isArray()
      .withMessage(en.invalid_body_format)
      .bail()
      // eslint-disable-next-line no-unused-vars
      .custom((value, { req }) => {
        if (value.length !== 2) {
          throw new Error(en.invalid_body_length);
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ValidationException(errors.array()));
      }
      next();
    },
  ];
}

router.post('/', checkValues(), async (req, res, next) => {
  try {
    await addUserToChat(req.body.uids);
    res.send({ message: en.chat_successfully_initiated });
  } catch (error) {
    next(error);
  }
});

router.get('/:uid', async (req, res, next) => {
  try {
    let userChat = await getUserChat(req.params.uid);
    res.send(userChat);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
