var assert = require('assert');
var path = require('path');
var fs = require('fs');
var transformer = require('../');
var rewrite = require('../lib/rewrite-url');

function read(filePath, isString) {
	return fs.readFileSync(path.join(__dirname, filePath), isString ? {encoding: 'utf8'} : null);
}

function fileObj(src) {
	return {
		src: src,
		cwd: __dirname
	};
}

describe('CSS importer', function() {
	it('process CSS', function(done) {
		transformer()
			.use(rewrite({
				root: __dirname,
				prefix: '/a/b'
			}))
			.run(fileObj('css/file1.css'), function(err, out) {
				assert.equal(out.length, 1);
				assert.equal(out[0].content, read('fixtures/file1.css'));
				done();
			});
	});

	it('throw exception', function(done) {
		transformer()
			.run(fileObj('css/error.css'), function(err, out) {
				assert(err);
				assert(err.message.indexOf('css/error.css') !== -1, 'Error contains file name');
				done();
			});
	});
});