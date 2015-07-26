# Reglyph

Reglyph is a simple tool which parses an OpenType or TrueType font and outputs its Unicode coverage (i.e. the list of its supported glyphs). The output can be formatted in a ready to use regular expression.

Reglyph can be used:

* when needing to find missing glyphs in Adobe InDesign or any other rich-text editor that provides a regex-compatible search & replace function (use the "perl-negate" preset in InDesign),
* for extending the supported range of a web page with the [`unicode-range`](http://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range)property of `@font-face` in CSS3 (use the "c" preset in such case),
* in any other situation where you need to know which Unicode characters are supported by a font.

## Usage

Reglyph can be used in a terminal or as a Node.js module.

### Command-line tool

First you will need [Node.js](https://nodejs.org) to be installed on your computer.

Then run the following command to install Reglyph:

```
$ npm install -g reglyph
```

```
$ reglyph path/to/font --option value
```

Avalaible options:

* `-p` or `--preset` is the preset to use to format the output. See built-in presets in `presets.js`. If not specified, the default preset "perl-negate" is used.
* `-c` or `--custom-presets` is the path to a custom preset file for overiding the default one. Note that the new json object is merged with the old one, so built-in presets will remains avalaible until you override them.

### Node.js module

Reglyph can also be used as a Node.js module with `require("reglyph")`. Please read the source for more information about this.

## Examples

The command `$ reglyph path/to/font/Dashley.ttf` outputs a regular expression which can be directly used in Adobe InDesign (GREP search) for finding glyphs not supported by the Dashley font:

```
[^\x{0020}-\x{005A}\x{005C}\x{0061}-\x{007A}\x{2013}-\x{2014}\x{2018}-\x{2019}\x{201C}-\x{201D}\x{2022}]+
```

The command `$ reglyph path/to/font/Dashley.ttf -p html` outputs the enumeration of supported hexadecimal html entities:

```
&#x0020; &#x0021; &#x0022; &#x0023; &#x0024; &#x0025; &#x0026; &#x0027; &#x0028; &#x0029; &#x002A; &#x002B; &#x002C; &#x002D; &#x002E; &#x002F; &#x0030; &#x0031; &#x0032; &#x0033; etc.
```

## License

The MIT License (MIT)

Copyright (c) 2015 Thomas Brouard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.




