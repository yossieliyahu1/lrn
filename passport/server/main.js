

// node js passport authentication example
// https://orchestrate.io/blog/2014/06/26/build-user-authentication-with-node-js-express-passport-and-orchestrate/

var express = require('express');
var app = new express();

var parser = require('body-parser');

// link to DB
require('./database.js');

app.use(express.static(__dirname + '/../.tmp'));
app.use(express.static(__dirname + '/imgs'));

app.use(parser.json());
app.use(parser.urlencoded({extended:false}));


app.set('view engine', 'html');


// manage API routes (set, get, update)
// require('./routes.js')(app);


// ----------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------


var session = require('express-session');

app.use(session({ secret: 'supernova', saveUninitialized: true, resave: true }));


var router = express.Router();

// Configuring Passport
var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var uuid = require('node-uuid');

// var expressSession = require('express-session');


var bCrypt = require("bcrypt-nodejs");
//var flash = require('connect-flash');

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.cookieParser('keyboard cat'));
// app.use(express.session({ cookie: { maxAge: 60000 } }));
//app.use(flash());


// app.use(expressSession({ secret: 'yossieliyahu' }));



var UserDetails = require('./models/UserDetails.js');

passport.serializeUser(function (user, done) {
	console.log("passport.serializeUser " + user._id);
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	console.log("passport.deserializeUser " + id);
	UserDetails.findById(id, function (err, user) {
		console.log("passport.deserializeUser " + err + "=======" + user);
		done(err, user);
	});
});





var isValidPassword = function(user, password){
	return bCrypt.compareSync(password, user.password);
}


// passport/login.js
passport.use('login', new LocalStrategy({
	passReqToCallback: true
},
  function (req, username, password, done) {
  	// check in mongo if a user with username exists or not
  	UserDetails.findOne({ 'username': username },
      function (err, user) {
      	// In case of any error, return using the done method
      	if (err)
      		return done(err);
      	// Username does not exist, log error & redirect back
      	if (!user) {
      		console.log('User Not Found with username ' + username);
      		return done(null, false); // , req.flash('message', 'User Not found.'));
      	}
      	// User exists but wrong password, log the error 
      	if (!isValidPassword(user, password)) {
      		console.log('Invalid Password');
      		return done(null, false);
				// req.flash('message', 'Invalid Password'));
      	}
      	// User and password both match, return user from 
      	// done method which will be treated like success

      	console.log('success login ' + JSON.stringify(user));
      	return done(null, user);
      }
    );
  }));



var createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}


passport.use('signup', new LocalStrategy({
	passReqToCallback : true
},
  function(req, username, password, done) {
  	findOrCreateUser = function(){
  		// find a user in Mongo with provided username
  		UserDetails.findOne({ 'username': username }, function (err, user) {
  			// In case of any error return
  			if (err){
  				console.log('Error in SignUp: '+err);
  				return done(err);
  			}
  			// already exists
  			if (user) {
  				console.log('User already exists');
  				return done(null, false);
				   // req.flash('message','User Already Exists'));
  			} else {
  				// if there is no user with that email
  				// create the user

  				console.log('params ' + JSON.stringify(req.params));
  				console.log('body ' + JSON.stringify(req.body));
  				console.log('query ' + JSON.stringify(req.query));

  				var newUser = new UserDetails();

  				newUser._id = uuid.v1();
  				// set the user's local credentials
  				newUser.username = username;
  				newUser.password = createHash(password);
  				newUser.email = req.body.email;
  				newUser.name = req.body.firstName;
  				// newUser.lastName = req.param('lastName');
 
  				// save the user
  				newUser.save(function(err) {
  					if (err){
  						console.log('Error in Saving user: '+err);  
  						throw err;  
  					}
  					console.log('User Registration succesful ' + JSON.stringify(newUser) );    
  					return done(null, newUser);
  				});
  			}
  		});
  	};
     
  	// Delay the execution of findOrCreateUser and execute 
  	// the method in the next tick of the event loop
  	process.nextTick(findOrCreateUser);
  })
);




/* GET login page. */
app.route('/').get(function (req, res) {
	// Display the Login page with any flash message, if any
	res.render('index', { message: 'message' });
});

/* Handle Login POST */
app.route('/login').post( passport.authenticate('login', {
	successRedirect: '/home',
	failureRedirect: '/',
	failureFlash: true
}));

/* GET Registration Page */
app.route('/signup').get( function (req, res) {
	res.render('register', { message: 'message' });
});

/* Handle Registration POST */
app.route('/signup').post( passport.authenticate('signup', {
	successRedirect: '/home',
	failureRedirect: '/signup',
	failureFlash: true
}));

/* Handle Logout */
app.route('/signout').get( function (req, res) {
	req.logout();
	res.redirect('/');
});


// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		console.log("ok");
		return next();
	}

	console.log("fail");
	res.redirect('/');
}


// don't allow access to routes if the user didn't authenticated 

/* GET Home Page */
app.route('/home').get( isAuthenticated, function (req, res) {
	res.render('home.html');
});






var port = process.argv[2] || 3000;
app.listen(port);
console.log("server is listening on port -- " + port);