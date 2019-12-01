(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){
// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
const parse = require('./parse.js');
const mcjson = require('../mcjson/index.js');

module.exports = (mccode, outputContainer) => {
  const parsed = parse(mccode, {
    noCredits: true,
    noWhitelines: true,
    fullError: false
  });
  if (parsed.isError) return alert(parsed.error);

  const outputFiles = [];

  for (let jsonFile of parsed.result) {
    const data = mcjson.generate(jsonFile);
    outputFiles.push({
      path: data.path.replace(/^.\//, ''),
      content: data.content
    });
  }

  return outputFiles;

}

},{"../mcjson/index.js":9,"./parse.js":5}],5:[function(require,module,exports){
const {
  Parser,
  lazy,
  letter,
  digit,
  regex,
  regexA,
  letters,
  digits,
  err,
  str,
  sequenceOf,
  choice,
  many,
  optional,
  between,
  sepBy,
} = require('./parsers/parsers.js');

const {
  whitespaceParser,
  newLineParser,
  manyNewLineParser,
} = require('./parsers/utility.js');

const mcfunctionParser = require('./parsers/mcfunction.js');

module.exports = (mccode, options = {fullError: false, noWhitelines: false}) => {
  const {fullError, noWhitelines} = options;


  const unknownTypeReturn = e => new Parser(parserState => {
    return Parser.updateParserResult(parserState, [e])
  });


  const fileParser = sequenceOf([
    sequenceOf([
      str("!file:"),
      optional(whitespaceParser),
      regex(".+"),
    ]).map(e => e[2]),
    optional(manyNewLineParser),
    optional(sequenceOf([
      str("!type:"),
      optional(whitespaceParser),
      regex(".+"),
    ]).map(e => e[2])).chain(e => {
      if(e == null || e.toLowerCase() == "mcfunction") return mcfunctionParser(options);



      else return unknownTypeReturn(e);
    }),
  ])

  const mainParser = many(sequenceOf([
    optional(manyNewLineParser),
    fileParser,
  ])).map(e => {
    let result = [];

    for(let ee of e) {
      let file = {};

      file.path = ee[1][0];
      file.type = ee[1][2][0];
      file.nodes = ee[1][2][2] ? ee[1][2][2] : [];


      result.push(file)
    }

    return result;
  }).errorMap(e => {
    if(e == 'many: unable to match with parser at least once at index 0') return 'No file path specified'
    return e;
  })

  return mainParser.run(mccode)

}

},{"./parsers/mcfunction.js":6,"./parsers/parsers.js":7,"./parsers/utility.js":8}],6:[function(require,module,exports){
const {
  Parser,
  lazy,
  letter,
  digit,
  regex,
  regexA,
  letters,
  digits,
  err,
  str,
  sequenceOf,
  choice,
  many,
  optional,
  between,
  sepBy,
} = require('./parsers.js')

const {
  whitespaceParser,
  newLineParser,
  manyNewLineParser,
} = require('./utility.js')

const codeVars = {};
const codeModals = {};


module.exports = options => {

  const {
    noWhitelines,
    fullError,
  } = options;

  const logicParser = (input, invert = false, inverted = false, options = {or: true, and: true, groups: true}) => {
    const orEnabled = options.or;
    const andEnabled = options.and;
    const groupsEnabled = options.groups;
    if(orEnabled === false && andEnabled === false) return input;
    let match;
    if(orEnabled && groupsEnabled && /(?:(?:(.+?)\s+\|\|\s+(!?)\((.+?)\))|(?:(!?)\((.+?)\)\s+\|\|\s+(.+)))(?!\))/.test(input)) {
      match = input.match(/(?:(?:(.+?)\s+\|\|\s+(!?)\((.+?)\))|(?:(!?)\((.+?)\)\s+\|\|\s+(.+)))(?!\))/);
      let invertChar = (match[2] || match[2] == '') ? match[2] : match[4];
      return {
        "type": "or",
        "inverted": invert ? !inverted : inverted,
        "conds": [logicParser(match[1] ? match[1] : match[5], (invertChar == "!" && match[5]), inverted, options), logicParser(match[3] ? match[3] : match[6], (invertChar == "!" && match[3]), inverted, options)]
      }
    } else if(andEnabled && groupsEnabled && /(?:(?:(.+?)\s+&&\s+(!?)\((.+?)\))|(?:(!?)\((.+?)\)\s+&&\s+(.+)))(?!\))/.test(input)) {
      match = input.match(/(?:(?:(.+?)\s+&&\s+(!?)\((.+?)\))|(?:(!?)\((.+?)\)\s+&&\s+(.+)))(?!\))/);
      let invertChar = (match[2] || match[2] == '') ? match[2] : match[4];
      return {
        "type": "and",
        "inverted": invert ? !inverted : inverted,
        "conds": [logicParser(match[1] ? match[1] : match[5], (invertChar == "!" && match[5]), inverted, options), logicParser(match[3] ? match[3] : match[6], (invertChar == "!" && match[3]), inverted, options)]
      }
    } else if(orEnabled && /\s\|\|\s/.test(input)) {
      match = input.match(/(.+?)\s+\|\|\s+(.+)/);
      if(groupsEnabled === false) {
        if(/^\(.+?\)$/.test(match[1])) match[1] = match[1].replace(/^\(/, '').replace(/\)$/, '');
        if(/^\(.+?\)$/.test(match[2])) match[2] = match[2].replace(/^\(/, '').replace(/\)$/, '');
      }
      let conds = [logicParser(match[1], false, inverted, options), logicParser(match[2], false, inverted, options)];
      if(/^\(/.test(conds[0]) && /\)$/.test(conds[1])) conds = [conds[0].replace(/^\(/, ''), conds[1].replace(/\)$/, '')]
      else if(/^!\(/.test(conds[0]) && /\)$/.test(conds[1])) conds = [conds[0].replace(/^!\(/, ''), conds[1].replace(/\)$/, '')]
      return {
        "type": "or",
        "inverted": invert ? (/!\(.+?\)/.test(input) ? inverted : !inverted) : (/!\(.+?\)/.test(input) ? !inverted : inverted),
        "conds": conds
      }
    } else if(andEnabled && /\s&&\s/.test(input)) {
      match = input.match(/(.+?)\s+&&\s+(.+)/);
      if(groupsEnabled === false) {
        if(/^\(.+?\)$/.test(match[1])) match[1] = match[1].replace(/^\(/, '').replace(/\)$/, '');
        if(/^\(.+?\)$/.test(match[2])) match[2] = match[2].replace(/^\(/, '').replace(/\)$/, '');
      }
      let conds = [logicParser(match[1], false, inverted, options), logicParser(match[2], false, inverted, options)];
      if(/^\(/.test(conds[0]) && /\)$/.test(conds[1])) conds = [conds[0].replace(/^\(/, ''), conds[1].replace(/\)$/, '')]
      else if(/^!\(/.test(conds[0]) && /\)$/.test(conds[1])) conds = [conds[0].replace(/^!\(/, ''), conds[1].replace(/\)$/, '')]
      return {
        "type": "and",
        "inverted": invert ? (/!\(.+?\)/.test(input) ? inverted : !inverted) : (/!\(.+?\)/.test(input) ? !inverted : inverted),
        "conds": conds
      }
    } else {
      if(/^!/.test(input) && invert) return input.replace(/^!/, '');
      if(!/^!/.test(input) && invert) return '!' + input;
      return input;
    }
  }

  function simpleOrParser(input, convert = false) {
    if(/\s\|\|\s/.test(input) || (convert && /\s&&\s/.test(input))) {
      if(convert == true) return flatten(logicParser(input.replace(/\s+&&\s+/, ' || '), false, false, {or: true, and: false, groups: false}).conds);
      return flatten(logicParser(input, false, false, {or: true, and: false, groups: false}).conds);
    } else {
      return input
    }


    function flatten(arr) {
      const returns = []
      if(typeof(arr) == "string") returns.push(arr);
      else if(Array.isArray(arr)) {
        for(let e of arr) {
          returns.push(...flatten(e))
        }
      }
      else if(typeof(arr) == "object") {
        returns.push(...flatten(arr.conds))
      }

      return returns;
    }
  }

  function seperateInputs(input) {
    let inputs = input.match(/\\?.|^$/g).reduce((p, c) => {
            if(c === '"'){
                p.quote ^= 1;
            }else if(!p.quote && c === ' '){
                p.a.push('');
            }else{
                p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
            }
            return  p;
        }, {a: ['']}).a

    for(let i = 0; i < inputs.length; i++) {
      if(!/,$/.test(inputs[i]) && inputs[i + 1]) {
        inputs[i] = inputs[i] + inputs[i + 1];
        inputs.splice(i + 1);
      } else {
        inputs[i] = inputs[i].replace(/,$/, '');
      }
    }
    return inputs;
  }

  function replaceVars(input) {
    let result = input;
    for(let [name, value] of Object.entries(codeVars)) {
      result = result.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), value)
    }
    return result;
  }
  function replaceModalVars(nodes, varsPreset, varsIn) {
    if(varsPreset.length !== varsIn.length) return [];
    const vars = {};
    for(let i = 0; i < varsPreset.length; i++) {
      vars[varsPreset[i]] = varsIn[i];
    }
    return replaceVarsNode(nodes, vars);

    function replaceVarsNode(node, vars) {
      let returns = [];
      if(Array.isArray(node)) {
        for(let i in node) {
          returns.push(replaceVarsNode(node[i], vars))
        }
      } else if(typeof(node) == "object") {
        if(node.conds) {
          returns = {...node, conds: replaceVarsNode(node.conds, vars)}
        }
        else returns = {...node, args: replaceVarsNode(node.args, vars), nodes: replaceVarsNode(node.nodes, vars)};
      } else if(typeof(node) == "string") {
        returns = node;
        for(let [name, value] of Object.entries(vars)) {
          returns = returns.replace(new RegExp('\\$\\{\\{' + name + '\\}\\}', 'g'), value)
        }
      }
      return returns
    }
  }



  const debugCommentParser = sequenceOf([
    str("//"),
    regex(".*"),
  ]).map(e => {
    const returns = {
      type: "debugComment",
    }
    if(fullError) returns.args = e[1]
    return returns;
  });

  const commandParser = sequenceOf([
    str("/"),
    regex(".*"),
  ]).map(e => replaceVars(e[1]));
  const commentParser = sequenceOf([
    str("#"),
    regex(".*"),
  ]).map(e => e.join(""));

  const setVarParser = sequenceOf([
    str('var'),
    regexA('\\s+([a-zA-Z_]\\w*)\\s+=\\s+(.+)'),
    manyNewLineParser,
  ]).map(e => {
    codeVars[e[1][1]] = e[1][2]
    return [];
  });

  const setModalParser = lazy(() => sequenceOf([
    str('modal'),
    regexA('\\s+([a-zA-Z_]\\w*)\\((.*?)\\)\\s*\\{'),
    nodesParser,
    regex('\\s*\\}'),
    optional(manyNewLineParser),
  ]).map(e => {
    const result = {
      nodes: e[2],
      vars: seperateInputs(e[1][2])
    }
    codeModals[e[1][1]] = result;
    // console.log(codeModals);
    return [];
  }));

  const useModalParser = new Parser(parserState => {
    // if(Object.entries(codeModals).length < 1) return parserState;
    if(Object.entries(codeModals).length < 1) return Parser.updateParserError(parserState, "No modals created!");
    const parsers = [];
    for(let [name, val] of Object.entries(codeModals)) {
      parsers.push(sequenceOf([
        str(name),
        regexA('\\((.*?)\\)'),
      ]))
    }
    return choice(parsers).map(e => {
      e[1][1] = replaceVars(e[1][1])
      return replaceModalVars(codeModals[e[0]].nodes, codeModals[e[0]].vars, seperateInputs(e[1][1]));
    }).parserStateTransformerFn(parserState);
  });

  const jsParser = sequenceOf([
    regexA('js\\((.*?)\\)\\s*\\{([\\w\\W\\s]*?)\\}'),
    optional(manyNewLineParser),
  ]).map(e => {
    const seperatedInputs = seperateInputs(e[0][1]);
    let vars = [];
    if(seperatedInputs.length == 1 && seperatedInputs[0] == '') vars = [];
    else vars = seperatedInputs.map(ee => {
      if(/:/.test(ee)) {
        console.log(ee);
        let split = ee.split(/:\s*/);
        return `const ${split[1].replace(/,*$/, '')}="${codeVars[split[0]]}";`;
      }
      return `const ${ee}="${codeVars[ee]}";`;
    });
    return eval('(()=>{' + vars.join('') + e[0][2] + '})()')
  });


  const elseParser = lazy(() => choice([
    sequenceOf([
      regex("else\\s*\\{\\n*"),
      optional(nodesParser),
      regex("\\}")
    ]).map(e => e[1]),
    sequenceOf([
      regex("else\\s+"),
      ifParser,
    ]).map(e => [e[1]]),
    sequenceOf([
      regex("else\\s+"),
      commandParser,
    ]).map(e => [e[1]]),

  ]))

  const ifParser = lazy(() => choice([
    sequenceOf([
      regexA("if\\((.+?)\\),\\s+(?!(?:\\|\\|)|(?:&&))"),
      nodeParser
    ]).map(e => ({
      type: "if",
      args: logicParser(e[0][1]),
      nodes: e[1]
    })),
    sequenceOf([
      regexA("if\\((.+?)\\)\\s*\\{\\n?"),
      optional(nodesParser),
      regex("\\}\\n*\\s*"),
      elseParser,
    ]).map(e => {
      let result = [
        {
          type: "if",
          args: logicParser(e[0][1]),
          nodes: e[1],
        }
      ]
      if(e[3]) result.push({
          type: "if",
          args: logicParser(e[0][1], true, false),
          nodes: e[3],
        })
      return result
    }),
    sequenceOf([
      regexA("if\\((.+?)\\)\\s*\\{\\n*"),
      optional(nodesParser),
      regex("\\}")
    ]).map(e => ({
        type: "if",
        args: logicParser(e[0][1]),
        nodes: e[1],
      })),
    sequenceOf([
      regexA("if\\((.+?)\\)\\s+(?!(?:\\|\\|)|(?:&&))"),
      commandParser,
      newLineParser,
      elseParser,
    ]).map(e => {
      let result = [
        {
          type: "if",
          args: logicParser(e[0][1]),
          nodes: [e[1]],
        }
      ]
      if(e[3]) result.push({
          type: "if",
          args: logicParser(e[0][1], true, false),
          nodes: e[3],
        })
      return result
    }),
    sequenceOf([
      regexA("if\\((.+?)\\)\\s+(?!(?:\\|\\|)|(?:&&))"),
      commandParser,
      newLineParser,
    ]).map(e => ({
      type: "if",
      args: logicParser(e[0][1]),
      nodes: [e[1]]
    })),
  ]))


  const generalNodeParser = lazy(() =>
    choice([
      sequenceOf([
        regexA("(\\w+)\\((.+?)\\),\\s*(?!\\|\\|)"),
        nodeParser,
      ]).map(e => ({
        type: e[0][1],
        args: simpleOrParser(e[0][2], true),
        nodes: e[1],
      })),
      sequenceOf([
        regexA("(\\w+)\\((.+?)\\)\\s+(?!\\|\\|)\\{"),
        optional(nodesParser),
        regex("\\}\\n*\\s*"),
      ]).map(e => ({
        type: e[0][1],
        args: simpleOrParser(e[0][2], true),
        nodes: e[1],
      })),
      sequenceOf([
        regexA("(\\w+)\\((.+?)\\)\\s+(?!\\|\\|)"),
        commandParser
      ]).map(e => ({
        type: e[0][1],
        args: simpleOrParser(e[0][2], true),
        nodes: e[1],
      })),
    ])
  );


  const logParser = regexA("log\\((.+?)\\)").map(e => `tellraw @a[gamemode=!survival, gamemode=!adventure] [{"text":"[Console] ","color":"dark_purple","hoverEvent":{"action":"show_text","value":[{"text":"Logged from the console"}]}},{"text":"${e[1]}","color":"reset"}]`)



  const nodeParser = sequenceOf([
    optional(whitespaceParser.map(e => {
      let length;
      if(/\r\n/.test(e)) length = e.split("\r\n").length - 2;
      const result = [];
      for(let i = 0; i < length; i++) {
        result.push({type: "newline"})
      }
      return result
    })),
    choice([
      setVarParser,
      setModalParser,
      jsParser,

      debugCommentParser,
      commandParser,
      commentParser,
      ifParser,

      generalNodeParser,

      logParser,

      useModalParser,
    ]),
    optional(manyNewLineParser.map(e => {
      let length;
      if(/\r\n/.test(e)) length = e.split("\r\n").length - 2;
      const result = [];
      for(let i = 0; i < length; i++) {
        result.push({type: "newline"})
      }
      return result
    })),
  ]).map(e => {
    const returns = [];
    if(Array.isArray(e[0]) && noWhitelines == false) returns.push(...e[0]);
    if(Array.isArray(e[1])) returns.push(...e[1]);
    else returns.push(e[1])
    if(Array.isArray(e[2]) && noWhitelines == false) returns.push(...e[2]);
    return returns
  });

  const nodesParser = many(nodeParser).map(e => {
    let result = [];
    for(let ee of e) {
      for(let eee of ee) {
        result.push(eee);
      }
    }
    return result;
  });

  const typeReturn = new Parser(parserState => {
    return Parser.updateParserResult(parserState, "mcfunction");
  });

  return sequenceOf([
    typeReturn,
    optional(manyNewLineParser),
    optional(nodesParser),
  ]);
}

},{"./parsers.js":7,"./utility.js":8}],7:[function(require,module,exports){



class Parser {
  constructor(parserStateTransformerFn) {
    this.parserStateTransformerFn = parserStateTransformerFn;
  }
  run(targetString) {
    const initialState = {
      targetString,
      index: 0,
      result: null,
      isError: false,
      error: null
    }
    return this.parserStateTransformerFn(initialState);
  }

  map(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(nextState.isError) return nextState;
      return Parser.updateParserResult(nextState, fn(nextState.result));
    })
  }
  errorMap(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(!nextState.isError) return nextState;
      return Parser.updateParserError(nextState, fn(nextState.error, nextState.index));
    });
  }

  chain(fn) {
    return new Parser(parserState => {
      const nextState = this.parserStateTransformerFn(parserState);
      if(nextState.isError) return nextState;
      const nextParser = fn(nextState.result);
      return nextParser.parserStateTransformerFn(nextState)
    });
  }

  static updateParserState(state, index, result) {
   return {
     ...state,
      index,
      result
    }
  }
  static updateParserResult(state, result) {
    return {
      ...state,
      result
  }};
  static updateParserError(state, errorMsg) {
    return {
      ...state,
      isError: true,
      error: errorMsg
  }};
}

// Start of letter parser
const letter = new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `letters: Got unexpected end of input`);
  const regexMatch = slicedTarget.match(/^[a-zA-Z]/);
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  return Parser.updateParserError(parserState, `letters: Couldn't match letters at ${index}`)
});
// End of letter parser

// Start of digit parser
const digit = new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `digits: Got unexpected end of input`);
  const regexMatch = slicedTarget.match(/^\d/);
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch[0])
  return Parser.updateParserError(parserState, `digits: Couldn't match digits at ${index}`)
});
// End of digit parser

// Start of regexA parser
const regexA = (r, f) => new Parser(parserState => {
  const {
    targetString,
    index,
    isError
  } = parserState;

  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `regex: Got unexpected end of input`);
  let regexMatch = slicedTarget.match(new RegExp('^' + r, f));
  if(regexMatch) return Parser.updateParserState(parserState, index + regexMatch[0].length, regexMatch)
  return Parser.updateParserError(parserState, `regex: Couldn't match regex "${'/' + r + '/' + (f ? f : '')}" at ${index}`)
});
// End of regexA parser
// Start of regex parser
const regex = (r, f) => regexA(r, f).map(e => e[0])
// End of regex parser

// Start of error parser
const err = new Parser(parserState => {
  parserState = parserState ? parserState : {
    targetString: '',
    index: 0,
    result: null,
    isError: false,
    error: null
  };
  return Parser.updateParserError(parserState, 'err: An error occured')
})
// End of error parser


// Start of string parser
const str = s => new Parser(parserState => {
  const {targetString, index, isError} = parserState;
  if(isError) return parserState;
  const slicedTarget = targetString.slice(index);
  if(slicedTarget.length === 0) return Parser.updateParserError(parserState, `str: Tried to match "${s}", but got unexpected end of input`)
  if(slicedTarget.startsWith(s)) {
    return Parser.updateParserState(parserState, index + s.length, s);
  }
  return Parser.updateParserError(parserState, `str: Tried to match "${s}", but got "${targetString.slice(index, index + 10)}"`);
});
// End of string parser

// Start of sequenceOf parser
const sequenceOf = parsers => new Parser(parserState => {
  if(parserState.isError) return parserState;
  const results = [];
  let nextState = parserState;

  for(let p of parsers) {
    nextState = p.parserStateTransformerFn(nextState);
    if(nextState.isError) return Parser.updateParserError(Parser.updateParserResult(nextState, results), `sequenceOf: unable to parse at index ${nextState.index}`);
    results.push(nextState.result)
  }
  return Parser.updateParserResult(nextState, results);
});
// End of sequenceOf parser

// Start of choice parser
const choice = parsers => new Parser(parserState => {
  if(parserState.isError) return parserState;
  for(let p of parsers) {
    const nextState = p.parserStateTransformerFn(parserState);
    if(!nextState.isError) return nextState;
  }
  return Parser.updateParserError(parserState, `choice: unable to match with any parser at index ${parserState.index}`)
});
// End of choice parser

// Start of many parser
const many = parser => new Parser(parserState => {
  let nextState = parserState;
  let results = []
  let done = false;
  while(!done) {
    nextState = parser.parserStateTransformerFn(nextState);
    // console.log('nextState: ', nextState);
    if(nextState.result === null) break;
    if(!nextState.isError) results.push(nextState.result);
    else {
      done = true;
    }
  }
  if(typeof(parserState.targetString) == "object") throw new Error("here")
  // if(results.length !== 0) return Parser.updateParserResult({...parserState, index: nextState.index}, results);
  if(results.length !== 0) return Parser.updateParserState(parserState, nextState.index, results);
  return Parser.updateParserError(parserState, `many: unable to match with parser at least once at index ${parserState.index}`);
});
// End of many parser

// Start of optional parser
const optional = parser => new Parser(parserState => {
  let nextState = parser.parserStateTransformerFn(parserState);
  if(nextState.isError) return Parser.updateParserResult(parserState, null)
  return nextState;
})
// End of optional parser

const lazy = parserThunk => new Parser(parserState => {
  const parser = parserThunk();
  return parser.parserStateTransformerFn(parserState);
})

// Start of combination parsers

const letters = many(letter).map(e => e.join(''));
const digits = many(digit).map(e => e.join(''));

// Start of sepBy parser
const sepBy = seperatorParser => valueParser => new Parser(parserState => {
  const results = [];
  let nextState = parserState;

  while(true) {
    const searchedForState = valueParser.parserStateTransformerFn(nextState);
    if(searchedForState.isError) break;
    results.push(searchedForState.result);
    nextState = searchedForState;

    const seperatorState = seperatorParser.parserStateTransformerFn(nextState);
    if(seperatorState.isError) break;
    nextState = seperatorState;
  }
  return Parser.updateParserResult(nextState, results)

})
// End of sepBy parser

// Start of between parser
const between = (left, right) => content => sequenceOf([left, content, right]).map(e => e[1]);
// End of between parser


// End of combination parsers


module.exports = {
  Parser,
  lazy,
  letter,
  digit,
  regex,
  regexA,
  letters,
  digits,
  err,
  str,
  sequenceOf,
  choice,
  many,
  optional,
  between,
  sepBy,
}

},{}],8:[function(require,module,exports){
const {
  Parser,
  lazy,
  letter,
  digit,
  regex,
  regexA,
  letters,
  digits,
  err,
  str,
  sequenceOf,
  choice,
  many,
  optional,
  between,
  sepBy,
} = require('./parsers.js')

const whitespaceParser = regex("\\s+");
const newLineParser = choice([str("\n"), str("\r\n")]);
const manyNewLineParser = many(newLineParser).map(e => e.join(""));


module.exports = {
  whitespaceParser: whitespaceParser,
  newLineParser: newLineParser,
  manyNewLineParser: manyNewLineParser,
}

},{"./parsers.js":7}],9:[function(require,module,exports){
const {generate} = require('./lib/index.js');

module.exports = {
  generate: generate
};

},{"./lib/index.js":11}],10:[function(require,module,exports){
module.exports = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

},{}],11:[function(require,module,exports){
const fs = require('fs');
const path = require('path');

const consoleStyles = require('./consoleStyles.js');
const nodeList = require('./nodeList.js');

module.exports.compile = (args) => {
  const inputPath = args[0] || './';

  fs.access(inputPath, err => {
    if(err) return console.log(consoleStyles.FgRed + 'Target does not exist' + consoleStyles.Reset);

    let inputFiles = [];
    let outputFiles = [];
    let count = 0;
    readDir(inputPath, () => {
      console.log(consoleStyles.FgGreen + 'Read ' + inputFiles.length + ' files\n' + consoleStyles.Reset);
      for(let file of inputFiles) {
        // const instancePath = path.join(inputPath, 'functions', path.basename(file, 'json') + 'mcfunction')
        fs.readFile(file, 'utf8', (err, raw) => {
          if(err) return console.error(err);
          let data;
          try {
            data = JSON.parse(raw);
          } catch(e) {
            return console.log(consoleStyles.FgRed + 'ERR\t\t' + consoleStyles.FgYellow + 'Invalid JSON: ' + consoleStyles.Reset + file + ' ' + e.toString().match(/(?<=Unexpected string in JSON )at position \d+/));
          }
          for(i in data) {
            const newFile = file.replace(new RegExp(path.extname(file) + '$'), '.mcfunction');
            data[i].type = data[i].type || 'mcfunction'
            if(data[i].path) {
              data[i].path = path.join(newFile.replace(new RegExp(path.basename(newFile) + '$'), ''), data[i].path)
            } else {
              data[i].path = newFile;
            }

            let fileData = generate(data[i], file);
            if(!fileData) continue;
            fs.mkdir(path.dirname(fileData.path), {recursive: true}, err => {
              if(err) return console.log(consoleStyles.FgRed + 'Error while creating folder ' + path.dirname(fileData.path) + consoleStyles.Reset);

              fs.writeFile('./' + fileData.path, fileData.content, err => {
                if(err) return console.log(consoleStyles.FgRed + 'Error while creating file:  ' + fileData.path + consoleStyles.Reset);
                console.log(consoleStyles.FgCyan + 'Generated\t\t\t' + consoleStyles.FgYellow + fileData.path + consoleStyles.Reset);
                outputFiles.push(fileData.path)
              });
            });

          }
        });
      }
    });

    function readDir(p, callback) {
      count++;
      fs.readdir(p, (err, files) => {
        if(err) return console.error(err);
        for(let file of files) {
          if(path.extname(file) == '.json') {
            inputFiles.push(path.join(p,file));
          } else if(path.extname(file) == '') {
            readDir(path.join(p, file), callback)
          }
        }
        count--
        if(count === 0) callback();
      });
    }

  });
}

module.exports.generate = generate;

function generate(data, file, options = {fullError: false}) {
  const {fullError} = options;
  if(typeof(data) != 'object' || Array.isArray(data)) {
    return console.log(consoleStyles.FgRed + 'Wrong input data' + consoleStyles.Reset);
  }
  // console.log('data: ', data);
  file = file ? file : '';
  let content = "";
  switch (data.type.toLowerCase()) {
    case "mcfunction":
      if(!/.mcfunction$/.test(data.path)) {
        data.path += '.mcfunction'
      }
      data.path = data.path.replace(/\\mcjson\\/, '\\functions\\')
      if(data.nodes) {
        if(!Array.isArray(data.nodes)) data.nodes = [data.nodes];
        for(let node of data.nodes) {
          if(typeof(node) == 'string') node = {"type": "command", "args": node};
          handleMcfunctionNodes(node, '', file);
        }
      }
      break;
    default:
      return console.log(consoleStyles.FgRed + 'Unknown file type: ' + data.type + consoleStyles.Reset);
  }

  return {
    "path": data.path,
    "content": content
  }

  function handleMcfunctionNodes(node, prefix, file) {
    prefix = prefix ? prefix : '';
    if(!node.type) return console.log('\n' + consoleStyles.FgRed + 'No Node type specified: ' + file + consoleStyles.Reset + '\n');
    const nodeType = nodeList.mcfunction.find(e => e.type == node.type.toLowerCase());
    if(nodeType) {
      if(/^(?:#|(?:\/\/))/.test(node.args) || node.type.toLowerCase() == 'newline') {
        if(/^#/.test(node.args)) content += node.args + '\n';
        if(node.type.toLowerCase() == 'newline') content += '\n'
      } else {
        if(nodeType.run) {
          const newPrefix = nodeType.run(node.args);

          if(typeof(newPrefix) == 'string') {
            if(typeof(prefix) == 'string') {
              prefix += newPrefix ? newPrefix : prefix;
              prefix = prefix;
            } else if(Array.isArray(prefix)) {
              for(let i in prefix) {
                prefix[i] += newPrefix;
              }
            }
          } else if(Array.isArray(newPrefix)) {
            if(typeof(prefix) == 'string') {
              for(let i in newPrefix) {
                newPrefix[i] = prefix + newPrefix[i];
              }
              prefix = newPrefix;
            } else if(Array.isArray(prefix)) {
              let combinedPrefix = [];
              for(let i in prefix) {
                for(let ii in newPrefix) {
                  combinedPrefix.push(prefix[i] + newPrefix[ii])
                }
              }
              prefix = combinedPrefix;
            }
          }
        }
        if(node.nodes && nodeType.last != true) {
          if(!Array.isArray(node.nodes)) node.nodes = [node.nodes];
          for(let i in node.nodes) {
            if(typeof(node.nodes[i]) == 'string') node.nodes[i] = {"type": "command", "args": node.nodes[i]};
            handleMcfunctionNodes(node.nodes[i], prefix, file);
          }
        }
        if(nodeType.last == true) {
          if(typeof(prefix) == 'string') content += (prefix + node.args + '\n').replace(/run execute /g, '');
          if(Array.isArray(prefix)) {
            content += prefix.map(e => e + node.args + '\n').join('').replace(/run execute /g, '');
          }
        }
      }
    } else {
      return console.log('\n' + consoleStyles.FgRed + 'Unknown node type: ' + node.type + consoleStyles.Reset + '\n');
    }
  }
}

},{"./consoleStyles.js":10,"./nodeList.js":12,"fs":1,"path":2}],12:[function(require,module,exports){
const consoleStyles = require('./consoleStyles.js');

module.exports = {
  mcfunction: [
    {
      type: "command",
      last: true
    },
    {
      type: "comment",
      last: true
    },
    {
      type: "newline",
      last: true
    },
    {
      type: "debugcomment"
    },
    {
      type: "as",
      run: (args) => {
        if(typeof(args) == 'string') return "execute as " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute as " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "at",
      run: (args) =>{
        if(typeof(args) == 'string') return "execute at " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute at " + args[i] + " run ")
          }
          return returns
        }}
    },
    {
      type: "asat",
      run: (args) => {
        if(typeof(args) == 'string') return "execute as " + args + " at @s run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute as " + args[i] + " at @s run ")
          }
          return returns
        }
      }
    },
    {
      type: "align",
      run: (args) => {
        if(typeof(args) == 'string') return "execute align " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute align " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "anchored",
      run: (args) => {
        if(typeof(args) == 'string') return "execute anchored " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute anchored " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "facing",
      run: (args) => {
        if(typeof(args) == 'string') return "execute facing " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute facing " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "in",
      run: (args) => {
        if(typeof(args) == 'string') return "execute in " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute in " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "positioned",
      run: (args) => {
        if(typeof(args) == 'string') return "execute positioned " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute positioned " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "rotated",
      run: (args) => {
        if(typeof(args) == 'string') return "execute rotated " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute rotated " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "store",
      run: (args) => {
        if(typeof(args) == 'string') return "execute store " + args + " run "
        if(Array.isArray(args)) {
          let returns = [];
          for(let i in args) {
            returns.push("execute store " + args[i] + " run ")
          }
          return returns
        }
      }
    },
    {
      type: "if",
      run: (args) => {
        return handleIf(args);
      }
    }
  ]
}


function handleIf(args) {
  if(typeof(args) == "string") return handleIfString(args, false);

  let results = [];

  if(typeof(args) == "object") {
    results.push(...handleIfLogic(args, false));
  }

  return results;

}

function handleIfString(str, invert = false) {
  if((/^!/.test(str) && invert == false) || (!/^!/.test(str) && invert == true)) return `execute unless ${str.replace(/^!/, '')} run `
  return `execute if ${str.replace(/^!/, '')} run `
}

function handleIfLogic(args, parentInverted = false) {
  let results = []
  args.inverted = args.inverted ? args.inverted : false;
  args.inverted = parentInverted ? !args.inverted : args.inverted;
  if(args.type.toLowerCase() == "or") {
    results.push(...handleIfOr(args.conds, args.inverted));
  }
  if(args.type.toLowerCase() == "and") {
    results.push(...handleIfAnd(args.conds, args.inverted));
  }
  return results;
}

function handleIfOr(conds, invert = false) {
  let results = [];

  for(let cond of conds) {
    if(typeof(cond) == "string") results.push(handleIfString(cond, invert))
    else if(typeof(cond) == "object") results.push(...handleIfLogic(cond, invert))
  }

  return results;
}
function handleIfAnd(conds, invert = false) {
  let results = [""];

  for(let cond of conds) {
    if(typeof(cond) == "string") results = results.map(e => e + handleIfString(cond, invert))
    else if(typeof(cond) == "object")  {
      let returned = handleIfLogic(cond, invert);
      let returns = [];
      for(let i in results) {
        for(let ii in returned) {
          returns.push(results[i] + returned[ii])
        }
      }
      results = returns;
    }
  }
  return results;
}

},{"./consoleStyles.js":10}],13:[function(require,module,exports){
const compile = require('./import/mccode/compileOnline.js');

const editor = ace.edit("editor");
const cbSaveLocal = document.querySelector('#cbSaveLocal');
const cbAutoCompile = document.querySelector('#cbAutoCompile');
const slcTheme = document.querySelector('#slcTheme');
const numFontSize = document.querySelector('#spFontSize input');

const btnCompile = document.querySelector('#btnCompile');
const inputFileDisplay = document.querySelector('#inputFile');
let outputFilesContainer = document.querySelector('#outputFiles');
let outputFileDisplays = [];

let inputFile = "";
const outputFiles = {};
let saveLocal = JSON.parse(localStorage.getItem('mccode-saveLocal'));
saveLocal = saveLocal == null ? true : saveLocal;
let editorInput = true;
let autoCompile = JSON.parse(localStorage.getItem('mccode-autoCompile'));
autoCompile = autoCompile == null ? false : autoCompile;
if(autoCompile) setTimeout(clickCompile, 100);

let fontSize = JSON.parse(localStorage.getItem('mccode-fontSize'));
fontSize = fontSize == null ? 12 : fontSize;
numFontSize.value = fontSize;
document.querySelector('#editor').style["font-size"] = fontSize + "px";

editor.setShowPrintMargin(false);
editor.setBehavioursEnabled(true);
editor.session.setUseSoftTabs(false);
editor.session.setMode("ace/mode/mccode");

if(!localStorage.getItem('mccode-saveLocal')) localStorage.setItem('mccode-saveLocal', "true")
else cbSaveLocal.checked = saveLocal;

if(!localStorage.getItem('mccode-autoCompile')) localStorage.setItem('mccode-autoCompile', "false")
else cbAutoCompile.checked = JSON.parse(localStorage.getItem('mccode-autoCompile'));

if(!localStorage.getItem('mccode-theme')) localStorage.setItem('mccode-theme', "monokai")
editor.setTheme("ace/theme/" + localStorage.getItem('mccode-theme'));

if(localStorage.getItem('mccode-saved') && saveLocal) {
  const savedValue = localStorage.getItem('mccode-saved');
  editor.session.setValue(savedValue);
  inputFile = savedValue;
}



cbSaveLocal.addEventListener('change', () => {
  localStorage.setItem('mccode-saveLocal', JSON.stringify(cbSaveLocal.checked));
  saveLocal = cbSaveLocal.checked;
});
cbAutoCompile.addEventListener('change', () => {
  localStorage.setItem('mccode-autoCompile', JSON.stringify(cbAutoCompile.checked));
  autoCompile = cbAutoCompile.checked;
});
slcTheme.addEventListener('change', () => {
  editor.setTheme("ace/theme/" + slcTheme.value);
});

editor.addEventListener('change', () => {
  const editorValue = editor.session.getValue();
  if(editorInput) inputFile = editorValue;
  if(saveLocal && editorInput) {
    localStorage.setItem('mccode-saved', editorValue);
  }
  if(autoCompile && editorInput) {
    clickCompile();
  }
});

numFontSize.addEventListener('change', () => {
  document.querySelector('#editor').style["font-size"] = numFontSize.value + "px";
  localStorage.setItem('mccode-fontSize', numFontSize.value.toString());
})

btnCompile.addEventListener('click', clickCompile);

inputFileDisplay.addEventListener('click', (e) => {
  if(!inputFileDisplay.classList.contains('active')) {
    editor.setReadOnly(false);
    editor.session.setMode("ace/mode/mccode");
    let activeDoc = document.querySelector('#outputFiles span.active');
    outputFiles[activeDoc.innerText] = editor.session.getValue();
    activeDoc.classList.remove('active');
    inputFileDisplay.classList.add('active');
    editor.session.setValue(inputFile);
    editorInput = true;
  }
});

function clickCompile() {

  let files = compile(inputFile);
  outputFilesContainer.innerHTML = "";
  for(let i in files) {
    const e = document.createElement('span');
    e.innerText = files[i].path;
    if(!Array.from(outputFilesContainer.children).some(ee => ee.innerText == files[i].path)) outputFilesContainer.appendChild(e);
    outputFiles[files[i].path] = files[i].content;
  }

  outputFileDisplays = document.querySelectorAll('#outputFiles span');

  for(let outputFileDisplay of outputFileDisplays) {
    outputFileDisplay.addEventListener('click', () => {
      editorInput = false;
      if(!outputFileDisplay.classList.contains('active')) {
        editor.setReadOnly(true);
        editor.session.setMode("ace/mode/mcfunction");
        let activeDoc = document.querySelector('#outputFiles span.active') || document.querySelector('#inputFile.active');
        if(activeDoc.id == "inputFile") {
          inputFile = editor.session.getValue();
        } else {
          outputFiles[activeDoc.innerText] = editor.session.getValue();
        }
        activeDoc.classList.remove('active');
        outputFileDisplay.classList.add('active');
        editor.session.setValue(outputFiles[outputFileDisplay.innerText] || "");
      }
    });
  }

}

},{"./import/mccode/compileOnline.js":4}]},{},[13]);
