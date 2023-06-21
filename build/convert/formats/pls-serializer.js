"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function serializePLS(input) {
    var _a;
    var output = '';
    var lines = [];
    var tracks = (_a = input.track) !== null && _a !== void 0 ? _a : [];
    var trackCount = tracks.length;
    lines.push("[playlist]");
    lines.push("NumberOfEntries=".concat(trackCount));
    output = lines.join("\n") + "\n";
    var i = 1;
    for (var _i = 0, tracks_1 = tracks; _i < tracks_1.length; _i++) {
        var track = tracks_1[_i];
        output += serializeTrack(track, i) + "\n";
        i++;
    }
    return output;
}
exports.default = serializePLS;
function serializeTrack(input, index) {
    var _a;
    var output = '';
    var lines = [];
    if ((_a = input === null || input === void 0 ? void 0 : input.location) === null || _a === void 0 ? void 0 : _a[0]) {
        lines.push("File".concat(index, "=").concat(input.location[0]));
    }
    if (input === null || input === void 0 ? void 0 : input.title) {
        lines.push("Title".concat(index, "=").concat(input.title));
    }
    if (input === null || input === void 0 ? void 0 : input.duration) {
        lines.push("Length".concat(index, "=").concat(input.duration));
    }
    if (input === null || input === void 0 ? void 0 : input.creator) {
        lines.push("Artist".concat(index, "=").concat(input.creator));
    }
    if (input === null || input === void 0 ? void 0 : input.album) {
        lines.push("Album".concat(index, "=").concat(input.album));
    }
    output = lines.join("\n");
    return output;
}
