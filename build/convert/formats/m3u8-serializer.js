"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = serializeM3U8;
function serializeM3U8(input) {
    var output = '';
    var lines = [];
    lines.push("#EXTM3U");
    // Add playlist information
    if (input.title) {
        lines.push("#EXTINF:-1,t=".concat(input.title));
    }
    if (input.creator) {
        lines.push("#EXTINF:-1,a=".concat(input.creator));
    }
    if (input.image) {
        lines.push("#EXTVLCOPT:artworkURL=".concat(input.image));
    }
    if (input.date) {
        lines.push("#EXTVLCOPT:meta-date=".concat(input.date));
    }
    output = lines.join("\n");
    // Add tracks
    if (input.track) {
        output += "\n";
        for (var _i = 0, _a = input.track; _i < _a.length; _i++) {
            var trackInput = _a[_i];
            var track = serializeTrack(trackInput);
            output += "\n" + track + "\n";
        }
    }
    return output;
}
function serializeTrack(input) {
    var _a;
    var lines = [];
    var duration = (_a = input.duration) !== null && _a !== void 0 ? _a : -1;
    var firstLine = ["#EXTINF:".concat(duration)];
    if (input.creator) {
        firstLine.push("a=".concat(input.creator));
    }
    if (input.title) {
        firstLine.push("t=".concat(input.title));
    }
    lines.push(firstLine.join(','));
    if (input.location) {
        for (var _i = 0, _b = input.location; _i < _b.length; _i++) {
            var location = _b[_i];
            lines.push(location);
        }
    }
    // Add metadatas
    if (input.meta) {
        for (var _c = 0, _d = input.meta; _c < _d.length; _c++) {
            var meta = _d[_c];
            for (var key in meta) {
                lines.push("#EXTVLCOPT:meta-".concat(key, "=").concat(meta[key]));
            }
        }
    }
    return lines.join("\n");
}
