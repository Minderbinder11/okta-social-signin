//app.js
// var qs = require('querystring');

var orgUrl = 'https://dev-477147.oktapreview.com';
const clientID = 'zVhWxduDfhCXiE4FJUOK';
var redirectUrl = 'http://localhost:8000/authorization-code/callback';


var oktaSignIn = new OktaSignIn({
  baseUrl: orgUrl,
  // OpenID Connect options
  clientId: clientID,
  redirectUri: redirectUrl,
  authParams: {
    responseType: 'id_token',
    responseMode: 'okta_post_message',
    scopes: [ 'openid', 'email', 'profile', 'address', 'phone']
  },
  idpDisplay: 'PRIMARY',
  idps: [{
		'type': 'FACEBOOK',
		'id': '0oaaq8fqwoLWjGWqI0h7'
  }],

});

var renderOktaWidget = function() {

  oktaSessionsMe(function (authenticated) {

    console.log('oktasessionsMe Authenticated', authenticated)
    
    showAuthUI(authenticated);
    if(!authenticated) { 

      oktaSignIn.renderEl(
      { el: '#sign-in-container' },
      function (res) {
        console.log('this only runs after the user clicks sign in: , ', res)
        oktaSignIn.tokenManager.add('my_id_token', res);
        if(res.status === 'SUCCESS') {
          if (  res.claims.iss === orgUrl && res.claims.aud === clientID &&
                res.claims.exp > Date.now()/1000 && res.claims.iat > Date.now()/1000 - 10 ) {
     	        showAuthUI(true, res.claims);
          } 

        } else if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
          // res.username - value user entered in the forgot password form
          console.log('User %s sent recovery code via email to reset password', res.username);
        } else if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
            // res.username - value user entered in the unlock account form
            console.log('User %s sent recovery code via email to unlock account', res.username);
        }
      },
      function (err) { console.log('in err', err);
      });
    } 
   });     
}; 


var oktaSessionsMe = function (callBack) {
  console.log('in Okta Sessions Callback before AJAX');
  $.ajax({
      type: "GET",
      dataType: 'json',
      url: orgUrl + "/api/v1/sessions/me",
      xhrFields: {
          withCredentials: true
      },
      success: function (data) {
          console.log("My session: ", data);
          sessionStorage.setItem( 'sessionTokenKey' , JSON.stringify(data));
          return callBack(true);
      },
      error: function (textStatus, errorThrown) {
          console.log('No session is present');
          return callBack(false);
      },
      async: true
  });
};

var callSessionsMe = function () {
    oktaSessionsMe(function (authenticated) {
        console.log('Is user authenticated? ' + authenticated);
        return authenticated;
    });
};    

var showAuthUI = function (isAuthenticated, claims) {
    if (isAuthenticated) {
        console.log("authenticated user - hiding widget");
        $("#apicall-buttons").show();
        
        if (claims !== undefined) {
          $('#logged-in-res').append(claims.name);
          $('#first-name').append(claims.given_name);
          $('#last-name').append(claims.family_name);
          $('#username').append(claims.preferred_username);
          $('#iss').append(claims.iss);
          $('#iat').append(new Date(claims.iat*1000));
          $('#exp').append(new Date(claims.exp*1000));
        }
        
        $('#sign-in-container').hide();
    }
    else {
        console.log("anonymous user - showing widget");
        $("#apicall-buttons").hide();
        $('#sign-in-container').show();
    }
};   

var closeSession = function (callback) {
  $.ajax({
      type: "DELETE",
      dataType: 'json',
      url: orgUrl + "/api/v1/sessions/me",
      xhrFields: {
          withCredentials: true
      },
      success: function (data) {
          console.log('success deleting session');
          sessionStorage.removeItem('sessionTokenKey');
          return callback(true);
      },
      error: function (textStatus, errorThrown) {
          console.log('error deleting session: ' + JSON.stringify(textStatus));
          console.log(errorThrown);
          return callback(false);
      },
      async: true
  });
}; 

$('#btnSignOut').click(function () {
    console.log('signing out');
    oktaSessionsMe(function (authenticated) {
        if (authenticated) {
            var sessionTokenString = sessionStorage.getItem('sessionTokenKey');
            if (sessionTokenString) {

                closeSession(function (success) {
                    console.log('Is session closed? ' + success);
                    if (success) {
                        showAuthUI(false);
                        location.reload(false);
                        //$('#claims').hide();

                    }
                });
            }
        }
    });
});

  $('#btnRenewIDToken').click(function () {
      oktaSignIn.token.refresh(null, function (res) {
          console.log('New ID token: ', res);
          showAuthUI(true, res.claims)
          return res;
      }, {
          scopes: [ 'openid', 'email', 'profile', 'address', 'phone']
      });
  });


renderOktaWidget();