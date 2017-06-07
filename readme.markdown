# xrandr-verbose-parse

parse the output of the `xrandr --verbose` command

This module was based on [lionep](https://github.com/lionep) xrandr [paser](https://github.com/lionep/xrandr-parse)

# example

``` js
var parse = require('xrandr-verbose-parse');
var exec = require('child_process').exec;

exec('xrandr --verbose', function (err, stdout) {
    var query = parse(stdout);
    console.log(JSON.stringify(query, null, 2));
});
```

the `xrandr --verbose` command produced this output:

```
Screen 0: minimum 320 x 200, current 1080 x 1920, maximum 2048 x 2048
HDMI-1 connected 1080x1920+0+0 (0x44) right (normal left inverted right x axis y axis) 477mm x 268mm
	Identifier: 0x42
	Timestamp:  96798461
	Subpixel:   unknown
	Gamma:      1.0:1.0:1.0
	Brightness: 1.0
	Clones:    
	CRTC:       2
	CRTCs:      2
	Transform:  1.000000 0.000000 0.000000
	            0.000000 1.000000 0.000000
	            0.000000 0.000000 1.000000
	           filter: 
	EDID: 
		00ffffffffffff001e6dd75801010101
		0115010380301b78ea9535a159579f27
		0e5054a54b00714f8180818fb3000101
		010101010101023a801871382d40582c
		4500dd0c1100001e000000fd00384b1e
		530f000a202020202020000000fc0049
		50533232340a202020202020000000ff
		000a2020202020202020202020200189
		02031df14a900403011412051f101323
		0907078301000065030c001000023a80
		1871382d40582c4500dd0c1100001e01
		1d8018711c1620582c2500dd0c110000
		9e011d007251d01e206e285500dd0c11
		00001e8c0ad08a20e02d10103e9600dd
		0c110000180000000000000000000000
		000000000000000000000000000000c2
  1920x1080 (0x44) 148.500MHz +HSync +VSync *current +preferred
        h: width  1920 start 2008 end 2052 total 2200 skew    0 clock  67.50KHz
        v: height 1080 start 1084 end 1089 total 1125           clock  60.00Hz
  1920x1080 (0x45) 148.500MHz +HSync +VSync
        h: width  1920 start 2448 end 2492 total 2640 skew    0 clock  56.25KHz
        v: height 1080 start 1084 end 1089 total 1125           clock  50.00Hz
```

and the parsed result is:

```
{
  "HDMI-1": {
    "connected": true,
    "orientation": "right",
    "modes": [
      {
        "width": "1920",
        "height": "1080",
        "rate": 148.5,
        "optionals": "+HSync +VSync ",
        "current": true,
        "preferred": true,
        "dimensions": {
          "vertical": {
            "width": "1080",
            "start": "1084",
            "end": "1089",
            "total": "1125"
          },
          "horizontal": {
            "width": "1920",
            "start": "2008",
            "end": "2052",
            "total": "2200"
          }
        }
      },
      {
        "width": "1920",
        "height": "1080",
        "rate": 148.5,
        "optionals": "+HSync ",
        "current": true,
        "preferred": false,
        "dimensions": {
          "vertical": {
            "width": "1080",
            "start": "1084",
            "end": "1089",
            "total": "1125"
          },
          "horizontal": {
            "width": "1920",
            "start": "2448",
            "end": "2492",
            "total": "2640"
          }
        }
      },
    ],
    "index": 0,
    "width": 1080,
    "height": 1920,
    "left": 1080,
    "top": 1920
  }
}

```

# methods

``` js
var parse = require('xrandr-verbose-parse')
```

## parse(xrandrOutput)

Return the parsed output from a string full of the output from `xrandr`,
`xrandrOutput`.

The return object is keyed by each output name.

# install

With [npm](https://npmjs.org) do:

```
npm install xrandr-verbose-parse
```

# license

MIT
