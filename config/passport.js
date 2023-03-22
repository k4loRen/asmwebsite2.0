
const LocalStrategy = require('passport-local').Strategy;
const user = require('../models/admin');

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {

        if (email !== user.admin_server_email) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (password !== user.admin_server_password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(err, done) {
     
          done("", user);
        
      });
}
