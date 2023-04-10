const express = require('express');
const { check, validationResult } = require('express-validator');
const en = require('../../locales/en/transalation');
const ValidationException = require('../error/ValidationException');
const { saveMessage, getMessages } = require('../controller/message');
const router = express.Router();

function checkValues() {
  return [
    check('combinedId')
      .isArray()
      .withMessage(en.invalid_body_format)
      .bail()
      // eslint-disable-next-line no-unused-vars
      .custom((value, { req }) => {
        if (value.length !== 2) {
          throw new Error(en.invalid_body_length);
        }
        if (value[0] === value[1]) {
          throw new Error(en.cannot_send_message_to_self);
        }
        return true;
      }),
    check('text').isString().withMessage(en.invalid_body_format),
    check('url')
      .isArray()
      .withMessage(en.invalid_body_format)
      .bail()
      // eslint-disable-next-line no-unused-vars
      .custom((value, { req }) => {
        if (value.length > 0) {
          const validUrls = value.every((url) => {
            const regex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
            return regex.test(url);
          });
          if (!validUrls) {
            throw new Error(en.invalid_url_format);
          }
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
  const { combinedId, text, url, from } = req.body;
  try {
    let message = await saveMessage(combinedId, text, url, from);
    res.send({ message });
  } catch (error) {
    next(error);
  }
});

// eslint-disable-next-line no-unused-vars
router.get('/:combinedId/:userUid', async (req, res, next) => {
  const { combinedId, userUid } = req.params;
  try {
    let messages = await getMessages(combinedId, userUid);
    res.send({ messages });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
