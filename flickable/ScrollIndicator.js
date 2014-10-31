define(function(require, exports, module) {

	var Class = function ScrollIndicator(node, dom, indicatorMax, xform) {

		var instance = this;
		var indicatorH = 20;

		node.style.top = 0 + 'px';

		instance.update = function(y, min, max) {
			var relative = indicatorMax / max;
			var pos = (y * relative) - (y * indicatorH / max);
			node.style[xform] = 'translateY(' + pos + 'px)';
		};

	};
	return Class;
});

