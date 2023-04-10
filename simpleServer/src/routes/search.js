const express = require('express');
const { search } = require('../controller/search');
const SearchUserException = require('../error/SearchUserException');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const user = await search(req.query.displayName);
  if (user) {
    return res.send({ user });
  }
  return next(new SearchUserException());
});

module.exports = router;
