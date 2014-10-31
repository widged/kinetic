(function(window) {

	var Class = function DomComponent(rootNode) {

		if(!(this instanceof DomComponent)) { return new DomComponent(rootNode);}
		var instance = this;

		instance.root = rootNode;
		instance.first = function(selector) {  return rootNode.querySelector(selector); };
		instance.all = function(selector) { return Class.nodeList(rootNode.querySelectorAll(selector)); };
		instance.load = function(html) {  rootNode.innerHTML = html; };

		return instance;
	};

	Class.getHtml = function(fn) {
		return fn.toString().match(/[\s\S]*\/\*([\s\S]*)\*\/[\s\S]*/)[1];
	};

	Class.embed = function(instance, rootNode, config) {
	 var dom = new Class(rootNode);
	 if(typeof instance.render === "function") { instance.render(dom, config); }
	 return;
	};

	Class.nodeList = function(args) {
	 return Array.prototype.slice.call(args);
	};

	Class.template = function(html, data) {
	 (Object.keys(data) || []).forEach(function(key) {
		html = html.replace(RegExp('{{' + key + '}}', "gi"), data[key]);
	 });
	 return html;
	};

	window.DomComponent = Class;

}(window));


(function(window) {

	var Class = function KineticList(config) {

		var instance = this, dom;

		if(!config) { config = {}; }

		var view, indicator, overlay,
			relative, max, min, snap;
		var xform;
		var COUNT = 140;

		instance.config = function(_) {
			if(arguments.length === 0) { return config; }
			return instance;
		};

		instance.embedIn = function(node) {
			dom       = DomComponent(node);
			view      = dom.first('.view');
			indicator = dom.first('.indicator');
			overlay   = dom.first('.overlay');

			return instance;
		};


		instance.ready = function(kinetic, asyncReturn) {
			kinetic.config(config);

			xform = kinetic.getBrowserTransforms(view);
			kinetic.setupEvents(view);

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

	window.KineticList = Class;

}(window));
