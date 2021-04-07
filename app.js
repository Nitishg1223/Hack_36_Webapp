require("dotenv").config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const Mongodb_uri = `mongodb+srv://${process.env.USERNAM}:${process.env.PASSWORD}@cluster0.wcen1.mongodb.net/paintings?retryWrites=true&w=majority`;
console.log(Mongodb_uri)                      
const csrf = require('csurf');
const flash = require('connect-flash');



const mongoose = require('mongoose');

 const store = new mongoDBStore({
     uri: Mongodb_uri,
     collection: 'sessions'
 });

const csrfProtection = csrf();

app.set('view engine','ejs');
app.set('views','views');
const errControl = require('./controllers/error');

const adminData = require('./routes/admin');
const shopData = require('./routes/shop');

const authRoutes = require('./routes/auth');
const User = require('./models/user'); 


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
 app.use(
     session({
       secret: 'my secret',
       resave: false,
       saveUninitialized: false,
       store: store
     })
   );

 app.use(csrfProtection);
 app.use(flash());
  
 app.use((req, res, next) => {
     if (!req.session.user) {
       return next();
     }
     User.findById(req.session.user._id)
       .then(user => {
         req.user = user;
         next();
       })
       .catch(err => console.log(err));
   });

  
 app.use((req, res, next) => {
   res.locals.isAuthenticated = req.session.isLoggedIn;
   res.locals.csrfToken = req.csrfToken();
   next();
 });


app.use(adminData);
app.use(shopData);
app.use(authRoutes);

app.use(errControl.errController);


 mongoose.connect(Mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(result => {
     app.listen(4000),console.log('i am listening at 3000');
 })
 .catch(err => console.log(err));









