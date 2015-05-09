import _ from 'lodash'

let thus = (config) =>
	_.isFunction(config) 
		?  	function(...args) {
				return config.apply(null, [this].concat(args));
			}
	: _.isObject(config)
		? 	_.object(_.map(config, (propValue, propName) => [ propName, thus(propValue)] ))
	//default
		: config

export default thus
