'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://icui4cu2:icui4cu2@smart-loan.xfuxu.mongodb.net/smart-loan?retryWrites=true&w=majority', { useNewUrlParser: true });

module.exports = {mongoose};
