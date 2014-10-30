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

			var offset = 0;
			var index = 0;

			min = 0; // </1,2> whenIndicator
			var wrapperH = computedHeight(dom.first(".wrapper"));
			var viewH    = computedHeight(dom.first(".view"));
			var viewTop = view.getBoundingClientRect().top;

			var leadingQty = dom.all('li.leading').length;
			var firstRow = dom.first('li');
			var firstTop = firstRow.getBoundingClientRect().top;
			var leadingH = dom.first('li.leading').getBoundingClientRect().height;
			var lastH   = dom.first('li:last-child').getBoundingClientRect().height;

			var paddingBottom = (lastH * leadingQty);
			var indicatorH = 20;

			if(overlay) {
				overlay.style.top = firstTop + (leadingQty * leadingH) + 'px';
				var visibleH = window.innerHeight - viewTop;
				max = viewH - paddingBottom - lastH;
			}

			if(indicator) {
				indicator.style.top = firstTop + 'px';
				relative = (wrapperH - indicatorH) / (viewH - paddingBottom - indicatorH); // 10 = some padding?
			}

			snap = lastH;
			asyncReturn(offset, lastH, index);
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
