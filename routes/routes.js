var express = require('express');
var request = require('superagent');
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
    // skips all the keys starting with #
    if (!route.startsWith('#')) {
      var info = config['routes'][route];
      var value = (typeof info === 'object' && '#url' in info ? info['#url'] : info);
      var auth = (typeof info === 'object' && '#auth' in info ? info['#auth'] : info);
      local_routes[route] = {
        '#regexp' : new RegExp(route),
        '#route' : utils.expand(value,config['constants']['urls']),
        '#auth' : [auth, utils.expand(auth,config['constants']['auth'])]
      }
    }
  }
  console.log('Routes : ');
  console.log(local_routes)

  // check if we have a prefix to be removed from the original requests
  const local_prefix_remove = ('#prefix-remove' in config['routes'] && config['routes']['#prefix-remove'] ? new RegExp("^" + config['routes']['#prefix-remove']) : false);

  // default route
  var local_default_route = {
    '#route' : utils.expand(config['routes']['#default'],config['constants']['urls']),
    '#auth' : [config['routes']['#default'], utils.expand(config['routes']['#default'],config['constants']['auth'])]
  }; 

  return async function(req, res, next) {
    // this variable contins all the routing information
    const routes = local_routes;
    const default_route = local_default_route; 
    const prefix_remove = local_prefix_remove;

    // check the correct route
    let endpoint = (prefix_remove ? req.originalUrl.replace(prefix_remove,'') : req.originalUrl).split('?')[0];
    console.log('Endpoint requested : ' + endpoint);

    // find applicable route
    var backend_url = default_route['#route'] + endpoint;
    var backend_auth = default_route['#auth'];
    for (const route in routes) {
      if (endpoint.match(routes[route]['#regexp'])) {
        // the current route applies to the end point requested
        backend_url =  routes[route]['#route'] + endpoint;
        backend_auth = routes[route]['#auth'];
        break;
      }
    }
    console.log('Routing request to : ' + backend_url);

    console.log('Extracting access token...');
    const auth = utils.prepAuthorization(backend_auth,req);

    // remove authorization from query object if needed
    var query = req.query;
    if ("access_token" in query) {
      delete query.access_token;
    }

    const request_response = await request(req.method,backend_url)
      .set(auth)
      .query(query)
      .send(req.body)
      .then(utils.backend_success_callback)
      .catch(utils.backend_response_error_callback);

    res.send(request_response.body);
  }

}


/*
 * this function intercept
 */

module.exports = config_routes;
