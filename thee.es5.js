'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var thee = function thee(config) {
	return isFunction(config) ? function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return config.apply(null, [this].concat(args));
	} : isObject(config) ? objectMap(config, function (propValue, propName) {
		return [propName, thee(propValue)];
	})
	//default
	: config;
};

exports['default'] = thee;

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
module.exports = exports['default'];
