"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = serializePLS;
/**
 * Escape a value for PLS format.
 * PLS uses key=value format, so values containing '=' or newlines need special handling.
 * For PLS, we escape backslashes and newlines, but preserve '=' as it's part of the format.
 * If a value contains newlines, we replace them with spaces.
 */
function escapePLSValue(value) {
    // Replace newlines with spaces (PLS doesn't support multi-line values)
    var normalized = value.replace(/\n/g, ' ').replace(/\r/g, '');
    // Escape backslashes
    return normalized.replace(/\\/g, '\\\\');
}
function serializePLS(input) {
    var _a;
    var lines = [];
    var tracks = (_a = input.track) !== null && _a !== void 0 ? _a : [];
    var trackCount = tracks.length;
    lines.push('[playlist]');
    lines.push("NumberOfEntries=".concat(trackCount));
    var i = 1;
    for (var _i = 0, tracks_1 = tracks; _i < tracks_1.length; _i++) {
        var track = tracks_1[_i];
        var trackLines = serializeTrack(track, i);
        lines.push.apply(lines, trackLines);
        i++;
    }
    return lines.join('\n') + '\n';
}
function serializeTrack(input, index) {
    var _a;
    var lines = [];
    if ((_a = input === null || input === void 0 ? void 0 : input.location) === null || _a === void 0 ? void 0 : _a[0]) {
        lines.push("File".concat(index, "=").concat(escapePLSValue(input.location[0])));
    }
    if (input === null || input === void 0 ? void 0 : input.title) {
        lines.push("Title".concat(index, "=").concat(escapePLSValue(input.title)));
    }
    if ((input === null || input === void 0 ? void 0 : input.duration) !== undefined) {
        lines.push("Length".concat(index, "=").concat(input.duration));
    }
    if (input === null || input === void 0 ? void 0 : input.creator) {
        lines.push("Artist".concat(index, "=").concat(escapePLSValue(input.creator)));
    }
    if (input === null || input === void 0 ? void 0 : input.album) {
        lines.push("Album".concat(index, "=").concat(escapePLSValue(input.album)));
    }
    return lines;
}
