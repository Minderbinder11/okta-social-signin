//server.js


import express 				from 'express';
import bodyParser 	 	from 'body-parser';
import session 			 	from 'express-session';
import cookieParser  	from 'cookie-parser';
import path 					from 'path';


const clientId = 'zVhWxduDfhCXiE4FJUOK';
const clientSecret = '0KYC0ELnG3Atke5d6PBarrHTRlQFVkZ5m2nt_4lP';

const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'mt tamalpais',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/signed-in', (req, res, next) => {

  console.log(req.query);

	var nonce, state;
	///console.log('in signed in', req.headers.cookie);
	// i think the cookies are set on the client and come backl from the authorization server
  if (req.cookies['okta-oauth-nonce'] && req.cookies['okta-oauth-state']) {
    nonce = req.cookies['okta-oauth-nonce'];
    state = req.cookies['okta-oauth-state'];
    //console.log('cookies present', req.cookies['okta-oauth-state'])
  }
  else {
    res.status(401).send('"state" and "nonce" cookies have not been set before the /callback request');
    return;
  }

  //console.log('req.query.state: ', req.query.state);

  if (!req.query.state || req.query.state !== state) {
    res.status(401).send(`Query state "${req.query.state}" does not match cookie state "${state}"`);
    return;
  }


  const secret = new Buffer(`clientId:clientSecret`, 'utf8').toString('base64');

  console.log('this is the secret', secret);

		var myPath = path.join(__dirname, '../client', 'profile.html');
		console.log('myPath: ', myPath);
		res.sendFile(myPath, function (err) {
	    if (err) {
	    	console.log('err');
	      next(err);
	    } else {
	      console.log('Sent:');
	    }
  	});

		//res.status(200).sendFile();
});

app.get('/authorization-code/callback', (req, res) => {
	console.log('in authorize-code/callback');
});

app.listen(8000, console.log(`Server running on port 8000`));
