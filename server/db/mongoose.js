'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://icui4cu2:icui4cu2@smartloan.xfuxu.mongodb.net/loancloud?retryWrites=true&w=majority', { useNewUrlParser: true });

module.exports = { mongoose };
