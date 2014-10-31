(function(window) {

	window.require = function(name) {
		return window[name];
	};

	window.define = function(closure) {
		var fn = closure(window.require);
		window[fn.name] = fn;
	};


}(window));

