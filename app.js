// Program Name: 
// Filename: 
// Author: 
// Description: 

// SERVER SIDE CODE

var express = require('express');
//var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public')); // where static .js files are served
app.set('view engine', 'handlebars');
//app.set('port', 3000);
//app.set('mysql', mysql);

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users.js');

app.use(session({ 
  secret: 'lol', 
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 100 * 60 * 60 * 24 * 30} //30 days
}));

app.use(passport.initialize());
app.use(passport.session());

/**********************************************
home landing page here
*********************************************/
//brings up homepage
app.get('/', function(req, res){
	res.render('home.handlebars');
});

// OTHER ROUTES HERE...

//login route
app.get('/login', function(req, res){
	res.render('login.handlebars');
});

app.get('/woo', loggedIn, function(req, res){
	res.send("logged in");
});

/*************************************************************************
Passport strats
*************************************************************************/
//passport documentation on configuring strategy http://www.passportjs.org/packages/passport-local/
passport.use(new LocalStrategy(
	{usernameField: 'email',
	},
	function(username, password, done){
		User.findOne({
			where: {email: username}
		}).then(function(user){
			if(!user){
				//console.log("wrong username");
				return done(null, false, {message: 'Username is incorrect'});
			}
			if (!(user.password == password)){
				//console.log("wrong password");
				return done(null, false, {message: 'Password is incorrect'});
			}
			if (user.password == password){
				//console.log("correct");
				return done(null, user, {message: 'logged in'});

			}
		}).catch(err => done(err));
	}));


//now to serialize user and deserialize user for sessions

passport.serializeUser(function(user, done){
	done(null, user.email);
});


passport.deserializeUser(function(user, done){
	done(null, user);
});

/****************************************
middleware that will auth
************************************/
app.post('/login', passport.authenticate('local', { 
	successRedirect: '/woo',
    failureRedirect: '/login'
}), function(req, res){
	//nothing in callback	
});

//logout 
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

//check if loggedIn 
function loggedIn(req, res, next){
	if (req.isAuthenticated()){
		next();
	}
	else{
		res.redirect('/');
	}
}
/**************************
End middleware code
***************************/

app.listen(3000, function(){
    console.log("server started");
})

/*app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});*/
