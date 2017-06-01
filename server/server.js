//server.js


import express 				from 'express';
import bodyParser 	 	from 'body-parser';
import session 			 	from 'express-session';
import cookieParser  	from 'cookie-parser';


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

app.get('/signed-in', (req, res) => {

		console.log('in signed in', req.headers.cookie);
		res.status = 'SUCCESS';
		res.json({status: 'SUCCESS'});
});

app.get('/authorization-code/callback', (req, res) => {

	console.log('in authorize-code/callback');
});

app.listen(8000, console.log(`Server running on port 8000`));