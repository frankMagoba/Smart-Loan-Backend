const express = require('express');
const app = new express();
app.use(passport.initialize());
app.use(passport.session());
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (error, user, info) => {
            if (error) res.status(400).json({ "statusCode": 200, "message": error });
            req.login(user, function (error) {
                if (error) return next(error);
                next();
            });
        })(req, res, next);
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
passport.serializeUser(function (user, done) {
    if (user) done(null, user);
});

passport.deserializeUser(function (id, done) {
    done(null, id);
});
app.post('/authenticate', (req, res) => {
    res.status(200).json({ "statusCode": 200, "message": "hello" });
});

app.listen(3000, () => {
    console.log('App running at 3000')
})