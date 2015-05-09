import _ from 'lodash'

let thus = (config) =>
	_.isFunction(config) 
		?  	function(...args) {
				return propValue.apply(null, [this].concat(args));
			}
	: _.isObject(config)
		? 	_.object(_.map(config, (propValue, propName) =>
				[ propName, _.isFunction(propValue) ? thus(propValue) : propValue ]
			))
	//default
		: config

export default thus
