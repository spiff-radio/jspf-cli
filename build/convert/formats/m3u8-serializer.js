"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = serializeM3U8;
var jsesc_1 = __importDefault(require("jsesc"));
/**
 * Escape a value for use in M3U8 format.
 * Uses jsesc for proper JavaScript string escaping (quotes, backslashes, etc.)
 * which is the standard for M3U8 format.
 */
function escapeM3U8Value(value) {
    // If value contains commas, quotes, backslashes, or newlines, quote it
    if (value.includes(',') || value.includes('"') || value.includes('\\') || value.includes('\n')) {
        // Use jsesc for proper escaping, then wrap in quotes
        var escaped = (0, jsesc_1.default)(value, { quotes: 'double', wrap: false });
        return "\"".concat(escaped, "\"");
    }
    return value;
}
/**
 * Build the title string for EXTINF tag.
 * Standard format: #EXTINF:duration,title
 * If both creator and title exist, format as: #EXTINF:duration,"Artist - Title"
 */
function buildExtinfTitle(creator, title) {
    if (creator && title) {
        var combined = "".concat(creator, " - ").concat(title);
        return escapeM3U8Value(combined);
    }
    if (title) {
        return escapeM3U8Value(title);
    }
    if (creator) {
        return escapeM3U8Value(creator);
    }
    return '';
}
function serializeM3U8(input) {
    var lines = [];
    // M3U8 header
    lines.push('#EXTM3U');
    // Playlist-level metadata (using comments, not EXTINF which is track-specific)
    // Note: M3U8 doesn't have standard playlist-level metadata tags
    // VLC-specific tags are kept for compatibility but are non-standard
    if (input.image) {
        lines.push("#EXTVLCOPT:artworkURL=".concat(escapeM3U8Value(input.image)));
    }
    if (input.date) {
        lines.push("#EXTVLCOPT:meta-date=".concat(escapeM3U8Value(input.date)));
    }
    // Add tracks
    if (input.track && input.track.length > 0) {
        for (var _i = 0, _a = input.track; _i < _a.length; _i++) {
            var trackInput = _a[_i];
            var track = serializeTrack(trackInput);
            lines.push(track);
        }
    }
    return lines.join('\n');
}
function serializeTrack(input) {
    var _a;
    var lines = [];
    var duration = (_a = input.duration) !== null && _a !== void 0 ? _a : -1;
    // Build title for EXTINF tag (standard format: duration,title)
    var title = buildExtinfTitle(input.creator, input.title);
    // Standard EXTINF format: #EXTINF:duration,title
    lines.push("#EXTINF:".concat(duration, ",").concat(title));
    // Add track locations (URIs)
    if (input.location && input.location.length > 0) {
        for (var _i = 0, _b = input.location; _i < _b.length; _i++) {
            var location = _b[_i];
            lines.push(location);
        }
    }
    // Add metadata (VLC-specific, non-standard but commonly used)
    if (input.meta) {
        for (var _c = 0, _d = input.meta; _c < _d.length; _c++) {
            var meta = _d[_c];
            for (var key in meta) {
                var value = String(meta[key]);
                lines.push("#EXTVLCOPT:meta-".concat(key, "=").concat(escapeM3U8Value(value)));
            }
        }
    }
    return lines.join('\n');
}
