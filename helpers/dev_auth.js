module.exports = {
  ensureAuthenticated: function(req, res, next){
    if(req.isAuthenticated()) return next()
    else {
      req.flash('error_msg', 'Inicie sesión')
      res.redirect('/login')
    }
  },
  ensureGuest: function(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/patients')
    }else{
      return next()
    }
  },
}
