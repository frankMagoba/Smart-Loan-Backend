const express = require('express');
const app = new express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const auth = () => {
    return (req, res, next) => {
        next()
    }
}
passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username === "admin" && password === "admin") {
            return done(null, username);
        } else {
            return done("unauthorized access", false);
        }
    }
));
app.post('/authenticate', (req, res) => {
    res.status(200).json({ "statusCode": 200, "message": "hello" });
});

app.listen(3000, () => {
    console.log('App running at 3000')
})