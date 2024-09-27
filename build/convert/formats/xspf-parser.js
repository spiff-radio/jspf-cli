"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseXSPF;
var xml_js_1 = require("xml-js");
var models_1 = require("../../entities/models");
function parseXSPF(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var data = (0, xml_js_1.xml2js)(input, { compact: true });
    var dto = {};
    dto.title = (_b = (_a = data.playlist) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b._text;
    dto.creator = (_d = (_c = data.playlist) === null || _c === void 0 ? void 0 : _c.creator) === null || _d === void 0 ? void 0 : _d._text;
    dto.annotation = (_f = (_e = data.playlist) === null || _e === void 0 ? void 0 : _e.annotation) === null || _f === void 0 ? void 0 : _f._text;
    dto.info = (_h = (_g = data.playlist) === null || _g === void 0 ? void 0 : _g.info) === null || _h === void 0 ? void 0 : _h._text;
    dto.location = (_k = (_j = data.playlist) === null || _j === void 0 ? void 0 : _j.location) === null || _k === void 0 ? void 0 : _k._text;
    dto.identifier = (_m = (_l = data.playlist) === null || _l === void 0 ? void 0 : _l.identifier) === null || _m === void 0 ? void 0 : _m._text;
    dto.image = (_p = (_o = data.playlist) === null || _o === void 0 ? void 0 : _o.image) === null || _p === void 0 ? void 0 : _p._text;
    dto.date = (_r = (_q = data.playlist) === null || _q === void 0 ? void 0 : _q.date) === null || _r === void 0 ? void 0 : _r._text;
    dto.license = (_t = (_s = data.playlist) === null || _s === void 0 ? void 0 : _s.license) === null || _t === void 0 ? void 0 : _t._text;
    if ((_u = data.playlist) === null || _u === void 0 ? void 0 : _u.attribution) {
        dto.attribution = parseAttribution(data.playlist.attribution);
    }
    if ((_v = data.playlist) === null || _v === void 0 ? void 0 : _v.link) {
        dto.link = parseLinks(data.playlist.link);
    }
    if ((_w = data.playlist) === null || _w === void 0 ? void 0 : _w.meta) {
        dto.meta = parseMetas(data.playlist.meta);
    }
    if ((_x = data.playlist) === null || _x === void 0 ? void 0 : _x.extension) {
        dto.extension = parseExtension(data.playlist.extension);
    }
    if ((_z = (_y = data.playlist) === null || _y === void 0 ? void 0 : _y.trackList) === null || _z === void 0 ? void 0 : _z.track) {
        dto.track = parseTrackList(data.playlist.trackList.track);
    }
    return new models_1.JspfPlaylist(dto);
}
function parseAttribution(input) {
    var _a;
    var output = [];
    //ignore '_attributes'
    delete input._attributes;
    for (var _i = 0, _b = Object.entries(input); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        value = String(value === null || value === void 0 ? void 0 : value._text);
        if (!key || !value)
            continue;
        var item = (_a = {},
            _a[key] = value,
            _a);
        output.push(item);
    }
    return output;
}
function parseLinks(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    var output = [];
    input.forEach(function (el) {
        var _a;
        var _b;
        var key = String((_b = el._attributes) === null || _b === void 0 ? void 0 : _b.rel);
        var value = String(el._text);
        if (!key || !value)
            return;
        var item = (_a = {},
            _a[key] = value,
            _a);
        output.push(item);
    });
    return output;
}
function parseMetas(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    var output = [];
    input.forEach(function (el) {
        var _a;
        var _b;
        var key = String((_b = el._attributes) === null || _b === void 0 ? void 0 : _b.rel);
        var value = String(el._text);
        if (!key || !value)
            return;
        var item = (_a = {},
            _a[key] = value,
            _a);
        output.push(item);
    });
    return output;
}
function parseExtension(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    var output = {};
    input.forEach(function (el) {
        var _a;
        var key = String((_a = el._attributes) === null || _a === void 0 ? void 0 : _a.application);
        delete el._attributes; //ignore '_attributes'
        var value = [el];
        output[key] = value;
    });
    return output;
}
function parseTrackLocationsOrIdentifiers(input) {
    //force array
    if (!Array.isArray(input)) {
        input = [input];
    }
    return input.map(function (el) { return String(el._text); });
}
function parseTrackList(tracks) {
    return tracks.map(function (track) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var t = {};
        if (track === null || track === void 0 ? void 0 : track.location) {
            t.location = parseTrackLocationsOrIdentifiers(track.location);
        }
        if (track === null || track === void 0 ? void 0 : track.identifier) {
            t.identifier = parseTrackLocationsOrIdentifiers(track.identifier);
        }
        if ((_a = track === null || track === void 0 ? void 0 : track.title) === null || _a === void 0 ? void 0 : _a._text) {
            t.title = String(track.title._text);
        }
        if ((_b = track === null || track === void 0 ? void 0 : track.creator) === null || _b === void 0 ? void 0 : _b._text) {
            t.creator = String(track.creator._text);
        }
        if ((_c = track === null || track === void 0 ? void 0 : track.annotation) === null || _c === void 0 ? void 0 : _c._text) {
            t.annotation = String(track.annotation._text);
        }
        if ((_d = track === null || track === void 0 ? void 0 : track.info) === null || _d === void 0 ? void 0 : _d._text) {
            t.info = String(track.info._text);
        }
        if ((_e = track === null || track === void 0 ? void 0 : track.image) === null || _e === void 0 ? void 0 : _e._text) {
            t.image = String(track.image._text);
        }
        if ((_f = track === null || track === void 0 ? void 0 : track.album) === null || _f === void 0 ? void 0 : _f._text) {
            t.album = String(track.album._text);
        }
        if ((_g = track === null || track === void 0 ? void 0 : track.trackNum) === null || _g === void 0 ? void 0 : _g._text) {
            t.trackNum = Number(track.trackNum._text);
        }
        if ((_h = track === null || track === void 0 ? void 0 : track.duration) === null || _h === void 0 ? void 0 : _h._text) {
            t.duration = Number(track.duration._text);
        }
        if (track === null || track === void 0 ? void 0 : track.link) {
            t.link = parseLinks(track.link);
        }
        if (track === null || track === void 0 ? void 0 : track.meta) {
            t.meta = parseMetas(track.meta);
        }
        if (track === null || track === void 0 ? void 0 : track.extension) {
            t.extension = parseExtension(track.extension);
        }
        return t;
    }).filter(Boolean); // filter out any undefined values
}
