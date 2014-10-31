define(function(require, exports, module) {

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

	return Class;

});