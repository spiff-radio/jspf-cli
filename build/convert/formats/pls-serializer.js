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
    const normalized = value.replace(/\n/g, ' ').replace(/\r/g, '');
    // Escape backslashes
    return normalized.replace(/\\/g, '\\\\');
}
function serializePLS(input) {
    const lines = [];
    const tracks = input.track ?? [];
    const trackCount = tracks.length;
    lines.push('[playlist]');
    lines.push(`NumberOfEntries=${trackCount}`);
    let i = 1;
    for (const track of tracks) {
        const trackLines = serializeTrack(track, i);
        lines.push(...trackLines);
        i++;
    }
    return lines.join('\n') + '\n';
}
function serializeTrack(input, index) {
    const lines = [];
    if (input?.location?.[0]) {
        lines.push(`File${index}=${escapePLSValue(input.location[0])}`);
    }
    if (input?.title) {
        lines.push(`Title${index}=${escapePLSValue(input.title)}`);
    }
    if (input?.duration !== undefined) {
        // JSPF's duration is in milliseconds; PLS's Length is in seconds.
        lines.push(`Length${index}=${Math.round(input.duration / 1000)}`);
    }
    if (input?.creator) {
        lines.push(`Artist${index}=${escapePLSValue(input.creator)}`);
    }
    if (input?.album) {
        lines.push(`Album${index}=${escapePLSValue(input.album)}`);
    }
    return lines;
}
