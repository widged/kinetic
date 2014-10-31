(function(window) {

	var Class = function Kinetic(settings) {

		var instance = this;
		var amplitude, velocity;

		var defaults = {
			amplitudeFactor : 0.8, // <4> 1.2, <5> 0.9
			velocityTrigger : 10,
			trackD			: 1000,
			trackV			: 0.8,
			trackZ			: 0.2
		};

		var config = parseConfig(settings);

		instance.reset = function() {
			velocity = amplitude = 0;
		};

		instance.release = function() {
			var out = 0;
			if (velocity > config.velocityTrigger || velocity < -config.velocityTrigger) {
				amplitude = config.amplitudeFactor * velocity;
				out = amplitude;
			}
			return out;
		};

		instance.track = function(ratio) {
			var v = config.trackD * ratio;
			velocity = config.trackV * v + config.trackZ * velocity;
		};

		instance.amplitude = function(_) {
			if(!arguments.length) { return amplitude; }
			amplitude = _;
			return instance;
		};

		function parseConfig(settings) {
			var config = {};
			Object.keys(defaults).forEach(function(key) {
				config[key] = (settings && settings.hasOwnProperty(key)) ? settings[key] : defaults[key];
			});
			return config;
		}

		return instance;
	}

	
	window.Kinetic = Class;



}(window));

