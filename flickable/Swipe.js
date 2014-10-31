(function(window) {

	var defaults = {
		tickerInterval	: 100,
		dragTrigger		: 2,
		scrollTrigger	: 5, // <4> 10, <5> 4
		timeConstant	: 325, // ms	// <2,3> 
		isHorizontal	: false,
		isKeyEnabled	: false
	};

	var Class = function Swipe(settings) {

		var instance = this;

		var renderer;

		var offset, kinetic,
			pressed, reference, target,
			frame, timestamp, ticker;

		instance.getBrowserTransforms = getBrowserTransforms;

		var config = parseConfig(settings);

		instance.renderer = function(_) {
			renderer = _;
			renderer.ready(instance, whenRendererReady);
			return instance;
		};

		instance.kinetic = function(_) {
			kinetic = _;
			return instance;
		};

		instance.setupEvents = function(view) {
			setupEvents(view, tap, drag, release, handleKey);
		};

		instance.config = function(settings) {
			config = parseConfig(settings);
		};

		function parseConfig(settings) {
			var config = {};
			Object.keys(defaults).forEach(function(key) {
				config[key] = (settings && settings.hasOwnProperty(key)) ? settings[key] : defaults[key];
			});
			return config;
		}

		function whenRendererReady(_offset) {
			// config = _config;
			pressed = false;
			offset  = _offset;
		}

		function display(i, _offset) {
			offset = renderer.display(i);
		}

		function scroll(x) {
			offset = renderer.scroll(x);
		}

		function getPos(e) {
			return config.isHorizontal ? posx(e) : posy(e);
		}

		function posy(e) {
			// touch event
			if (e.targetTouches && (e.targetTouches.length >= 1)) {
				return e.targetTouches[0].clientY;
			}
			// mouse event
			return e.clientY;
		}

		function posx(e) {
			// touch event
			if (e.targetTouches && (e.targetTouches.length >= 1)) {
				return e.targetTouches[0].clientX;
			}
			// mouse event
			return e.clientX;
		}

		function kineticTap() {
			if(!kinetic) { return; }
			kinetic.reset();
			frame = offset;
			timestamp = Date.now();
			clearInterval(ticker);
			ticker = setInterval(track, config.tickerInterval);
		}


		function tap(e) {
			pressed = true;
			reference = getPos(e);
			kineticTap();
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		function drag(e) {
			var pos, delta;
			if (pressed) {
				pos = getPos(e);
				delta = reference - pos;
				if (delta > config.dragTrigger || delta < -config.dragTrigger) {
					reference = pos;
					scroll(offset + delta);
				}
			}
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		function release(e) {
			pressed = false;

			var hasSnap = renderer.hasOwnProperty('snap') ? true : false;
			clearInterval(ticker);
			if(!kinetic) {
				target = offset;
			} else {
				diff = kinetic.release();
				target = Math.round(offset + diff);
			}
			if(hasSnap) {
				target = renderer.snap(target);
				if(kinetic) { kinetic.amplitude(target - offset); }
			}
			
			timestamp = Date.now();
			requestAnimationFrame(autoScroll);
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		function track() {
			var now, elapsed, delta, v;

			now = Date.now();
			elapsed = now - timestamp;
			timestamp = now;
			delta = offset - frame;
			frame = offset;

			if(kinetic) { kinetic.track(delta / (1 + elapsed)); }
		}


		function autoScroll() {
			var elapsed, delta;

			var amplitude = kinetic ? kinetic.amplitude() : undefined;
			if (amplitude) {
				elapsed = Date.now() - timestamp;
				delta = amplitude * Math.exp(-elapsed / config.timeConstant);
				if (delta > config.scrollTrigger || delta < -config.scrollTrigger) {
					scroll(target - delta);
					requestAnimationFrame(autoScroll);
				} else {
					display(target, offset);
				}
			}
		}

		function handleKey(e) {
			if(!config.isKeyEnabled) { return; }

			if (!pressed && (target === offset)) {
				// Space or PageDown or RightArrow or DownArrow
				if ([32, 34, 39, 40].indexOf(e.which) >= 0) {
					target = offset + snap;
				}
				// PageUp or LeftArrow or UpArrow
				if ([33, 37, 38].indexOf(e.which) >= 0) {
					target = offset - snap;
				}
				if (offset !== target) {
					if(kinetic) { kinetic.amplitude(target - offset); }
					timestamp = Date.now();
					requestAnimationFrame(autoScroll);
					return true;
				}
			}
		}



		return instance;
	};

	function setupEvents(view, onTap, onDrag, onRelease, onHandleKey) {
		if (typeof window.ontouchstart !== 'undefined') {
			view.addEventListener('touchstart', onTap);
			view.addEventListener('touchmove', onDrag);
			view.addEventListener('touchend', release);
		}
		view.addEventListener('mousedown', onTap);
		view.addEventListener('mousemove', onDrag);
		view.addEventListener('mouseup', onRelease);

		if(onHandleKey) { document.addEventListener('keydown', onHandleKey); }
	}

	function getBrowserTransforms(view) {
		var browserPrefixes  = ['webkit', 'Moz', 'O', 'ms'];
		var out = 'transform';
		browserPrefixes.every(function (prefix) {
			var e = prefix + 'Transform';
			if (typeof view.style[e] !== 'undefined') {
				out = e;
				return false;
			}
			return true;
		});
		return out;
	}

	window.Swipe = Class;

}(window));

