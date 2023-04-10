const express = require('express');
const en = require('../../locales/en/transalation');
const { save } = require('../controller/users');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const ValidationException = require('../error/ValidationException');

function checkValues() {
  return [
    check('displayName').notEmpty().withMessage(en.invalid_displayName),
    check('email').isEmail().withMessage(en.invalid_email),
    check('uid').notEmpty().withMessage(en.invalid_uid),
    check('photoURL').notEmpty().withMessage(en.invalid_profile_url),

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
    const body = req.body;
    const user = await save(body);
    res.send({ message: en.user_created, data: user });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
