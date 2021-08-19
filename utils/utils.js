var got = require('got');

/*
 * generic error
 */
const http_501_error = {
  statusCode: 501,
  name: "Error",
  message: "Internal Server Error",
  code: "INTERNAL_SERVER_ERROR"
}

const http_401_error = {
  "statusCode" : 401,
  "name" : "Error",
  "message" : "Wrong method or authorization required",
  "code" : "AUTHORIZATION_REQUIRED_OR_WRONG_METHOD"
}

function backend_response_error_callback(lerr) {
  const user_error = (
    lerr.response.statusCode == 401 
    ? http_401_error
    : http_501_error
  )
  console.log(user_error.statusCode + " " + lerr.message);
  return {
    ok: false,
    text: JSON.stringify(user_error),
    body: user_error,
    status: user_error.statusCode,
    statusCode: user_error.statusCode,
    full_error: lerr
  };
}

function backend_success_callback(lres,) {
  console.log(lres.status + " " + lres.text.substring(0,50));
  return lres;
}
/*
 * function to substitute the constants in the value passed
 */
function expand(value,constants) {
  return ( value in constants ? constants[value] : value);
}

/*
 * extract nested keys from nested objects
 */
function get_value(obj,keys) {
  const current_key = keys[0];
  const current_value = ( current_key in obj ? obj[current_key] : false );
  const remaining_keys = keys.slice(1);

  return (
    typeof current_value === 'object' && current_value !== null && current_value !== false && remaining_keys.length >  0
    ? get_value(current_value,remaining_keys)
    : current_value)
}

/*
 * return a reqular expression if the value is not false
 */ 
function reg_exp_from_string(value) {
  return (
    (value && ( typeof value === 'string' || value instanceof String ))
    ? new RegExp(value)
    : false
  );
}

/*
 * return the concatenation of all the inputs, only if they are all strings
 * sconcat = strict concat
 */
function sconcat() {
  output = ""
  Array.from(arguments).every((v) => {
    console.log(v);
    if ( typeof v === 'string' || v instanceof String ) {
      output += v;
      return true;
    } else {
      output = false;
      return false;
    }
  })
  return output;
}

/*
 * extract authorization token from request object
 */
function getAuthorization(req) {
  /*
   * this function return the lb3 and lb4 authorization tokens
   * [lb3_token, lb4_token] = getAuthorization(req)
   */
  // first check if we have authorization header
  // than it checks if we have an access_token in the query
  const [lb3_token, lb4_token] = (
    "authorization" in req.headers
    ? req.headers.authorization.replace(/^Bearer /,'').split("~")
    : (
      "access_token" in req.query
      ? req.query.access_token.split("~")
      : ["",""]
    )
  );
  return {
    '#lb3': lb3_token,
    '#lb4': lb4_token
  }
}

/* 
 * return the authorization object to inject on the backend request header
 */
function prepAuthorization(auth, req) {
  // retrieve the authorization tokens
  const tokens = getAuthTokensFromRequest(req);
  if ( tokens[auth[0]] ) {
    switch ( auth[1] ) {
      case 'Legacy' :
        return {
          'Authorization' : tokens[auth[0]]
        }
        break;
      case 'Bearer' :
      case 'Bearer JWT' :
        return {
          'Authorization' : 'Bearer ' + tokens[auth[0]]
        }
        break;
      case 'JWT':
        return {
          'Authorization' : 'JWT ' + tokens[auth[0]]
        }
        break;
    }
  }
  return {}
}

/*
 * encode auth tokens to send to the user
 */
function prepAuthTokensForUser(auth) {
  return encodeURIComponent(
    JSON.stringify(
      auth
    )
  )
}

/*
 * extract auth tokens prepared with prepAuthTokensForUser from user request
 */
function getAuthTokensFromRequest(req) {
  const token = (
    "authorization" in req.headers
    ? req.headers.authorization.replace(/^Bearer /,'').replace(/^JWT /,'')
    : (
      "access_token" in req.query
      ? req.query.access_token
      : encodeURIComponent("{}")
    )
  );
  return JSON.parse(decodeURIComponent(token));
}

function getSuccessStatusCode(backend_config) {
  return ( Object.keys(backend_config).includes('#success-status-code') ? backend_config['#success-status-code'] : 200);
}

module.exports = {
  http_501_error, 
  http_401_error, 
  backend_response_error_callback, 
  backend_success_callback, 
  expand, 
  get_value, 
  reg_exp_from_string, 
  sconcat, 
  getAuthorization, 
  prepAuthorization,
  prepAuthTokensForUser,
  getAuthTokensFromRequest,
  getSuccessStatusCode
};