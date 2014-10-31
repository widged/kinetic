define(function(require, exports, module) {

	var BrowserTransforms = require('BrowserTransforms');

	var Class = function ScrollIndicator(node) {

		var instance = this;
		var xform        = BrowserTransforms.getPrefix();
		var indicatorH   = parseInt(getComputedStyle(node).height, 10);
		var indicatorMax = parseInt(getComputedStyle(node.parentNode).height, 10);

		node.style.top = 0 + 'px';

		instance.update = function(y, min, max) {
			var relative = indicatorMax / max;
			var pos = (y * relative) - (y * indicatorH / max);
			node.style[xform] = 'translateY(' + pos + 'px)';
		};

	};
	return Class;
});

