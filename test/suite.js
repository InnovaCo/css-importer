var assert = require('assert');
var path = require('path');
var fs = require('fs');
var transformer = require('../');
var rewrite = require('../lib/rewrite-url');

function read(filePath, isString) {
	return fs.readFileSync(path.join(__dirname, filePath), isString ? {encoding: 'utf8'} : null);
}

describe('CSS importer', function() {
	it('should work', function(done) {
		transformer()
			.use(rewrite({
				root: __dirname,
				prefix: '/a/b'
			}))
			.run('css/*.css', {cwd: __dirname}, function(err, out) {
				assert.equal(out.length, 1);
				assert.equal(out[0].content, read('fixtures/file1.css'));
				done();
			});
	});
});