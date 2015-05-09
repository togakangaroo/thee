'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
//For documentation see the thee.js README file

var callFn = function callFn(fn) {
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return fn.apply(null, [this].concat(args));
	};
};

var thee = function thee(config, op) {
	op || (op = {});
	op.noThisCheck !== undefined || (op.noThisCheck = thee.noThisCheck);
	var thisCheck = op.noThisCheck ? noop : checkForThisUsageWithToString;

	return isFunction(config) ? thisCheck(config) || callFn(config) : isObject(config) ? objectMap(config, function (propValue, propName) {
		return [propName, thee(propValue)];
	})
	//default
	: config;
};
thee.noThisCheck = false;

exports['default'] = thee;

////////////////////////////////////////////////////////////

// is* functions just flat out ripped from lodash

function isObject(value) {
	var type = typeof value;
	return type == 'function' || !!value && type == 'object';
}
function isFunction(value) {
	return typeof value == 'function' || false;
}

function map(obj, fn) {
	var acc = [];
	for (var propName in obj) {
		if (obj.hasOwnProperty(propName)) acc.push(fn.call(null, obj[propName], propName));
	}return acc;
}

function object(propNameVals) {
	var obj = {};
	for (var i in propNameVals) {
		obj[propNameVals[i][0]] = propNameVals[i][1];
	}return obj;
}

function objectMap(obj, fn) {
	var res = {};
	for (var propName in obj) {
		if (obj.hasOwnProperty(propName)) {
			var propNameVals = fn(obj[propName], propName);
			res[propNameVals[0]] = propNameVals[1];
		}
	}return res;
}

function noop() {}
function checkForThisUsageWithToString(fn) {
	if (!/\Wthis\W/.test(fn.toString())) return;
	throw 'Detected usage of `this` in function. Thee rewires the `this` parameter in functions so referencing it won\'t work as intended. Instead the `this` value will be passed into your function as the first paramter. All other parameters will be shifted over. To disable this check pass { noThisCheck: true }  as a second parameter to thee';
}
module.exports = exports['default'];
