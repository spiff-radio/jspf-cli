"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseM3U8;
//TOUFIX official types not existing yet.
//TOUFIX title is not extracted : https://github.com/videojs/m3u8-parser/issues/created_by/spiff-radio
// @ts-ignore
const m3u8_parser_1 = require("m3u8-parser");
const utils_1 = require("../../utils");
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
        catch {
            // If parsing fails, fall back to removing quotes manually
            title = title.slice(1, -1);
        }
    }
    // Remove duration prefix if present (format: "duration,title")
    // The m3u8-parser sometimes includes the duration in the title
    const durationMatch = title.match(/^-?\d+(?:\.\d+)?,(.+)$/);
    if (durationMatch) {
        title = durationMatch[1].trim();
    }
    // Try to parse "Artist - Title" format
    const dashMatch = title.match(/^(.+?)\s*-\s*(.+)$/);
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
    const trackData = {
        location: [segment.uri],
        // M3U8's EXTINF duration is in seconds; JSPF's duration is in milliseconds.
        // -1 means "unknown duration" in HLS and has no JSPF equivalent.
        duration: segment.duration !== undefined && segment.duration !== -1 ? Math.round(segment.duration * 1000) : undefined,
        extension: {},
    };
    if (segment.title) {
        const parsed = parseTrackTitle(segment.title);
        if (parsed.creator) {
            trackData.creator = parsed.creator;
        }
        if (parsed.title) {
            trackData.title = parsed.title;
        }
    }
    if (segment.byterange && trackData.extension) {
        trackData.extension['BYTERANGE'] = [`${segment.byterange.length}@${segment.byterange.offset}`];
    }
    if (segment.key && trackData.extension) {
        trackData.extension['KEY'] = [`${segment.key.method}:${segment.key.uri}`];
        if (segment.key.iv) {
            trackData.extension['KEY'].push(`IV:${segment.key.iv}`);
        }
    }
    if (segment.map && trackData.extension) {
        trackData.extension['MAP'] = [segment.map.uri];
    }
    return trackData;
}
function parseM3U8(input) {
    const parser = new m3u8_parser_1.Parser();
    parser.push(input);
    parser.end();
    let output = {};
    if (parser.manifest.playlists) {
        //get the first playlist
        const playlist = parser.manifest.playlists?.[0];
        if (playlist.attributes?.['NAME']) {
            output.title = playlist.attributes['NAME'];
        }
        if (playlist.attributes?.['CREATOR']) {
            output.creator = playlist.attributes['CREATOR'];
        }
        if (playlist.attributes?.['URI']) {
            output.location = playlist.attributes['URI'];
        }
        if (playlist.uri) {
            output = {
                ...output,
                extension: {
                    ...output.extension,
                    'X-STREAM-INF': [playlist.uri]
                }
            };
        }
    }
    if (parser.manifest.segments) {
        output.track = [];
        for (const segment of parser.manifest.segments) {
            const trackData = parseTrack(segment);
            output.track.push(trackData);
        }
    }
    return output;
}
