'use strict';

require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const colors = require('colors');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo-model');
const {User} = require('./models/user-model');
const {xAuth} = require('./constants/constants');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

/* Todos Requests */

app.post('/todos', authenticate, (request, response) => {
    let todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });

    todo.save().then(todoDoc => {
        response.send({todoDoc});
    }, (error) => {
        response.status(400).send(error);
    });

});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
        _creator: request.user._id
    }).then(userTodos => {
        response.send({userTodos});
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (request, response) => {
   let id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

   Todo.findOne({
       _id: id,
       _creator: request.user._id
   }).then(todoDoc => {
       if (!todoDoc) {
           return response.status(404).send();
       }

       response.send({todoDoc});
   }).catch(error => {
       response.status(400).send();
   });
});

app.delete('/todos/:id', authenticate, (request, response) => {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findOneAndDelete({
        _id: id,
        _creator: request.user._id
    }).then(todoDoc => {
        if (!todoDoc) {
            return response.status(404).send();
        }

        response.send({todoDoc});
    }).catch(error => {
       response.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (request, response) => {
    let id = request.params.id;
    let body = _.pick(request.body, ['text', 'completed']);
    let query = { _id: id, _creator: request.user._id };

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

   if (_.isBoolean(body.completed) && body.completed) {
       body.completedAt = new Date().getTime();
   } else {
       body.completedAt = null;
       body.completed = false;
   }

   Todo.findOneAndUpdate(query, {$set: body}, {new: true}).then(todoDoc => {
       if (!todoDoc) {
           return response.status(404).send();
       }

       response.send({todoDoc});
   }).catch(error => {
       response.status(400).send();
   });
});

 /* User Requests */

app.post('/users', (request, response) => {
     let body = _.pick(request.body, ['email', 'password', 'name']);
     let user = new User(body);

     user.save().then(() => {
         return user.generateAuthToken();
     }).then((token) => {
         response.header(xAuth, token).send({user});
     }).catch(error => {
        response.status(400).send(error);
     });
});

app.post('/users/login', (request, response) => {
   let body = _.pick(request.body, ['email', 'password']);

   User.findByCredentials(body.email, body.password).then(user => {
       return user.generateAuthToken().then(token => {
           response.header(xAuth, token).send({user});
       });
   }).catch(error => {
       response.status(400).send();
    });

});

app.delete('/users/token', authenticate, (request, response) => {
     request.user.removeToken(request.token).then(()=> {
        response.status(200).send();
     }, () => {
         response.status(400).send();
     });
});

app.listen(port, () => {
    console.log('Listening on port'.green, `${port}`.rainbow);
});
