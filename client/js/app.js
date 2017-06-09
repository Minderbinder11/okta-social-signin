//app.js
  var orgUrl = 'https://dev-477147.oktapreview.com';
  const clientID = 'zVhWxduDfhCXiE4FJUOK';
  var redirectUrl = 'http://localhost:8000/authorization-code/callback';
  
$(document).ready(function(){ 

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

    oktaSignIn.session.exists(function (authenticated) {

      if(!authenticated) { 
        $('body').html('<div id="sign-in-container"></div>');
        oktaSignIn.renderEl({ 
          el: '#sign-in-container' 
        },
        function (res) {
          oktaSignIn.tokenManager.add('my_id_token', res);
          if(res.status === 'SUCCESS') {
            if (  res.claims.iss === orgUrl && res.claims.aud === clientID &&
                  res.claims.exp > Date.now()/1000 && res.claims.iat > Date.now()/1000 - 10 ) {
              $('body').html(loggedInHtml);
              $('#logged-in-res').append(res.claims.name);
              $('#first-name').append(res.claims.given_name);
              $('#last-name').append(res.claims.family_name);
              $('#username').append(res.claims.preferred_username);
              $('#iss').append(res.claims.iss);
              $('#iat').append(new Date(res.claims.iat*1000));
              $('#exp').append(new Date(res.claims.exp*1000)); 
            } 

          } else if (res.status === 'FORGOT_PASSWORD_EMAIL_SENT') {
            
            console.log('User %s sent recovery code via email to reset password', res.username);
          } else if (res.status === 'UNLOCK_ACCOUNT_EMAIL_SENT') {
              // res.username - value user entered in the unlock account form
              console.log('User %s sent recovery code via email to unlock account', res.username);
          }
        },
        function (err) { console.log('in err', err);
        });
      } else {
        $('body').html(loggedInHtml);
      }
     });     
  };     


  $('body').on('click', '#btnSignOut', function () {

   oktaSignIn.session.exists(function (authenticated) {
      if (authenticated) {
        sessionStorage.removeItem('sessionTokenKey');
        oktaSignIn.tokenManager.remove('my_id_token');
        $('body').html('<div id="sign-in-container"></div>');
        
        oktaSignIn.session.close(function () {
          location.reload(true);
        });
      };
   });
  });

  $('body').on('click', '#btnRenewIDToken', function () {
      oktaSignIn.tokenManager.refresh('my_id_token').
      then(function (res) {
        $('#iat').html(new Date(res.claims.iat*1000));
        $('#exp').html(new Date(res.claims.exp*1000));
      });
  });

  renderOktaWidget();

});

var loggedInHtml = `<div id="apicall-buttons">
  <h1 class="welcome-msg">Welcome <span id="logged-in-res"></span></h1>
    <table class="user-info">
      <th class="colA">
        Property
      </th>
      <th>
        Value
      </th>
      <tr>
        <td class="colA">First Name</td>
        <td id="first-name"></td>
      </tr>  
      <tr>
        <td class="colA">Last Name</td>
        <td id="last-name"></td>
      </tr>
      <tr>
        <td class="colA">Username</td>
        <td id="username"></td>
      </tr>
      <tr>
        <td>Token Issuer</td>
        <td id="iss"></td>
      </tr>       
      <tr>
        <td>Token Issued At</td>
        <td id="iat"></td>
      </tr> 
       <tr>
        <td>Token Expires At</td>
        <td id="exp"></td>
      </tr>           
    </table>
    <br />
    <div class="buttons">
      <button id="btnSignOut" class="btn btn-lg btn-primary">Sign Out</button>
      <button id="btnRenewIDToken" class="btn btn-lg btn-primary">Renew Token</button>
    </div>  
    </div>`;