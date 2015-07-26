#!/usr/bin/env node

var reglyph = require('./reglyph.js'),
    cp = require('child_process');

cp.fork(__dirname + '/reglyph.js', process.argv.slice(2));
