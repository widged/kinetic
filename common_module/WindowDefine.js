(function(window) {

	window.define = function(closure) {
		var fn = closure();
		window[fn.name] = fn;
	};

}(window));

