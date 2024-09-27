"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parsePLS;
function stripPLSHeader(input) {
    var lines = input.split('\n');
    if (lines[0].toLowerCase() === '[playlist]') {
        lines.splice(0, 1);
    }
    return lines.join('\n');
}
function getTrackIndexFromPropName(str) {
    var matches = str.match(/\d+$/);
    if (!matches)
        return undefined;
    return parseInt(matches[0]);
}
function parseTrack(input) {
    var output = {};
    if (input.title) {
        output.title = input.title;
    }
    if (input.artist) {
        output.creator = input.artist;
    }
    if (input.album) {
        output.album = input.album;
    }
    if (input.file) {
        output.location = [input.file];
    }
    if (input.length) {
        output.duration = Number(input.length);
    }
    return output;
}
function parsePLS(input) {
    var _a, _b;
    var output = {};
    // Remove header
    var entries = input = stripPLSHeader(input);
    // Split entries into an array
    var lines = entries.split('\n');
    // Remove any empty lines and trim whitespace
    var cleanedLines = lines.filter(function (line) { return line.trim() !== ''; }).map(function (line) { return line.trim(); });
    // Create a new object for storing the key-value pairs
    var propsList = {};
    // Loop through each line and extract the key-value pair
    cleanedLines.forEach(function (line) {
        var _a = line.split('='), key = _a[0], value = _a[1];
        propsList[key.trim()] = value.trim();
    });
    var tracksPropsObj = {};
    //fill an array of tracks where properties have their key stripped of their suffix
    for (var _i = 0, _c = Object.entries(propsList); _i < _c.length; _i++) {
        var _d = _c[_i], key = _d[0], value = _d[1];
        var trackIndex = getTrackIndexFromPropName(key);
        if (trackIndex) {
            var itemProps = {};
            //strip number from key
            var newKey = key.slice(0, -trackIndex.toString().length).toLowerCase();
            //add to tracks props
            tracksPropsObj = __assign(__assign({}, tracksPropsObj), (_a = {}, _a[trackIndex] = __assign(__assign({}, tracksPropsObj[trackIndex]), (_b = {}, _b[newKey] = value, _b)), _a));
            //remove from main props
            delete propsList[key];
        }
    }
    //fill tracks
    output.track = Object.values(tracksPropsObj).map(function (el) { return parseTrack(el); });
    return output;
}
