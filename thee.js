//For documentation see the thee.js README file

const callFn = (fn) => function(...args) {
	return fn.apply(null, [this].concat(args));
}

let _thee = (val, thisCheck) =>
	isFunction(val) 
		?  	thisCheck(val) || callFn(val)
		: 	val

let thee = (config, op) => {
	op || (op = {});
	op.noThisCheck !== undefined || (op.noThisCheck = thee.noThisCheck);
	let thisCheck = op.noThisCheck ? noop : checkForThisUsageWithToString; 

	return (
		  isObject(config)
			? 	objectMap(config, (propValue, propName) => [ propName, _thee(propValue, thisCheck)] )
			: 	_thee(config, thisCheck)
	);
}
thee.noThisCheck = false;

export default thee

////////////////////////////////////////////////////////////


function isObject(value) {
	return (!!value && typeof value == 'object');
}
function isFunction(value) {
	return typeof value == 'function';
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
	console.error && console.error(fn.toString());
	throw("Detected usage of `this` in function. Thee rewires the `this` parameter in functions so referencing it won't work as intended. Instead the `this` value will be passed into your function as the first paramter. All other parameters will be shifted over. To disable this check pass { noThisCheck: true }  as a second parameter to thee"); 
}
