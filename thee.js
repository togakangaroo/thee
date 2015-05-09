const callFn = (fn) => function(...args) {
	return fn.apply(null, [this].concat(args));
}
let thee = (config, op) => {
	op || (op = {});
	let thisCheck = (op.noThisCheck || thee.noThisCheck) ? noop : checkForThisUsageWithToString; 
	return (
		isFunction(config) 
			?  	thisCheck(config) || callFn(config)
		: isObject(config)
			? 	objectMap(config, (propValue, propName) => [ propName, thee(propValue)] )
		//default
			: config
	);
}
thee.noThisCheck = false;
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

function noop() {}
function checkForThisUsageWithToString(fn) {
	if(!/\Wthis\W/.test(fn.toString()))
		return;
	throw("Detected usage of `this` in function. Thee rewires the `this` parameter in functions so referencing it won't work as intended. Instead the `this` value will be passed into your function as the first paramter. All other parameters will be shifted over. To disable this check pass { noThisCheck: true }  as a second parameter to thee"); 
}
