var got = require('got');

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

/*
 * wrapper function to accept method as parameter when calling got
 */
function got() {
  
}

module.exports = {expand_route, get_value, reg_exp_from_string, sconcat};