// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');





// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration

// ******************* REDIS ******************************
//   host: 'app-runner-test.nr3m79.ng.0001.use1.cache.amazonaws.com',
//          app-runner-test-ro.nr3m79.ng.0001.use1.cache.amazonaws.com


const Redis = require('ioredis');

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  timeout: process.env.REDIS_TIMEOUT,
  connectTimeout: process.env.REDIS_CONNECTTIMEOUT,
  maxRetriesPerRequest: process.env.REDIS_MAXRETRIESPERREQUEST,
};

const redis = new Redis(redisOptions);

redis.ping((error, result) => {
  if (error) {
    console.error('Error pinging Redis:', error);
  } else {
    console.log('Redis is alive. Response:', result);
  }

  redis.quit();
});





// const { createClient } = require('@redis/client');

// const redisOptions = {
//   host: 'app-runner-test.nr3m79.ng.0001.use1.cache.amazonaws.com',
//   port: 6379,
// };

// // Assuming you have already declared the `redisClient` variable elsewhere
// redisClient = createClient(redisOptions);

// redisClient.on('error', (error) => {
//   console.error('Error connecting to Redis:', error);
// });

// redisClient.on('ready', () => {
//   redisClient.ping((error, result) => {
//     if (error) {
//       console.error('Error pinging Redis:', error);
//     } else {
//       console.log('Redis is alive. Response:', result);
//     }
    
//     // Close the Redis client connection
//     redisClient.quit();
//   });
// });

//*************************** END REDIS *********************************

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
