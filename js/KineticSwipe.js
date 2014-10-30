(function(window) {

	var defaults = {
		tickerInterval	: 100,
		dragTrigger		: 2,
		amplitudeFactor  : 0.8, // <4> 1.2, <5> 0.9
		velocityTrigger  : 10,
		scrollTrigger	 : 5, // <4> 10, <5> 4
		isHorizontal	  : false,
		isPhotoSwipe	  : false,
		isKeyEnabled	  : false,
		timeConstant	  : 325, // ms	// <2,3> 
		trackD			  : 1000,
		trackV			  : 0.8,
		trackZ			  : 0.2,
	};

	var Class = function Kinetic() {

		var instance = this;

		var renderer, config;

		var offset,
			pressed, reference, amplitude, target, velocity,
			frame, timestamp, ticker;

		instance.getBrowserTransforms = getBrowserTransforms;

		instance.config = function(_) {
			config = _ || {};
			Object.keys(defaults).forEach(function(key) {
				if(!config.hasOwnProperty(key)) { config[key] = defaults[key]; }
			});
		};

		instance.renderer = function(_) {
			renderer = _;
			renderer.ready(instance, whenRendererReady);
			return instance;
		};

		instance.setupEvents = function(view) {
			setupEvents(view, tap, drag, release, handleKey);
		};

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

		// 1, 2, 3
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


		// 1, 2+, 3+, 4+, 5+
		function tap(e) {
			pressed = true;
			reference = getPos(e);

			// <2,3,4,5>
			velocity = amplitude = 0;
			frame = offset;
			timestamp = Date.now();
			clearInterval(ticker);
			ticker = setInterval(track, config.tickerInterval);
			// </2,3,4,5>

			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		// 1, 2, 3, 4, 5
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

		// 1, 2+, 3++
		function release(e) {
			pressed = false;

			// <3,4,5>
			target = offset;
			// </3,4,5>

			var hasSnap = renderer.hasOwnProperty('snap') ? true : false;

			// <2,3,4>
			clearInterval(ticker);
			if (velocity > config.velocityTrigger || velocity < -config.velocityTrigger) {
				amplitude = config.amplitudeFactor * velocity;
				target = Math.round(offset + amplitude);
				if(!hasSnap) {
					timestamp = Date.now();
					requestAnimationFrame(autoScroll);
				}
			}
			// </2,3,4>
			if(hasSnap) {
				target = renderer.snap(target);
				amplitude = target - offset;
				timestamp = Date.now();
				requestAnimationFrame(autoScroll);
			}

			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		// 2, 3, 4, 5
		function track() {
			var now, elapsed, delta, v;

			now = Date.now();
			elapsed = now - timestamp;
			timestamp = now;
			delta = offset - frame;
			frame = offset;

			v = config.trackD * delta / (1 + elapsed);
			velocity = config.trackV * v + config.trackZ * velocity;
		}


		// 2, 3, 4, 5
		function autoScroll() {
			var elapsed, delta;

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

		// 5
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
					amplitude = target - offset;
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

	window.Kinetic = Class;



}(window));

