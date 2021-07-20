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
  console.log(http_501_error.statusCode + " " + lerr.message);
  return {
    ok: false,
    text: JSON.stringify(http_501_error),
    body: http_501_error,
    status: http_501_error.statusCode,
    statusCode: http_501_error.statusCode
  };
}

function backend_success_callback(lres,) {
  console.log(lres.status + " " + lres.text);
  return lres;
}
/*
 * function to substitute the constants in the value passed
 */
function expand_route(value,constants) {
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


module.exports = {http_501_error, http_401_error, backend_response_error_callback, backend_success_callback, expand_route, get_value, reg_exp_from_string, sconcat};