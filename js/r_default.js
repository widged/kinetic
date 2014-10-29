(function(window) {

	var Class = function KineticDefault(config) {

		var instance = this;

		if(!config) { config = {}; }

		var view, indicator, overlay,
			relative, count, max, min, snap;
		var xform;
		var COUNT = 143;

		instance.config = function(_) {
			if(arguments.length === 0) { return config; }
			return instance;
		};

		instance.view = function(_) {
			view = _;
			whenViewChange();
			return instance;
		};

		instance.indicator = function(_) {
			indicator = _;
			return instance;
		};

		instance.overlay = function(_) {
			overlay = _;
			whenOverlayChange();
			return instance;
		};


		instance.ready = function(kinetic, asyncReturn) {
			kinetic.config(config);

			xform = kinetic.getBrowserTransforms(view);
			kinetic.setupEvents(view);

			var offset = 0;
			var index = 0;

			// <3>
			if(overlay) {
				count = COUNT;
				max = (count - 5) * snap;
			}
			// </3>

			asyncReturn(offset, snap, index);
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

		function whenViewChange() {
			var hrel = config.hRelative || 30;
			min = 0; // </1,2> whenIndicator
			max = parseInt(getComputedStyle(view).height, 10) - window.innerHeight;  // </1,2> whenIndicator
			relative = (window.innerHeight - hrel) / max;
		}

		function whenOverlayChange() {
			// <3>
			if(overlay) {
				snap = parseInt(getComputedStyle(document.getElementById('row')).height, 10);
				overlay.style.top = (4 * snap) + 'px';
			}
			// </3>
		}

		return instance;
	};

	window.KineticDefault = Class;

}(window));
