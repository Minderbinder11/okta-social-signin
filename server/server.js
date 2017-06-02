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


// facebook api authorize url:
// https://dev-477147.oktapreview.com/oauth2/v1/authorize?idp=0oaans3iedl5Ep68R0h7&client_id={clientId}&response_type={responseType}&response_mode={responseMode}&scope={scopes}&redirect_uri={redirectUri}&state={state}&nonce={nonce}
// https://dev-477147.oktapreview.com/oauth2/v1/authorize?idp=0oaans3iedl5Ep68R0h7&client_id3adcf8cmodTulxBNWZfS=&response_type=id_token&response_mode=fragment&scope=openid%20email%20profile&redirect_uri=http://localhost:8000/authorization-code/callback&state=someState&nonce=someNonce