(function(window) {

	var Class = function KineticDefault(hRelative, isKinetic) {

		var instance = this;

		var view, indicator,
			relative, max, min;
		var xform;

		instance.embedIn = function(node) {
			view      = node.querySelector('.view');
			indicator = node.querySelector('.indicator');
		};

		instance.ready = function(swipe, asyncReturn) {
			swipe.config({});
			if(isKinetic) { swipe.kinetic(new Kinetic({})); }

			xform = swipe.getBrowserTransforms(view);
			swipe.setupEvents(view);

			var offset = 0;
			var index = 0;

			var hrel = hRelative || 30;
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
