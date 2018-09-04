const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const mongoose = require('mongoose');
const sslRedirect = require('heroku-ssl-redirect');
const colors = require('colors');
// Loading models
require('./models/User');
require('./models/Patient');
require('./models/Consult');
require('./models/HistoryPatient');

//Loading Routes
const dev = require('./routes/dev');

require('./config/passport')(passport)

const app = express()

const keys = require('./config/keys')

const {
  formatDate,
  sum,
  diff,
  equals,
  ifCond,
  times
} = require('./helpers/hbs')

mongoose.Promise = global.Promise
mongoose.connect(keys.mongoURI)
    .then(() => console.log('Base de datos lista'.green))
    .catch(err => console.log('Conecta la base de datos'.red))

app.engine('handlebars', exphbs({
  helpers: {
    formatDate: formatDate,
    equals: equals,
    sum: sum,
    diff: diff,
    if: ifCond,
    times: times
  },
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(sslRedirect())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'Mindtec424',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
        maxAge: 3600000
    }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use(function(req, res, next){
    let local_user = req.user
    if (local_user) local_user.password = ""
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = local_user || null
    next()
})

app.use('/', dev)

app.get('/', function(req, res) {
  res.redirect('/login')
})
const port = process.env.PORT || 3000

app.listen(port, () => console.log(('Server started at port '+port).green))
