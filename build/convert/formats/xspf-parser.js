"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseXSPF;
const xml_js_1 = require("xml-js");
function parseXSPF(input) {
    const data = (0, xml_js_1.xml2js)(input, { compact: true });
    const dto = {};
    dto.title = data.playlist?.title?._text;
    dto.creator = data.playlist?.creator?._text;
    dto.annotation = data.playlist?.annotation?._text;
    dto.info = data.playlist?.info?._text;
    dto.location = data.playlist?.location?._text;
    dto.identifier = data.playlist?.identifier?._text;
    dto.image = data.playlist?.image?._text;
    dto.date = data.playlist?.date?._text;
    dto.license = data.playlist?.license?._text;
    if (data.playlist?.attribution) {
        dto.attribution = parseAttribution(data.playlist.attribution);
    }
    if (data.playlist?.link) {
        dto.link = parseLinks(data.playlist.link);
    }
    if (data.playlist?.meta) {
        dto.meta = parseMetas(data.playlist.meta);
    }
    if (data.playlist?.extension) {
        dto.extension = parseExtension(data.playlist.extension);
    }
    if (data.playlist?.trackList?.track) {
        dto.track = parseTrackList(data.playlist.trackList.track);
    }
    return dto;
}
function parseAttribution(input) {
    const output = [];
    //ignore '_attributes'
    delete input._attributes;
    for (let [key, value] of Object.entries(input)) {
        value = String(value?._text);
        if (!key || !value)
            continue;
        const item = {
            [key]: value
        };
        output.push(item);
    }
    return output;
}
function parseLinks(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    const output = [];
    input.forEach((el) => {
        const key = el._attributes?.rel;
        const value = String(el._text);
        if (!key || !value)
            return;
        const item = {
            [String(key)]: value
        };
        output.push(item);
    });
    return output;
}
function parseMetas(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    const output = [];
    input.forEach((el) => {
        const key = el._attributes?.rel;
        const value = String(el._text);
        if (!key || !value)
            return;
        const item = {
            [String(key)]: value
        };
        output.push(item);
    });
    return output;
}
function parseExtension(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    const output = {};
    input.forEach((el) => {
        const key = el._attributes?.application;
        if (!key)
            return;
        delete el._attributes; //ignore '_attributes'
        const value = [el];
        output[String(key)] = value;
    });
    return output;
}
function parseTrackLocationsOrIdentifiers(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    return input.map(el => String(el._text));
}
function parseTrackList(tracks) {
    return tracks.map((track) => {
        const t = {};
        if (track?.location) {
            t.location = parseTrackLocationsOrIdentifiers(track.location);
        }
        if (track?.identifier) {
            t.identifier = parseTrackLocationsOrIdentifiers(track.identifier);
        }
        if (track?.title?._text) {
            t.title = String(track.title._text);
        }
        if (track?.creator?._text) {
            t.creator = String(track.creator._text);
        }
        if (track?.annotation?._text) {
            t.annotation = String(track.annotation._text);
        }
        if (track?.info?._text) {
            t.info = String(track.info._text);
        }
        if (track?.image?._text) {
            t.image = String(track.image._text);
        }
        if (track?.album?._text) {
            t.album = String(track.album._text);
        }
        if (track?.trackNum?._text) {
            t.trackNum = Number(track.trackNum._text);
        }
        if (track?.duration?._text) {
            t.duration = Number(track.duration._text);
        }
        if (track?.link) {
            t.link = parseLinks(track.link);
        }
        if (track?.meta) {
            t.meta = parseMetas(track.meta);
        }
        if (track?.extension) {
            t.extension = parseExtension(track.extension);
        }
        return t;
    }).filter(Boolean); // filter out any undefined values
}
