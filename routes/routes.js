var express = require('express');
var utils = require('../utils/utils.js');
//var router = express.Router();



/*
 * create the routing function matching all the routes specified in config
 */
function config_routes(config) {

  // variable containg the routing table
  var local_routes = {};
  
  // populate the routing table according
  for (const route in config['routes']) {
    var value = config['routes'][route];
    if (!route.startsWith('#')) {
      local_routes[route] = {
        '#regexp' : new RegExp(route),
        '#route' : utils.expand_route(value,config['constants'])
      }
    }
  }
  console.log('Routes : ');
  console.log(local_routes)

  // check if we have a prefix to be removed from the original requests
  const local_prefix_remove = ('#prefix-remove' in config['routes'] && config['routes']['#prefix-remove'] ? new RegExp("^" + config['routes']['#prefix-remove']) : false);

  // default route
  var local_default_route = utils.expand_route(config['routes']['#default'],config['constants']); 

  return function(req, res, next) {
    // this variable contins all the routing information
    const routes = local_routes;
    const default_route = local_default_route; 
    const prefix_remove = local_prefix_remove;

    // check the correct route
    let endpoint = (prefix_remove ? req.originalUrl.replace(prefix_remove,'') : req.originalUrl);
    console.log('Endpoint requested : ' + endpoint);

    // find applicable route
    var backend_url = default_route + endpoint;
    for (const route in routes) {
      if (endpoint.match(routes[route]['#regexp'])) {
        // the current route applies to the end point requested
        backend_url =  routes[route]['#route'] + endpoint;
        break;
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
