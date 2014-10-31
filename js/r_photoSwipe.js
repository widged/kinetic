(function(window) {

	var settings = {
		kinetic: {
			amplitudeFactor: 1.2,
		},
		swipe : {
			scrollTrigger: 10,
			isHorizontal: true,
			timeConstant: 125
		}
	};

	var Class = function KineticPhoto() {

		var instance = this;

		var xform, rootNode, snap;
		var nodes, images, index = 0, count = 10;

		instance.embedIn = function(_) {
			rootNode = _;
			return instance;
		};

		instance.ready = function(swipe, asyncReturn) {
			swipe.config(settings.swipe);
			swipe.kinetic(new Kinetic(settings.kinetic));

			snap = window.innerWidth;
			xform = swipe.getBrowserTransforms(rootNode);
			swipe.setupEvents(rootNode);

			var offset = 0;

			nodes = renderNodes(snap);
			images = []; attachImages(count, images);


			offset = instance.display(0, snap);

			asyncReturn(offset);

		};

		instance.display = function(i) {
			i = index + i / snap;
			index = getIndex(i, index);
			updateDisplay(index);
			offset = instance.scroll(0, snap);
			return offset;
		};

		instance.scroll = function(x) {
			var slow, fast;

			slow = -Math.round(x / 2);
			fast = -Math.round(x);

			nodes.left.style[xform] = 'translate3d(' + (fast - snap) + 'px, 0, 0)';
			nodes.center.style[xform] = 'translate3d(' + slow + 'px, 0, 0)';
			nodes.right.style[xform] = 'translate3d(' + (fast + snap) + 'px, 0, 0)';

			return x;
		};
		instance.snap = function(target) {
			target = Math.round(target / snap) * snap;
			target = (target < -snap) ? -snap : (target > snap) ? snap : target;
			return target;
		};


		function attachImages(count, images) {
			var i, stash, el;

			// Predownloads some images.
			stash = document.getElementById('stash');
			for (i = 0; i < count; ++i) {
				el = document.createElement('img');
				el.setAttribute('src', 'images/' + i + '.jpg');
				stash.appendChild(el);
				images.push(el);
			}
		}

		function renderNodes(snap) {
			left = document.getElementById('1');
			center = document.getElementById('2');
			right = document.getElementById('3');

			left.setAttribute('width', snap + 'px');
			center.setAttribute('width', snap + 'px');
			right.setAttribute('width', snap + 'px');
			return {left: left, center: center, right: right};
		}




		function wrap(x) {
			return (x >= count) ? (x - count) : (x < 0) ? x + count : x;
		}

		function getIndex(i, index) {
			// var left = nodes.left, center = nodes.center, right = nodes.right;

			var id = nodes.center.id;
			if (i < index) {
				id = nodes.left.id;
				nodes.left = document.getElementById(nodes.center.id);
			} else if (i > index) {
				id = nodes.right.id;
				nodes.right = document.getElementById(nodes.center.id);
			}
			nodes.center = document.getElementById(id);

			index = wrap(i);

			return index;
		};

		function updateDisplay(index) {
			nodes.left.setAttribute('src', images[wrap(index - 1)].getAttribute('src'));
			nodes.center.setAttribute('src', images[index].getAttribute('src'));
			nodes.right.setAttribute('src', images[wrap(index + 1)].getAttribute('src'));


			nodes.left.setAttribute('class', 'leftcard');
			nodes.center.setAttribute('class', 'centercard');
			nodes.right.setAttribute('class', 'rightcard');
		};

		
		return instance;
	};

	window.KineticPhoto = Class;

}(window));
