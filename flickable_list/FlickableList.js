define(function(require, exports, module) {

	var Class = function FlickableList() {

		var instance = this, dom;

		var view, indicator, overlay,
			relative, max, min, snap;
		var xform;
		
		instance.embedIn = function(node) {
			dom       = DomComponent(node);
			view      = dom.first('.view');
			indicator = dom.first('.indicator');
			overlay   = dom.first('.overlay');

			return instance;
		};

		instance.ready = function(swipe, asyncReturn) {
			swipe.config({});
			swipe.kinetic(new Kinetic({}));

			xform = swipe.getBrowserTransforms(view);
			swipe.setupEvents(view);

			min = 0; // </1,2> whenIndicator
			var offset = 0;
			var index = 0;

			var wrapperH = computedHeight(dom.root);
			var viewH    = computedHeight(dom.first(".view"));

			var leadingQty = dom.all('li.leading').length;
			var leadingHeight = dom.first('li.leading').getBoundingClientRect().height;
			var itemHeight    = dom.first('li:last-child').getBoundingClientRect().height;

			var paddingBottom = (itemHeight * leadingQty);
			var indicatorH = 20;

			if(overlay) {
				overlay.style.top = 0 + (leadingQty * leadingHeight) + 'px';
				max = viewH - paddingBottom - itemHeight;
			}

			if(indicator) {
				indicator.style.top = 0 + 'px';
				relative = (wrapperH - indicatorH) / (viewH - paddingBottom - indicatorH); // 10 = some padding?
			}

			snap = itemHeight;
			asyncReturn(offset);
		};

		instance.display = function(y) {
			return instance.scroll(y);
		};
 
		instance.scroll = function(y) {
			y = (y > max) ? max : (y < min) ? min : y;
			view.querySelector('ul').style[xform] = 'translateY(' + (-y) + 'px)';
			// <1,2>
			if(indicator) {
				indicator.style[xform] = 'translateY(' + (y * relative) + 'px)';
			}
			// </1,2>
			return y;
		};

		instance.snap = function(target) {
			return Math.round(target / snap) * snap;
		};


		function computedHeight(node) {
			return parseInt(getComputedStyle(node).height, 10);
		}



		return instance;
	};

	return Class;

});
