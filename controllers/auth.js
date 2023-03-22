module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      //req.flash('error_msg', 'Vous n\'avez pas les autorisations pour acceder à ces ressources.');
      res.redirect('/admin/acces_denied');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('./admin/login');      
    }
  };
  