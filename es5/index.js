(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports.parse = __webpack_require__(1).parse;
module.exports.match = __webpack_require__(2).match;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var NOT_OPTOR_DEFAULT = 'NOT';
var AND_OPTOR_DEFAULT = 'AND';
var OR_OPTOR_DEFAULT = 'OR';
var NOT_OPTOR = 'NOT';
var AND_OPTOR = 'AND';
var OR_OPTOR = 'OR'; // return length of whitespace

function whitespace(str) {
  if (str.length === 0) {
    return 0;
  }

  for (var i = 0; i < str.length; i++) {
    if (!isSpace(str[i])) {
      return i;
    }
  }

  return str.length - 1;
}

function hasPrefix(str, prefix) {
  if (str.length < prefix.length) {
    return false;
  }

  if (str.length === prefix.length) {
    return str === prefix;
  }

  return str.slice(0, prefix.length) === prefix;
}

function tryParseText(str) {
  var result = '';

  for (var i = 0; i < str.length; i++) {
    if (!isSpace(str[i]) && str[i] !== '(' && str[i] !== ')') {
      result += str[i];
    } else {
      break;
    }
  }

  switch (result) {
    case NOT_OPTOR:
    case AND_OPTOR:
    case OR_OPTOR:
    case '':
      return null;

    default:
      return result;
  }
}

function tryParseBinaryOperator(str) {
  if (hasPrefix(str, AND_OPTOR + ' ')) {
    var result = makeBinaryOperator(AND_OPTOR_DEFAULT);
    result.length = AND_OPTOR.length;
    return result;
  } else if (hasPrefix(str, OR_OPTOR + ' ')) {
    var _result = makeBinaryOperator(OR_OPTOR_DEFAULT);

    _result.length = OR_OPTOR.length;
    return _result;
  } else {
    return null;
  }
}

function tryParseExpression(str) {
  if (str === '') {
    return null;
  }

  var offset = whitespace(str);

  if (offset === str.length - 1 && str.length > 1) {
    return null;
  }

  str = str.slice(offset);
  var expression;

  if (str[0] === '(') {
    offset++;
    str = str.slice(1);
    expression = tryParseExpression(str);

    if (!expression) {
      return null;
    }

    str = str.slice(0 + expression.length);

    if (str === '') {
      return null;
    }

    var wsAfter = whitespace(str);

    if (wsAfter === str.length && wsAfter > 0) {
      return null;
    }

    if (str[wsAfter] !== ')') {
      return null;
    }

    expression.parens = true;
    expression.length = offset + expression.length + wsAfter + 1;
    str = str.slice(1); //убираем ')'
  } else if (hasPrefix(str, NOT_OPTOR)) {
    offset += NOT_OPTOR.length;
    str = str.slice(NOT_OPTOR.length);

    var _wsAfter = whitespace(str);

    if (_wsAfter === 0) {
      // после NOT должен идти минимум 1 пробел
      return null;
    }

    offset += _wsAfter;
    str = str.slice(_wsAfter);
    var childExpression = tryParseExpression(str);

    if (!childExpression) {
      return null;
    }

    expression = makeExpression(null, childExpression, notOperator());
    expression.length = offset + childExpression.length;
  } else {
    var text = tryParseText(str);

    if (text === null) {
      return null;
    }

    str = str.slice(text.length);
    expression = makeExpression(null, makeText(text), null);
    expression.length = offset + text.length;
  }

  var ws1 = whitespace(str);
  offset += ws1;
  str = str.slice(ws1);
  var binaryOperator = tryParseBinaryOperator(str);

  if (binaryOperator === null) {
    return expression;
  }

  str = str.slice(binaryOperator.length);
  var ws2 = whitespace(str);
  offset += ws2;
  str = str.slice(ws2);
  var nextExpression = tryParseExpression(str);

  if (nextExpression === null) {
    return null;
  }

  var resultExpression = makeExpression(expression, nextExpression, binaryOperator);
  resultExpression.length = ws1 + ws2 + expression.length + nextExpression.length + binaryOperator.length;
  return resultExpression;
}

module.exports.parse = function (str, options) {
  str = '' + str;
  var opts = options || {};
  AND_OPTOR = opts.and || AND_OPTOR_DEFAULT;
  OR_OPTOR = opts.or || OR_OPTOR_DEFAULT;
  NOT_OPTOR = opts.not || NOT_OPTOR_DEFAULT;
  return tryParseExpression(str);
};

function isSpace(char) {
  switch (char) {
    case ' ':
    case '\t':
    case '\n':
    case '\b':
    case '\f':
    case '\r':
    case '\v':
      return true;
  }

  return false;
}

function makeText(val) {
  return {
    type: 'text',
    val: val
  };
}

function notOperator() {
  return {
    type: 'not-operator'
  };
}

function makeBinaryOperator(kind) {
  return {
    type: 'binary-operator',
    kind: kind
  };
}

function makeExpression(left, right, operator) {
  return {
    type: 'expression',
    right: right,
    left: left,
    operator: operator
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function match(node, string) {
  if (node.type === 'text') {
    return string.indexOf(node.val.toLowerCase()) !== -1;
  }

  if (node.operator === null) {
    return match(node.right, string);
  }

  if (node.operator.type === 'not-operator') {
    return !match(node.right, string);
  }

  if (node.operator.kind === 'AND') {
    return match(node.left, string) && match(node.right, string);
  } else if (node.operator.kind === 'OR') {
    return match(node.right, string) || match(node.left, string);
  }

  throw new Error('cannot match ' + JSON.stringify(node));
}

module.exports.match = function (node, string) {
  if (!node) {
    return true;
  }

  string = (string + '').toLocaleLowerCase();
  return match(node, string);
};

/***/ })
/******/ ])));