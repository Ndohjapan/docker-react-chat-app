const express = require('express');
const UserRouter = require('./routes/users');
const SearchRouter = require('./routes/search');
const UserChatRouter = require('./routes/userchat');
const MessageRouter = require('./routes/message');
const ErrorHandler = require('./error/ErrorHandler');
const app = express();

app.use(express.json());

app.use('/api/1.0/auth/user', UserRouter);

app.use('/search', SearchRouter);

app.use('/userChat', UserChatRouter);

app.use('/message', MessageRouter);

app.use(ErrorHandler);

module.exports = app;
