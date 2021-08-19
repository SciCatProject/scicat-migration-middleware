var express = require('express');
var request = require('superagent');
var utils = require('../utils/utils.js');
//var router = express.Router();

async function local_user_login(req, res, next, urls, main_login) {
  //
  // this function is run when we receive a login request as a local user
  // if successful, we should return the following reply
  //{
  //  "id": "ws0v2DT3imnnwz0uk6yhcr2TkoJEtVXnzDD8DvjJGLmDzsSUZoLE58E4N01jgl3K",
  //  "ttl": 1209600,
  //  "created": "2020-10-05T13:28:01.771Z",
  //  "userId": "4ja5c1d68cef0c3a009262d6"
  //}
  //
  // token should be the combination of LB3 and LB4 systems
  // 
  // we are going to run LB4 login only if LB3 is successful
  //
  //
  console.log('Local user login');

  // check if method is correct, aka POST
  if (req.method !== 'POST') {
    // return error
    const error = utils.http_401_error;
    res.status(error.statusCode)
      .json({
        'error' : error
      });
      next('router');
      return;
  }

  // main login
  console.log('Main Log : ' + main_login);
  console.log('Connection arguments: ' + JSON.stringify(urls[main_login]));
  const main_response = await request(
        urls[main_login]['#method'],
        urls[main_login]['#url'])
      .send(req.body)
      .then(utils.backend_success_callback)
      .catch(utils.backend_response_error_callback);
  
  /*
   * successful login
   * >
   * {
   *  "id": "ws0v2DT3imnnwz0uk6yhcr2TkoJEtVXnzDD8DvjJGLmDzsSUZoLE58E4N01jgl3K",
   *  "ttl": 1209600,
   *  "created": "2020-10-05T13:28:01.771Z",
   *  "userId": "4ja5c1d68cef0c3a009262d6"
   * }
   * 
   * failed login
   * > curl -i -X POST -H 'Content-type: application/json' -d '{"username": "ingestor", "password": "xxxxx"}' https://scitest.esss.lu.se/api/v3/Users/login
   *  HTTP/1.1 401 Unauthorized
   *  Server: openresty/1.15.8.2
   *  Date: Fri, 16 Jul 2021 18:36:40 GMT
   *  Content-Type: application/json; charset=utf-8
   *  Transfer-Encoding: chunked
   *  Strict-Transport-Security: max-age=15724800; includeSubDomains
   *  Vary: Origin, Accept-Encoding
   *  Access-Control-Allow-Credentials: true
   *  X-XSS-Protection: 1; mode=block
   *  Strict-Transport-Security: max-age=0; includeSubDomains
   *  X-Download-Options: noopen
   *  X-Frame-Options: SAMEORIGIN
   *  X-Content-Type-Options: nosniff
   * 
   * {
   *   "error" : { 
   *     "statusCode" : 401,
   *     "name" : "Error",
   *     "message" : "login failed",
   *     "code" : "LOGIN_FAILED"
   *   }
   * }
   */
  
  // check if main login was successful 
  if (main_response.statusCode !== utils.getSuccessStatusCode(urls[main_login])) {
    // main login failed
    // returning error
    res.status(main_response.statusCode)
      .send(main_response.text);
    next('route');
    return;
  }

  // get main login token field and prepares the array where to store the tokens
  var main_token_field = utils.get_value(urls,[ main_login, '#token-field' ]);
  var tokens = {};

  // iterate on all defined login backends and login in each one of them
  // skip main login
  for ( const backend of Object.keys(urls)) {
    if (backend !== main_login) {
      // login on the LB4 catamel
      console.log('Logging in into ' + backend + ' backend');
      console.log('Connection arguments: ' + JSON.stringify(urls[backend]));
      var backend_response = await request(urls[backend]['#method'],urls[backend]['#url'])
        .send(req.body)
        .then(utils.backend_success_callback)
        .catch(utils.backend_response_error_callback);

      // check if login in lb4 is successful
      tokens[backend] = (
        backend_response.statusCode === utils.getSuccessStatusCode(urls[backend])
        ? backend_response.body[urls[backend]["#token-field"]]
        : "<failed-login>");
    }
  }
  // lb4 token to user reply
  var user_reply = main_response.body;
  tokens[main_login] = user_reply[main_token_field];
  /*
   * this was the first implementation. I will try using standard javascript functions
   * var full_token = '';
   * Object.keys(tokens).forEach(k => { full_token += k + "=" + tokens[k] + "~" });
   * user_reply[main_token_field] = full_token.substring(0,full_string.length-1);
   */
  user_reply[main_token_field] = utils.prepAuthTokensForUser(tokens);

  // return token to user
  res.status(200).json(user_reply);
}


async function ldap_user_login(req, res, next, urls, main_login) {
  console.log('Ldap user login');

  // check if method is correct, aka POST
  if (req.method !== 'POST') {
    const error = utils.http_401_error;
    // return error
    res.status(error.statusCode)
      .json({
        'error' : error
      });
      next('router');
      return;
  }

  // main login
  console.log('Main Log : ' + main_login);
  console.log('Connection arguments: ' + JSON.stringify(urls[main_login]));
  const main_response = await request(
         urls[main_login]['#method'],
         urls[main_login]['#url'])
    .send(req.body)
    .then(utils.backend_success_callback)
    .catch(utils.backend_response_error_callback);
  
  /*
   * successful login on ldap account
   * 
   * curl -i -X POST -H 'Content-type: application/json' -d '{"username": "massimilianonovelli", "password": "xxxxxxx"}' https://scicat.ess.eu/auth/msad
   *  HTTP/1.1 200 OK
   *  Server: openresty/1.15.8.2
   *  Date: Fri, 16 Jul 2021 18:08:17 GMT
   *  Content-Type: application/json; charset=utf-8
   *  Content-Length: 119
   *  Strict-Transport-Security: max-age=15724800; includeSubDomains
   *  Vary: Origin, Accept-Encoding
   *  Access-Control-Allow-Credentials: true
   *  X-XSS-Protection: 1; mode=block
   *  Strict-Transport-Security: max-age=0; includeSubDomains
   *  X-Download-Options: noopen
   *  ETag: W/"77-r4PbriNxy6E9YIMNO6xG/N0rBaE"
   *  X-Frame-Options: SAMEORIGIN
   *  X-Content-Type-Options: nosniff
   * 
   *  {"access_token":"0PApDnADFIPFKop16pFS6FVU2l0obPczrkDxkBt50lm4fEnRoA9DA1HczBDbu0BZ","userId":"60784f6d6f88b06bbee53817"}
   */ 

  // check if lb3 login was successful 
  if (main_response.statusCode !== 200) {
    // login failed on lb3
    // returning error
    res.status(main_response.statusCode)
      .send(main_response.text);
    next('route');
    return;
  }
    
  // get main login token field and prepares the array where to store the tokens
  const main_token_field = utils.get_value(urls,[ main_login, 'token-field' ]);
  var tokens = [];
  
  // iterate on all defined login backends and login in each one of them
  // skip main login
  Object.keys(urls).forEach(async be => {
    if (be !== main_login) {
      // login on the LB4 catamel
      console.log('Logging in into ' + be + 'backend');
      console.log('Connection arguments: ' + JSON.stringify(urls[be]));
      const be_response = await request(urls[be]['#method'],urls[be]['#url'])
        .send(req.body)
        .then(utils.backend_success_callback)
        .catch(utils.backend_response_error_callback);
  
      // check if login in lb4 is successful
      tokens[be] = (
        be_response.statusCode === 200 
        ? be_response.body[urls[be]["#token_field"]]
        : "<failed-login>");
    }
  })
  // prepare tokens
  var user_reply = main_response.body;
  tokens[main_login] = user_reply[main_token_field];
  user_reply[main_token_field] = utils.prepAuthTokensForUser(tokens);
  
  // return token to user
  res.status(200).json(user_reply);
}

async function user_logout(req, res, next, urls, backends) {
  console.log('User logout');

  // check if method is correct, aka POST
  if (req.method !== 'POST') {
    const error = utils.http_401_error;
    // return error
    res.status(error.statusCode)
      .json({
        'error' : error
      });
      next('router');
      return;
  }
  
  /*
   * this is the structure of the request that we are expecting
   *
   * http://localhost:3000/api/v3/Users/logout?access_token=qO8PkuKRcny7PTxAMx9mAUpAxXJzvWn4QkEZIahDBcrbl2kXeP97g5OYePqjWIGd
   * 
   * the access_token should countins the lb3 and lb4 tokens separated by ~
   * 
   */
  console.log('Extracting access token...');
  /*
   * var auth = [];
   * backends.forEach(be => {
   *   auth[be] = utils.prepAuthorization(url[be]['#auth'],req);
   * })
   */
   const auth = utils.getAuthTokensFromRequest(req);
  

   /* 
   * > curl -i -X POST -H 'Content-type: application/json'  http://localhost:3000/api/v3/Users/logout?access_token=DDGoeQbN0QM05awhLcQdkTbiJco3dRz7oC8xk7XODHwPM07ul0tUm1Koi4sbBIEW
   * HTTP/1.1 204 No Content
   * Vary: Origin, Accept-Encoding
   * Access-Control-Allow-Credentials: true
   * X-XSS-Protection: 1; mode=block
   * X-Frame-Options: SAMEORIGIN
   * Strict-Transport-Security: max-age=0; includeSubDomains
   * X-Download-Options: noopen
   * X-Content-Type-Options: nosniff
   * Content-Type: application/json; charset=utf-8
   * Date: Wed, 21 Jul 2021 09:35:32 GMT
   * Connection: keep-alive
   * Keep-Alive: timeout=5
   * 
   *
   * lb3 returns 204 when logout request is successful
   */

  // loggin out from all the backends
  console.log('Logging out from all backends');
  var be_logout_errors = 0;
  backends.forEach(async be => {
    console.log("Logging out from " + be );
    console.log('Connection arguments: ' + JSON.stringify(urls[be]));

    if ( urls[be]['#url'] && !auth[be]['Authorization'].match(/\<.+\>/) ) {
  
      const be_response = await request(urls[be]['#method'],urls[be]['#url'])
        .set('Content-Type','application/json')
        .set(auth[be])
        .then(utils.backend_success_callback)
        .catch(utils.backend_response_error_callback);

      // check if logout was successful 
      be_logout_errors += (response.statusCode !== 204) ? 1 : 0;

    }

  });
  
  res.status(204).send((
    be_logout_errors == 0
    ? 'logout successful' 
    : 'logout partially successful'
  ));
}

function config_user_routes(config) {
    // populate routes to login and logout functions
  console.log('Setting User login and logout routes')
  const local_local_user_login_path = utils.reg_exp_from_string(
    utils.sconcat( 
      '^', 
      utils.get_value( config, ['routes', '#user-authentication', '#local-user-login', '#path'] )));
  const local_ldap_user_login_path = utils.reg_exp_from_string(
    utils.sconcat( 
      '^', 
      utils.get_value( config, ['routes', '#user-authentication', '#ldap-user-login', '#path'] )));
  const local_user_logout_path = utils.reg_exp_from_string(
    utils.sconcat( 
      '^', 
      utils.get_value( config, ['routes', '#user-authentication', '#user-logout', '#path'] )));
  console.log('Local user login path : ' + local_local_user_login_path);
  console.log('Ldap user login path : ' + local_ldap_user_login_path);
  console.log('User logout path : ' + local_user_logout_path);

  // check if we have a prefix to be removed from the original requests
  const local_prefix_remove = utils.reg_exp_from_string(
    utils.sconcat( 
      '^', 
      utils.get_value( config, ['routes','#prefix-remove'] )));

  // prepare backend urls
  const local_local_user_login_url = utils.get_value(config, [ 'routes', '#user-authentication', '#local-user-login', '#backend']);
  const local_ldap_user_login_url = utils.get_value(config, [ 'routes', '#user-authentication', '#ldap-user-login', '#backend']);
  var local_user_logout_url = utils.get_value(config, [ 'routes', '#user-authentication', '#user-logout', '#backend']);
  const local_backends = utils.get_value(config,["configuration", "backends"]);
  const local_main_login = utils.get_value(config,["configuration", "main-login"]);
  const local_secondary_login = local_backends.filter(item => item !== local_main_login);
  local_backends.forEach( (k) => { 
    local_user_logout_url[k]['#auth'] = [k, utils.get_value(config, [ 'constants', 'auth', k ])];
  });

  return async function(req, res, next) {
    // this variable contins all the routing information
    const local_user_login_path = local_local_user_login_path;
    const ldap_user_login_path = local_ldap_user_login_path; 
    const user_logout_path = local_user_logout_path;
    const prefix_remove = local_prefix_remove;

    // check the correct route
    let endpoint = (prefix_remove ? req.originalUrl.replace(prefix_remove,'') : req.originalUrl);
    console.log('Endpoint requested : ' + endpoint);

    // select which user functionality the user wants
    if (endpoint.match(local_user_login_path)) {
      await local_user_login(req,res,next,local_local_user_login_url,local_main_login);
    } else if (endpoint.match(ldap_user_login_path)) {
      await ldap_user_login(req,res,next,local_ldap_user_login_url,local_main_login);
    } else if (endpoint.match(user_logout_path)) {
      await user_logout(req,res,next,local_user_logout_url,local_backends);
    } else {
      // if we get here, we are in trouble
      console.log('No user routing for endpoint : ' + endpoint);
      //res.send('Routing error for endpoint : ' + endpoint);
      next();
    }
  }

}

module.exports = config_user_routes;
