var reglyph = require('../reglyph.js');
var assert = require('assert');

describe('reglyph', function() {
    describe('range detection', function() {
        it('detects a single-character range', function(done) {
            assert.equal(typeof reglyph, 'function');

            var callback = function(range) {
              assert.equal(range, 'U+0001');
              done();
            };

            reglyph('./test/fixtures/0001.ttf', callback, 'font-face');
        });

        it('detects a multi-character range', function(done) {
            assert.equal(typeof reglyph, 'function');

            var callback = function(range) {
              assert.equal(range, 'U+0001-0007');
              done();
            };

            reglyph('./test/fixtures/0001-0007.ttf', callback, 'font-face');
        });

        it('detects multiple single-character ranges', function(done) {
            assert.equal(typeof reglyph, 'function');

            var callback = function(range) {
              assert.equal(range, 'U+0001, U+0005, U+0098, U+00CD');
              done();
            };

            reglyph('./test/fixtures/0001_0005_00098_000CD.ttf', callback, 'font-face');
        });

        it('detects multiple multi-character ranges', function(done) {
            assert.equal(typeof reglyph, 'function');

            var callback = function(range) {
              assert.equal(range, 'U+0001-0005, U+0097-009A');
              done();
            };

            reglyph('./test/fixtures/0001-0005_0097-009A.ttf', callback, 'font-face');
        });

        it('detects multiple single-character and multiple multi-character ranges', function(done) {
            assert.equal(typeof reglyph, 'function');

            var callback = function(range) {
              assert.equal(range, 'U+0001-0005, U+000B, U+002A, U+0097-009A');
              done();
            };

            reglyph('./test/fixtures/0001-0005_0008_002A_0097-009A.ttf', callback, 'font-face');
        });
    });
});
