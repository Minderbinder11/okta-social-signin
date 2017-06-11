'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clientId = 'zVhWxduDfhCXiE4FJUOK'; //server.js

var clientSecret = '0KYC0ELnG3Atke5d6PBarrHTRlQFVkZ5m2nt_4lP';

var app = (0, _express2.default)();

app.use(_express2.default.static('client'));

app.listen(8000, console.log('Server running on port 8000'));
//# sourceMappingURL=server.js.map