var postcss = require('postcss');
var async = require('async');
var utils = require('importer-utils');

function Transformer(stylesheet, options) {
	if (!(this instanceof Transformer)) {
		return new Transformer();
	}

	this._processors = [];
}

Transformer.prototype = {
	use: function(processor) {
		for (var i = 0, il = arguments.length, p; i < il; i++) {
			p = arguments[i];
			if (!~this._processors.indexOf(p)) {
				this._processors.push(p);
			}
		}

		return this;
	},

	_processDoc: function(res, callback) {
		var queue = this._processors.slice(0);
		var out = postcss(function(css) {
			var next = function() {
				if (!queue.length) {
					return setTimeout(function() {
						callback(out.css);
					}, 1);
				}

				var fn = queue.shift();
				fn.length > 2 ? fn(css, res, next) : next(fn(css, res));
			};
			next();
		}).process(res.content);
	},

	run: function(files, callback) {
		var self = this;
		async.waterfall([
			function(callback) {
				utils.file.read(files, callback);
			},
			function(input, callback) {
				async.map(input, function(item, callback) {
					self._processDoc(item, function(content) {
						callback(null, {
							file: item.file,
							content: content
						});
					});
				}, callback);
			}
		], callback);
	}
};

module.exports = Transformer;