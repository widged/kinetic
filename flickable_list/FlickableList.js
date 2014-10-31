define(function(require, exports, module) {
	var Class = function ScrollOverlay(overlayNode) {

		var instance = this;

		instance.adjust = function(max) {
			return max - instance.bottom();
		};

		instance.top = function() {
			return overlayNode.getBoundingClientRect().top;
		};

		instance.bottom = function() {
			if(!overlayNode) { return 0; }
			var vTop = overlayNode.parentNode.getBoundingClientRect().top;
			var oBot = overlayNode.getBoundingClientRect().bottom;
			return oBot - vTop;
		};


		return instance;
	};
	return Class;
});

define(function(require, exports, module) {

	var BrowserTransforms = require('BrowserTransforms');
	var Kinetic           = require('Kinetic');
	var Swipe             = require('Swipe');

	var Class = function FlickableList() {

		var instance = this, dom;

		var view, indicator, overlay, max, min, snap;
		var xform;
		
		instance.embedIn = function(node) {
			dom       = DomComponent(node);
			view      = dom.first('.view');
			var swipe = new window.Swipe();
			swipe.renderer(instance);
			return instance;
		};

		instance.ready = function(swipe, asyncReturn) {
			swipe.config({});
			swipe.kinetic(new Kinetic({}));

			xform = BrowserTransforms.getPrefix();
			swipe.setupEvents(view);

			min   = 0;
			max   = computedHeight(dom.first(".view"));
			snap  = dom.first('li:last-child').getBoundingClientRect().height;

			if((overlayContainer = document.querySelector('div.overlay'))) {
				var overlay = new ScrollOverlay(dom.first('li.overlay'));
				overlayContainer.style.top = Math.round(overlay.top());
				max = overlay.adjust(max);
			}

			if((indicatorContainer = dom.first('.indicator'))) {
				indicator = new ScrollIndicator(indicatorContainer);
			}

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
