var nexe = require('nexe');

nexe.compile({
    input: './reglyph.js',
    output: 'build/reglyph',
    nodeTempDir: 'tmp/nexe/',
    nodeVersion: 'latest',
    flags: false,
    python: "python",
    framework: "nodejs"
}, function(err) {
    console.log(err);
});
