var express = require('express');
var request = require('superagent');
var utils = require('../utils/utils.js');
//var router = express.Router();

async function local_user_login(req, res, next, urls) {
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
  
  // login on the LB3 catamel
  console.log('Logging in into lb3 backend. Connection arguments: ' + JSON.stringify(urls['#lb3']));
  const lb3_response = await request(urls['#lb3']['#method'],urls['#lb3']['#url'])
      .send(req.body)
      .then(utils.backend_success_callback)
      .catch(utils.backend_response_error_callback);
  /*
  */
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
  
  // check if lb3 login was successful 
  if (lb3_response.statusCode !== 200) {
    // login failed on lb3
    // returning error
    res.status(lb3_response.statusCode)
      .send(lb3_response.text);
    next('route');
    return;
  }
  
  // if we got here we are ready to login on lb4
  // login on the LB4 catamel
  console.log('Logging in into lb4 backend. Connection arguments: ' + JSON.stringify(urls['#lb4']));
  const lb4_response = await request(urls['#lb4']['#method'],urls['#lb4']['#url'])
    .send(req.body)
    .then(utils.backend_success_callback)
    .catch(utils.backend_response_error_callback);

  // check if login in lb4 is successful
  var lb4_token = (lb4_response.statusCode === 200 ? lb4_token = lb4_response.json()['token'] : "<failed-login>");

  // lb4 token to user reply
  var user_reply = lb3_response.body;
  user_reply.id = user_reply.id + "~" + lb4_token;

  // return token to user
  res.status(200).json(user_reply);
}


async function ldap_user_login(req, res, next, urls) {
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
  
  // login on the LB3 catamel
  console.log('Logging in into lb3 backend. Connection arguments: ' + JSON.stringify(urls['#lb3']));
  const lb3_response = await request(urls['#lb3']['#method'],urls['#lb3']['#url'])
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
  if (lb3_response.statusCode !== 200) {
    // login failed on lb3
    // returning error
    res.status(lb3_response.statusCode)
      .send(lb3_response.text);
    next('route');
    return;
  }
    
  // if we got here we are ready to login on lb4
  // login on the LB4 catamel
  console.log('Logging in into lb4 backend. Connection arguments: ' + JSON.stringify(urls['#lb4']));
  const lb4_response = await request(urls['#lb4']['#method'],urls['#lb4']['#url'])
    .send(req.body)
    .then(utils.backend_success_callback)
    .catch(utils.backend_response_error_callback);
  
  // check if login in lb4 is successful
  var lb4_token = (lb4_response.statusCode === 200 ? lb4_token = lb4_response.json()['token'] : "<failed-login>");
  
  // lb4 token to user reply
  var user_reply = lb3_response.body;
  user_reply.access_token = user_reply.access_token + "~" + lb4_token;
  
  // return token to user
  res.status(200).json(user_reply);
}

function user_logout(req, res, next) {
  console.log('User logout');
  res.send('User logout');
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
      utils.get_value( config, ['routes', '#user-authentication', '#user-logot', '#path'] )));
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
  const local_user_logout_url = utils.get_value(config, [ 'routes', '#user-authentication', '#user-logout', '#backend']);

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
      await local_user_login(req,res,next,local_local_user_login_url)
    } else if (endpoint.match(ldap_user_login_path)) {
      await ldap_user_login(req,res,next,local_ldap_user_login_url)
    } else if (endpoint.match(user_logout_path)) {
      await user_logout(req,res,next,local_user_logout_url)
    } else {
      // if we get here, we are in trouble
      console.log('No user routing for endpoint : ' + endpoint);
      //res.send('Routing error for endpoint : ' + endpoint);
      next();
    }
  }

}

module.exports = config_user_routes;
