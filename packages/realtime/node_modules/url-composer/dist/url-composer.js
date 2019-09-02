(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.urlComposer = factory());
}(this, (function () { 'use strict';

/**
 * @module url-composer
 * @description Module to build dynamic URLs without a fuss
 */

//
// Path analysis regular expressions
//

/**
 * Trailing slash regular expression
 * @private
 */
var TRAILING_SLASH = /\/$/;
/**
 * Leading slash regular expression
 * @private
 */
var LEADING_SLASH = /^\//;
/**
 * Parentheses global regular expression
 * @private
 */
var PARENTHESES = /[()]/g;
/**
 * Optional parameters global regular expression
 * @private
 */
var OPTIONAL_PARAMS = /\((.*?)\)/g;
/**
 * Splat parameters global regular expression
 * @private
 */
var SPLAT_PARAMS = /\*\w+/g;
/**
 * Named parameter regular expression
 * @private
 */
var NAMED_PARAM = /(\(\?)?:\w+/;
/**
 * Named parameters global regular expression
 * @private
 */
var NAMED_PARAMS = /(\(\?)?:\w+/g;
/**
 * Some wierd escape regular expression
 * @private
 */
var ESCAPE = /[-{}[\]+?.,\\^$|#\s]/g;

//
// Helper functions
//

/**
 * Checks if a given object is an array
 *
 * @private
 *
 * @param  {mixed} obj The object to check
 * @return {boolean}   `true` if `obj` is an array else `false`
 */
function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

/**
 * Check if a given object is empty
 *
 * @private
 *
 * @param  {object} obj The object to check
 * @return {boolean}    `true` if `obj` is empty else `false`
 */
function isEmpty (obj) {
  if (obj == null) { return true }
  if (obj.length > 0) { return false }
  if (obj.length === 0) { return true }
  if (typeof obj !== 'object') { return true }

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) { return false }
  }

  return true
}

//
// ## Path parsing functions
//

/**
 * Inject arguments into a dynamic path definition and clean unused optional parts
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  args Object or array of arguments to inject.
 *                       If it is an array, arguments will be injected in sequential order.
 *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
 * @return {string}      The parsed path with injected arguments
 */
function composePath (path, args) {
  path = path || '';
  args = args || [];

  if (isEmpty(args)) {
    return removeOptionalParams(path)
  }

  path = replaceArgs(path, args);

  return removeTrailingSlash(
    removeParentheses(path)
  )
}

/**
 * Replace dynamic parts of a path by given values
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  args Object or array of arguments to inject.
 *                       If it is an array, arguments will be injected in sequential order.
 *                       For an object, the object keys will be used to map values to the dynamic parts of the path.
 * @return {string}      Path with injected arguments
 */
function replaceArgs (path, args) {
  args = args || [];

  if (!isArray(args)) {
    var paramNames = path.match(NAMED_PARAMS);
    if (paramNames) {
      args = paramNames.map(function (name) { return args[name.substr(1)]; });
    }
  }

  if (isArray(args)) {
    args.forEach(function (arg) {
      if (arg) { path = replaceArg(path, arg); }
    });
  }

  var matches = path.match(OPTIONAL_PARAMS);

  if (matches) {
    matches.forEach(function (part) {
      if (isNamedOrSplatParam(part)) {
        path = path.replace(part, '');
      }
    });
  }

  return path
}

/**
 * Replace the first matching dynamic part of a path by the given argument
 *
 * @private
 *
 * @param  {string} path The dynamic path definition
 * @param  {mixed}  arg  The value to inject
 * @return {string}      The modified path
 */
function replaceArg (path, arg) {
  var hasNamedParam = path.indexOf(':') !== -1;
  arg = encodeURIComponent(arg);

  if (hasNamedParam) {
    return path.replace(NAMED_PARAM, arg)
  }

  return path.replace(SPLAT_PARAMS, arg)
}

/**
 * Check if the next dynamic part in a path is a named or splat parameter definition
 *
 * @private
 *
 * @param  {string} param Dynamic part of a dynamic path definition
 * @return {boolean}      `true` if `param` is a named or splat parameter else `false`
 */
function isNamedOrSplatParam (param) {
  return NAMED_PARAM.test(param) || SPLAT_PARAMS.test(param)
}

/**
 * Strip the unfilled optional parameters from a dynamic path definition
 *
 * @private
 *
 * @param  {string} path The dynamic path to modify
 * @return {string}      The modified path
 */
function removeOptionalParams (path) {
  return path.replace(OPTIONAL_PARAMS, '')
}

/**
 * Remove the last character from a path if it is a slash
 *
 * @private
 *
 * @param  {string} path The path to modify
 * @return {string}      The modified path
 */
function removeTrailingSlash (path) {
  return path.replace(TRAILING_SLASH, '')
}

/**
 * Remove the first character from a path if it is a slash
 *
 * @private
 *
 * @param  {string} path The path to modify
 * @return {string}      The modified path
 */
function removeLeadingSlash (path) {
  return path.replace(LEADING_SLASH, '')
}

/**
 * Remove/clean remaining parentheses from a path after it has been parsed
 *
 * @private
 *
 * @param  {string} path The path to modify/clean
 * @return {string}      The modified path
 */
function removeParentheses (path) {
  return path.replace(PARENTHESES, '')
}

/**
 * Smart concatenation of host, path, query and hash. Will add the correct glue character when needed
 *
 * @private
 *
 * @param  {object} options Object describing the url
 * @return {string}         Concatenation of host, path, query and hash
 */
function smartConcat (ref) {
  var host = ref.host;
  var path = ref.path;
  var query = ref.query;
  var hash = ref.hash;

  // Normalize host
  host = removeTrailingSlash(host);

  // Split path in case path contains an existing query
  var ref$1 = path.split('?');
  var pathPart = ref$1[0];
  var queryPart = ref$1[1];

  // Normalize path
  path = removeTrailingSlash(
    removeLeadingSlash(pathPart)
  );

  // Add specific glue characters
  path = path ? ("/" + path) : '';
  queryPart = queryPart ? (queryPart + "&") : '';
  query = query ? ("?" + queryPart + query) : '';
  hash = hash ? ("#" + hash) : '';

  return ("" + host + path + query + hash)
}

/**
 * Test the existence of certain fields in the stats
 *
 * @private
 *
 * @param  {array}  params List of analyzed parameters
 * @param  {string} field  Name of the field to analyze
 * @return {array}         Filtered array
 */
function testParameter (params, field) {
  var result = [];

  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    if (p[field] && p.value === '') {
      result.push(p);
    }
  }

  return result
}

//
// ## Public API functions
//

/**
 * Retrieve matches for named and splat params for a dynamic path definition
 *
 * @name match
 * @function
 * @public
 *
 * @param  {string} path Dynamic path definition
 * @return {object}      Object with a `named` and `splat` array containing the extracted parameter names
 */
function getParamsMatch (path) {
  return {
    named: (path && path.match(NAMED_PARAMS)) || [],
    splat: (path && path.match(SPLAT_PARAMS)) || []
  }
}

/**
 * Transform a dynamic path definition to an executable regular expression
 *
 * @name regex
 * @function
 * @public
 *
 * @param  {string} route The route/path to transform
 * @return {RegExp}       The resulting regular expression instance
 */
function routeToRegex (route) {
  route = route.replace(ESCAPE, '\\$&')
    .replace(OPTIONAL_PARAMS, '(?:$1)?')
    .replace(NAMED_PARAMS, function (match, optional) { return optional ? match : '([^/?]+)'; })
    .replace(SPLAT_PARAMS, '([^?]*?)');

  return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$')
}

/**
 * Build the path part of a URL using dynamic path definitions
 *
 * @name path
 * @function
 * @public
 *
 * @param  {object} options An object containing `path` and `params` keys which will be used to build the resulting path.
 * @return {string}         The built path
 */
function buildPath (options) {
  options = options || {};

  return composePath(options.path, options.params)
}

/**
 * Build the query part of a URL
 *
 * @name query
 * @function
 * @public
 *
 * @param  {object} options An object containing a `query` key. The `key` should be an object of key/value pairs that
 *                          will be converted to a URL query string.
 * @return {string}         Encoded URL query string
 */
function buildQuery (options) {
  var query = [];
  options = options || {};

  for (var key in options.query) {
    var param = options.query[key];
    query.push((key + "=" + (encodeURIComponent(param))));
  }

  return query.length ? query.join('&') : ''
}

/**
 * Test a URL against a dynamic path definition
 *
 * @public
 *
 * @param  {object} options An object with `path` and `url` keys.
 *                          The `path` is the dynamic path definition against which the `url` will be tested
 * @return {boolean}        `true` if `url` matches the `path` else `false`
 */
function test (options) {
  options = options || {};

  var re = routeToRegex(options.path);

  return re.test(options.url)
}

/**
 * Build a complete URL
 *
 * @public
 *
 * @param  {object} options An object containing `host`, `path`, `params`, `query` and `hash`.
 *                          Everything is optional, calling `build` without any parameters will just return an empty string.
 * @return {string}         The built URL
 */
function build (options) {
  options = options || {};
  options.host = options.host || '';

  var path = buildPath(options);
  var query = buildQuery(options);

  return smartConcat({ host: options.host, path: path, query: query, hash: options.hash })
}

/**
 * Transform an arguments array into an object using the dynamic path definition
 *
 * @name params
 * @function
 * @public
 *
 * @param  {string} path The dynamic path definition
 * @param  {array}  args Arguments array
 * @return {object}      The resulting key/value pairs
 */
function paramsArray2Object (path, args) {
  var result = {};
  var params = getParamsMatch(path);

  var i = 0;

  params.named.forEach(compose);
  params.splat.forEach(compose);

  return result

  // Helper

  function compose (name) {
    result[name.slice(1)] = args[i++];
  }
}

/**
 * Generate stats about a path
 *
 * @public
 *
 * @param  {string} path Dynamic path definition
 * @param  {object} args Object of arguments to analyze the state of path if it was injected with the given parameters
 * @return {object}      Object containing different stats about the path
 */
function stats (path, args) {
  var optional = path.match(OPTIONAL_PARAMS) || [];
  var ref = getParamsMatch(path);
  var named = ref.named;
  var splat = ref.splat;

  var params = named.concat(splat);

  args = args || {};

  if (isArray(args)) {
    args = paramsArray2Object(path, args);
  }

  params = params.map(function (param) {
    var isOptional = false;

    for (var i = 0; i < optional.length; i++) {
      var p = optional[i];
      if (p.indexOf(param) !== -1) {
        isOptional = true;
        break
      }
    }

    return {
      name: param,
      value: args[param.slice(1)] || '',
      optional: isOptional,
      required: !isOptional
    }
  });

  return {
    params: params,
    hasOptionalParams: OPTIONAL_PARAMS.test(path),
    missingOptionalParams: testParameter(params, 'optional'),
    missingRequiredParams: testParameter(params, 'required'),
    missingParams: testParameter(params, 'name')
  }
}

/**
 * Parse a given url `path` according to its `definition` to extract the parameters
 *
 * @public
 *
 * @throws {Error} Throws if `options` object is missing `path` or `definition`
 *
 * @param  {object} options Object containing a `path` and dynamic path `definition`.
 *                          Can optionnaly take `object: true` to convert the result to an object, defaults to `false`.
 * @return {mixed}          Array of parameter values extracted from the path or key/value pair object.
 *                          Return `null` if the `path` does not match the `definition`.
 */
function parse (options) {
  if ( options === void 0 ) options = {};

  var path = options.path;
  var definition = options.definition;
  var object = options.object;

  if (!path && !definition) {
    throw new Error('url-composer: Missing path and definition')
  }

  var re = routeToRegex(definition);

  var params = re.exec(path);

  if (!params) { return null }

  params = params.slice(1);

  var result = params.map(function (param, i) {
    if (i === params.length - 1) { return param || null }
    return param ? decodeURIComponent(param) : null
  });

  if (object) {
    var query = result.pop();
    result = paramsArray2Object(definition, result);
    result.query = query;
  }

  return result
}

var index = {
  build: build,
  test: test,
  stats: stats,
  parse: parse,
  params: paramsArray2Object,
  path: buildPath,
  query: buildQuery,
  regex: routeToRegex,
  match: getParamsMatch
};

return index;

})));
