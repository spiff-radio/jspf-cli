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
exports.default = parseM3U8;
//TOUFIX official types not existing yet.
//TOUFIX title is not extracted : https://github.com/videojs/m3u8-parser/issues/created_by/spiff-radio
// @ts-ignore
var m3u8_parser_1 = require("m3u8-parser");
var utils_1 = require("../../utils");
/**
 * Parse title string that may be in format "Artist - Title" or just "Title"
 * Also handles cases where duration is included (e.g., "-1,Title" or "123,Title")
 * Returns object with creator and title separated
 */
function parseTrackTitle(title) {
    if (!title) {
        return {};
    }
    // Handle quoted strings using JSON.parse for proper unescaping
    title = title.trim();
    if ((0, utils_1.isJsonString)(title)) {
        try {
            // JSON.parse handles all escaping correctly (quotes, backslashes, etc.)
            title = JSON.parse(title);
        }
        catch (_a) {
            // If parsing fails, fall back to removing quotes manually
            title = title.slice(1, -1);
        }
    }
    // Remove duration prefix if present (format: "duration,title")
    // The m3u8-parser sometimes includes the duration in the title
    var durationMatch = title.match(/^-?\d+(?:\.\d+)?,(.+)$/);
    if (durationMatch) {
        title = durationMatch[1].trim();
    }
    // Try to parse "Artist - Title" format
    var dashMatch = title.match(/^(.+?)\s*-\s*(.+)$/);
    if (dashMatch) {
        return {
            creator: dashMatch[1].trim(),
            title: dashMatch[2].trim()
        };
    }
    // If no dash separator, treat entire string as title
    return { title: title };
}
function parseTrack(segment) {
    var trackData = {
        location: [segment.uri],
        // Convert -1 (unknown duration) to undefined for JSPF format
        duration: segment.duration !== undefined && segment.duration !== -1 ? segment.duration : undefined,
        extension: {},
    };
    if (segment.title) {
        var parsed = parseTrackTitle(segment.title);
        if (parsed.creator) {
            trackData.creator = parsed.creator;
        }
        if (parsed.title) {
            trackData.title = parsed.title;
        }
    }
    if (segment.byterange && trackData.extension) {
        trackData.extension['BYTERANGE'] = ["".concat(segment.byterange.length, "@").concat(segment.byterange.offset)];
    }
    if (segment.key && trackData.extension) {
        trackData.extension['KEY'] = ["".concat(segment.key.method, ":").concat(segment.key.uri)];
        if (segment.key.iv) {
            trackData.extension['KEY'].push("IV:".concat(segment.key.iv));
        }
    }
    if (segment.map && trackData.extension) {
        trackData.extension['MAP'] = [segment.map.uri];
    }
    return trackData;
}
function parseM3U8(input) {
    var _a, _b, _c, _d;
    var parser = new m3u8_parser_1.Parser();
    parser.push(input);
    parser.end();
    var output = {};
    if (parser.manifest.playlists) {
        //get the first playlist
        var playlist = (_a = parser.manifest.playlists) === null || _a === void 0 ? void 0 : _a[0];
        if ((_b = playlist.attributes) === null || _b === void 0 ? void 0 : _b['NAME']) {
            output.title = playlist.attributes['NAME'];
        }
        if ((_c = playlist.attributes) === null || _c === void 0 ? void 0 : _c['CREATOR']) {
            output.creator = playlist.attributes['CREATOR'];
        }
        if ((_d = playlist.attributes) === null || _d === void 0 ? void 0 : _d['URI']) {
            output.location = playlist.attributes['URI'];
        }
        if (playlist.uri) {
            output = __assign(__assign({}, output), { extension: __assign(__assign({}, output.extension), { 'X-STREAM-INF': [playlist.uri] }) });
        }
    }
    if (parser.manifest.segments) {
        output.track = [];
        for (var _i = 0, _e = parser.manifest.segments; _i < _e.length; _i++) {
            var segment = _e[_i];
            var trackData = parseTrack(segment);
            output.track.push(trackData);
        }
    }
    return output;
}
