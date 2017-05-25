/*
    Reglyph - A simple tool to get the Unicode coverage of fonts
    The MIT License (MIT) - Copyright (c) 2015 Thomas Brouard
*/

var fs = require('fs'),
    opentype = require("opentype.js"),
    presets = require("./presets.json"),
    defaultPresetId = "perl-negate";

function fontLoad(path, callback) {
    opentype.load(path, function(err, font) {
        if (err) {
            console.error('Could not load font: ' + err);
        } else {
            callback(font);
        }
    });
}

function fontGetGlyphsIds(font) {
    // Get ids of displayable glyphs
    var glyphs = font.glyphs.glyphs,
        g,
        glyphsIds = [];
    for (var index in glyphs) {
        g = glyphs[index];
        if (typeof g.unicode !== "undefined") {
            glyphsIds.push(g.unicode);
        }
    }
    // Sort glyphsIds
    glyphsIds.sort(function(a, b) {
        return a - b;
    });
    return glyphsIds;
}

function convertToRanges(list) {
    var ranges = [];
    for (var i = 0; i < list.length; i++) {
        if (i === 0) {
            ranges[0] = [list[0]];
        } else if (list[i] !== list[i - 1] + 1) {
            // If is not single...
            if (ranges[ranges.length - 1][0] !== list[i - 1]) {
                //...close prev range
                ranges[ranges.length - 1].push(list[i - 1]);
            }
            // Open a new range
            ranges.push([list[i]]);
        } else if (i === list.length - 1) {
            ranges[ranges.length - 1].push(list[i]);
        }
    }
    return ranges;
}

function convertToEnumeration(list) {
    return list.map(function(item) {
        return [item];
    });
}

function toHexUnicode(decimal, lowercase) {
    function prependZeros(hex) {
        while (hex.length < 4) {
            hex = 0 + hex;
        }
        return hex;
    }
    var hex = decimal.toString(16);
    if (lowercase !== true) {
        hex = hex.toUpperCase();
    }
    return prependZeros(hex);
}

function getRegex(ranges, preset) {
    // Create regex
    var regex = preset.regexStart,
        lowercase = preset.lowercase || false,
        ch1,
        ch2;
    for (var j = 0; j < ranges.length; j++) {
        if (j !== 0) {
            regex += preset.separator;
        }
        ch1 = preset.decimal !== true ? toHexUnicode(ranges[j][0], lowercase) : ranges[j][0];
        if (ranges[j].length === 1) {
            regex += preset.rangeStart + preset.unicodeStart + ch1 + preset.unicodeEnd + preset.rangeEnd;
        } else if (ranges[j].length === 2) {
            ch2 = preset.decimal !== true ? toHexUnicode(ranges[j][1], lowercase) : ranges[j][1];
            regex += preset.rangeStart + preset.unicodeStart + ch1 + preset.unicodeEnd + preset.rangeIn + preset.unicodeStart + ch2 + preset.unicodeEnd + preset.rangeEnd;
        }
    }
    regex += preset.regexEnd;
    return regex;
}

function loadCustomPresets(presetsPath) {
    var newPresets = JSON.parse(fs.readFileSync(presetsPath, 'utf8'));
    for (var attrname in newPresets) {
        presets[attrname] = newPresets[attrname];
    }
}

function listPresets(customPresetsPath) {
    if (customPresetsPath) {
        loadCustomPresets(customPresetsPath);
    }
    console.log("\nThe following presets are available:\n");
    for (var key in presets) {
        if (presets[key].description) {
            console.log("    \"" + key + "\": " + presets[key].description + "\n");
        } else {
            console.log(key);
        }
    }
}

// Main
function reglyph(fontPath, callback, presetId, customPresetsPath) {
    if (!fontPath) {
        return null;
    }
    if (customPresetsPath) {
        loadCustomPresets(customPresetsPath);
    }
    var preset = presetId && presets[presetId] ? presets[presetId] : presets[defaultPresetId];
    fontLoad(fontPath, function(font) {
        var glyphsIds = fontGetGlyphsIds(font),
            ranges = preset.enumerate !== true ? convertToRanges(glyphsIds) : convertToEnumeration(glyphsIds),
            regex = getRegex(ranges, preset);
        callback(regex);
    });
}

if (!module.parent) {
    // CLI usage
    var program = require('commander'),
        pkg = require("./package.json"),
        fontPath;
    program
        .version(pkg.version)
        .description('Outputs the Unicode coverage of the given font.')
        .usage('<file> [options]')
        .option("-l, --list-presets", "list available presets")
        .option("-p, --preset [name]", "define the template preset used for formatting the output (default: '" + defaultPresetId + "')")
        .option('-c, --custom-presets [path]', 'declare an alternative presets file')
        .action(function(cmd) {
            fontPath = cmd;
        })
        .parse(process.argv);
    if (typeof fontPath === 'undefined' && typeof program.listPresets === "undefined") {
        console.error('Error: no font filepath given');
        process.exit(1);
    }
    var presetId = program.preset || defaultPresetId,
        customPresetsPath = program.customPresets;
    if (program.listPresets) {
        listPresets(customPresetsPath);
    } else {
        reglyph(fontPath, console.log, presetId, customPresetsPath);
    }
} else {
    // Module usage
    module.exports = reglyph;
}
