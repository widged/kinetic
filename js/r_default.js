(function(window) {

	var Class = function KineticDefault(config) {

		var instance = this;

		if(!config) { config = {}; }

		var view, indicator,
			relative, max, min;
		var xform;

		instance.config = function(_) {
			if(arguments.length === 0) { return config; }
			return instance;
		};

		instance.embedIn = function(node) {
			view      = node.querySelector('.view');
			indicator = node.querySelector('.indicator');
		};

		instance.ready = function(kinetic, asyncReturn) {
			kinetic.config(config);

			xform = kinetic.getBrowserTransforms(view);
			kinetic.setupEvents(view);

			var offset = 0;
			var index = 0;

			var hrel = config.hRelative || 30;
			min = 0; // </1,2> whenIndicator
			max = parseInt(getComputedStyle(view).height, 10) - window.innerHeight;  // </1,2> whenIndicator
			relative = (window.innerHeight - hrel) / max;

			asyncReturn(offset);
		};

		instance.display = function(y) {
			return instance.scroll(y);
		};

 
		instance.scroll = function(y) {
			y = (y > max) ? max : (y < min) ? min : y;
			view.style[xform] = 'translateY(' + (-y) + 'px)';
			// <1,2>
			if(indicator) {
				indicator.style[xform] = 'translateY(' + (y * relative) + 'px)';
			}
			// </1,2>
			return y;
		};

		return instance;
	};

	window.KineticDefault = Class;

}(window));
