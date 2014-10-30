(function(window) {

	var defaults = {
		amplitudeFactor: 1.2,
		scrollTrigger: 10,
		isHorizontal: true,
		isKeyEnabled: true,
		timeConstant: 250
	};

	var Class = function KineticCoverflow(config) {

		var instance = this;

		var xform, view, snap;
		var nodes, index, images, count = 10;
		var angle, dist, shift;

		function init() {
			if(!config) { config = {}; }

			// nodes  = config.nodes;

			Object.keys(defaults).forEach(function(key) {
				if(!config.hasOwnProperty(key)) { config[key] = defaults[key]; }
			});
		}

		instance.view = function(_) {
			view = _;
			return instance;
		};

		instance.ready = function(kinetic, asyncReturn) {
			kinetic.config(config);

			xform = kinetic.getBrowserTransforms(view);
			kinetic.setupEvents(view);


			Object.keys(defaults).forEach(function(key) {
				if(!config.hasOwnProperty(key)) { config[key] = defaults[key]; }
			});

			window.onresize = instance.scroll;

			offset = 0;
			snap = 200;
			target = 0;
			angle = -60;
			dist = -150;
			shift = 10;
			count = 9;
			images = [];
			while (images.length < count) {
				images.push(document.getElementById(images.length));
			}

			instance.scroll(offset);

			asyncReturn(offset, snap, index);

		};

		instance.display = function(y) {
			return instance.scroll(y);
		};


		instance.scroll = function(x) {

			var i, half, delta, dir, tween, el, alignment;

			offset = (typeof x === 'number') ? x : offset;
			center = Math.floor((offset + snap / 2) / snap);
			delta = offset - center * snap;
			dir = (delta < 0) ? 1 : -1;
			tween = -dir * delta * 2 / snap;

			alignment = 'translateX(' + (window.innerWidth - snap) / 2 + 'px) ';
			alignment += 'translateY(' + (window.innerHeight - snap) / 2 + 'px)';

			// center
			el = images[wrap(center)];
			el.style[xform] = alignment +
				' translateX(' + (-delta / 2) + 'px)' +
				' translateX(' + (dir * shift * tween) + 'px)' +
				' translateZ(' + (dist * tween) + 'px)' +
				' rotateY(' + (dir * angle * tween) + 'deg)';
			el.style.zIndex = 0;
			el.style.opacity = 1;

			half = count >> 1;
			for (i = 1; i <= half; ++i) {
				// right side
				el = images[wrap(center + i)];
				el.style[xform] = alignment +
					' translateX(' + (shift + (snap * i - delta) / 2) + 'px)' +
					' translateZ(' + dist + 'px)' +
					' rotateY(' + angle + 'deg)';
				el.style.zIndex = -i;
				el.style.opacity = (i === half && delta < 0) ? 1 - tween : 1;

				// left side
				el = images[wrap(center - i)];
				el.style[xform] = alignment +
					' translateX(' + (-shift + (-snap * i - delta) / 2) + 'px)' +
					' translateZ(' + dist + 'px)' +
					' rotateY(' + -angle + 'deg)';
				el.style.zIndex = -i;
				el.style.opacity = (i === half && delta > 0) ? 1 - tween : 1;
			}

			// center
			el = images[wrap(center)];
			el.style[xform] = alignment +
				' translateX(' + (-delta / 2) + 'px)' +
				' translateX(' + (dir * shift * tween) + 'px)' +
				' translateZ(' + (dist * tween) + 'px)' +
				' rotateY(' + (dir * angle * tween) + 'deg)';
			el.style.zIndex = 0;
			el.style.opacity = 1;

			return x;
		};

		instance.snap = function(target) {
			return Math.round(target / snap) * snap;
		};


		function wrap(x) {
			return (x >= count) ? (x % count) : (x < 0) ? wrap(count + (x % count)) : x;
		}

		
		init();

		return instance;
	};

	window.KineticCoverflow = Class;

}(window));
