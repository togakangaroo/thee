import _ from 'lodash'

let thee = (config) =>
	_.isFunction(config) 
		?  	function(...args) {
				return config.apply(null, [this].concat(args));
			}
	: _.isObject(config)
		? 	_.object(_.map(config, (propValue, propName) => [ propName, thee(propValue)] ))
	//default
		: config

export default thee
