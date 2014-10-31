define(function(require, exports, module) {

	var Class = function BrowserTransforms() { };

	Class.getPrefix = function() {
		var node = document.body;
		var browserPrefixes  = ['webkit', 'Moz', 'O', 'ms'];
		var out = 'transform';
		browserPrefixes.every(function (prefix) {
			var e = prefix + 'Transform';
			if (typeof node.style[e] !== 'undefined') {
				out = e;
				return false;
			}
			return true;
		});
		return out;
	};


	return Class;

});