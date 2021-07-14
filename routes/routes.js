var express = require('express');
var router = express.Router();

/*
 * function to substitute the constants in the value passed
 */
function expand_route(value,constants) {
  return ( value in constants ? constants[value] : value);
}

/*
 * create the routing function matching all the routes specified in config
 */
function config_routes(config) {

  // variable containg the routing table
  var local_routes = {};
  
  // populate the routing table according
  for (const route in config['routes']) {
    localRoutes[route] = expand_route(config['routes'][route],config['#constants'])
  }
  console.log('Routes : ');
  console.log(local_routes)

  // default route
  var local_default_route = expand_route(config['#default'],config['#constants']); 

  return function(req, res, next) {
    // this variable contins all the routing information
    const routes = local_routes;
    const default_route = local_default_route; 

    // check the correct route
    let endpoint = req.path;
    console.log('Endpoint requested : ' + endpoint);

    // find applicable route
    var backend_url = default_route + req.originalUrl;
    for (const route in routes) {
      if (endpoint.match(route)) {
        // the current route applies to the end point requested
        backend_url =  + req.originalUrl;
      }
    }
    console.log('Routing request to : ' + backend_url);
    res.send('Routing request to : ' + backend_url);
  }

}


/*
 * this function intercept
 */

module.exports = config_routes;
