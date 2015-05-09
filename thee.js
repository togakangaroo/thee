let thee = (config) =>
	isFunction(config) 
		?  	function(...args) {
				return config.apply(null, [this].concat(args));
			}
	: isObject(config)
		? 	objectMap(config, (propValue, propName) => [ propName, thee(propValue)] )
	//default
		: config

export default thee

// is* functions just flat out ripped from lodash

function isObject(value) {
	var type = typeof value;
	return type == 'function' || (!!value && type == 'object');
}
function isFunction(value) {
	return typeof value == 'function' || false;
}

function map(obj, fn) {
	const acc = [];
	for(let propName in obj)
		if(obj.hasOwnProperty(propName))
			acc.push(fn.call(null, obj[propName], propName));
	return acc;
}

function object(propNameVals) {
	const obj = {};
	for(let i in propNameVals)
		obj[propNameVals[i][0]] = propNameVals[i][1];
	return obj;
}

function objectMap(obj, fn) {
	const res = {};
	for(let propName in obj)
		if(obj.hasOwnProperty(propName)) {
			let propNameVals = fn(obj[propName], propName);
			res[propNameVals[0]] = propNameVals[1];
		}
	return res;
}

