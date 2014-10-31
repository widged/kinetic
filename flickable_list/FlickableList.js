define(function(require, exports, module) {
	var Class = function ScrollOverlay(node, overlayNode, listNode) {

		var instance = this;

		function init() {
			if(!overlayNode) { return; }
			var vTop = listNode.first('li').getBoundingClientRect().top;
			var oTop = overlayNode.getBoundingClientRect().top;
			node.style.top = Math.round(oTop - vTop);
		}

		instance.adjust = function(max) {
			return max - instance.bottom();
		};

		instance.bottom = function() {
			if(!overlayNode) { return 0; }
			var vTop = listNode.first('li').getBoundingClientRect().top;
			var oBot = overlayNode.getBoundingClientRect().bottom;
			return oBot - vTop;
		};

		init();

		return instance;
	};
	return Class;
});

define(function(require, exports, module) {

	var Class = function FlickableList() {

		var instance = this, dom;

		var view, indicator, overlay, max, min, snap;
		var xform;
		
		instance.embedIn = function(node) {
			dom       = DomComponent(node);
			view      = dom.first('.view');
			return instance;
		};

		instance.ready = function(swipe, asyncReturn) {
			swipe.config({});
			swipe.kinetic(new Kinetic({}));

			xform = swipe.getBrowserTransforms(view);
			swipe.setupEvents(view);

			min   = 0;
			max   = computedHeight(dom.first(".view"));
			snap  = dom.first('li:last-child').getBoundingClientRect().height;

			var overlay = new ScrollOverlay(dom.first('.overlay'), dom.first('li.overlay'), dom);
			max = overlay.adjust(max);

			indicator = new ScrollIndicator(dom.first('.indicator'), dom, computedHeight(dom.root), xform);

			snap = snap;
			asyncReturn(0);
		};

		instance.display = function(y) {
			return instance.scroll(y);
		};
 
		instance.scroll = function(y) {
			y = (y > max) ? max : (y < min) ? min : y;
			view.querySelector('ul').style[xform] = 'translateY(' + (-y) + 'px)';
			if(indicator) { indicator.update(y, min, max); }
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
