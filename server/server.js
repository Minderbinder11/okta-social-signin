//server.js
import express 				from 'express';
import bodyParser 	 	from 'body-parser';
import session 			 	from 'express-session';
import cookieParser  	from 'cookie-parser';
import path 					from 'path';


const clientId = 'zVhWxduDfhCXiE4FJUOK';
const clientSecret = '0KYC0ELnG3Atke5d6PBarrHTRlQFVkZ5m2nt_4lP';

const app = express();

app.use(express.static('client'));

app.listen(8000, console.log(`Server running on port 8000`));
