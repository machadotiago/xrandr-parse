var type = {
    connected: /^(\S+) connected (?:(\d+)x(\d+)\+(\d+)\+(\d))?\s+(\([0-9x]+\))\s+(\w+)/,
    disconnected: /^(\S+) disconnected/,
    mode: /^\s+(\d+)x([0-9i]+)\s+(\(\w+\))\s+([0-9]+\.[0-9]+)MHz\s+((\s*[\+]*[\-]*\w*\s)*)((\*current)*)\s*((\+preferred)*)/,
    dimension_horizontal: /^\s+(h\:)\s+(width)\s+(\d+)\s+(start)\s+(\d+)\s+(end)\s+(\d+)\s+(total)\s+(\d+)/,
    dimension_vertical: /^\s+(v\:)\s+(height)\s+(\d+)\s+(start)\s+(\d+)\s+(end)\s+(\d+)\s+(total)\s+(\d+)/
};


/**
 * This function parses an xrandr output with the following format
 * Screen 0: minimum 320 x 200, current 1080 x 1920, maximum 2048 x 2048
 * HDMI-1 connected 1080x1920+0+0 (0x44) right (normal left inverted right x axis y axis) 477mm x 268mm
 * 	Identifier: 0x42
 * 	Timestamp:  96798461
 * 	Subpixel:   unknown
 * 	Gamma:      1.0:1.0:1.0
 * 	Brightness: 1.0
 * 	Clones:    
 * 	CRTC:       2
 * 	CRTCs:      2
 * 	Transform:  1.000000 0.000000 0.000000
 * 	            0.000000 1.000000 0.000000
 * 	            0.000000 0.000000 1.000000
 * 	           filter: 
 * 	EDID: 
 * 		00ffffffffffff001e6dd75801010101		
 *   1920x1080 (0x44) 148.500MHz +HSync +VSync *current +preferred
 *         h: width  1920 start 2008 end 2052 total 2200 skew    0 clock  67.50KHz
 *         v: height 1080 start 1084 end 1089 total 1125           clock  60.00Hz
 *   1920x1080 (0x45) 148.500MHz +HSync +VSync
 *         h: width  1920 start 2448 end 2492 total 2640 skew    0 clock  56.25KHz
 *         v: height 1080 start 1084 end 1089 total 1125           clock  50.00Hz 
 * 
 * @param {*} data
 */
module.exports = function (data) {
    var lines = data.split('\n');
    var result = {};
    var last_connection = null;
    var last_mode = 0;
    var index = 0;

    lines.forEach(function (line) {
        var tmp;
        if ((tmp = type.connected.exec(line))) {

            result[tmp[1]] = {
                connected: true,
                orientation: tmp[7],
                modes: [],
                index: index++
            };
            if (tmp[2] && tmp[3]) {
                result[tmp[1]].width = parseInt(tmp[2]);
                result[tmp[1]].height = parseInt(tmp[3]);
            }
            if (tmp[4] && tmp[5]) {
                result[tmp[1]].left = parseInt(tmp[4]);
                result[tmp[1]].top = parseInt(tmp[5]);
            }
            last_connection = tmp[1];

        } else if ((tmp = type.disconnected.exec(line))) {
            result[tmp[1]] = {
                connected: false,
                modes: [],
                index: index++
            };
            last_connection = tmp[1];
        } else if ((tmp = type.mode.exec(line))) {
            var dimensions = {
                vertical: null,
                horizontal: null
            };
            var r = {
                width: tmp[1],
                height: tmp[2],
                rate: parseFloat(tmp[4]),
                optionals: tmp[5],
                current: tmp[6] ? true : false,
                preferred: tmp[7] ? true : false,
                dimensions: dimensions
            };
            result[last_connection].modes.push(r);
            last_mode++;
            if (tmp[4] === '+') result[last_connection]['native'] = r;
            if (tmp[5] === '*') result[last_connection].current = r;
        } else if ((tmp = type.dimension_horizontal.exec(line))) {
            var dimension_h = {
                width: tmp[3],
                start: tmp[5],
                end: tmp[7],
                total: tmp[9],
            };
            result[last_connection].modes[last_mode - 1].dimensions.horizontal = dimension_h;

        } else if ((tmp = type.dimension_vertical.exec(line))) {
            var dimension_v = {
                width: tmp[3],
                start: tmp[5],
                end: tmp[7],
                total: tmp[9],
            };
            result[last_connection].modes[last_mode - 1].dimensions.vertical = dimension_v;
        }
    });
    return result;
};