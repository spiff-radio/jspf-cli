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
var xml_js_1 = require("xml-js");
var constants_1 = require("../../constants");
var models_1 = require("../../entities/models");
function serializeXSPF(playlistData) {
    var jspf = new models_1.Jspf();
    jspf.playlist = new models_1.JspfPlaylist(playlistData);
    var xspfJSON = {
        //add XML declaration
        _declaration: {
            _attributes: {
                version: "1.0",
                encoding: "utf-8"
            }
        },
        //add playlist attributes
        playlist: __assign(__assign({}, jspf.playlist), { _attributes: {
                version: constants_1.XSPF_VERSION,
                xmlns: constants_1.XSPF_XMLNS
            } })
    };
    // Move tracks within a trackList node
    if (xspfJSON.playlist) {
        if (xspfJSON.playlist.track) {
            xspfJSON.playlist.trackList = { track: xspfJSON.playlist.track };
            delete xspfJSON.playlist.track;
        }
    }
    // Update some of the single nodes recursively
    updateNodes(xspfJSON.playlist);
    // Use json2xml to convert JspfJson to XML
    var xml = (0, xml_js_1.json2xml)(JSON.stringify(xspfJSON), { compact: true, spaces: 4 });
    return xml;
}
exports.default = serializeXSPF;
function updateNodes(data) {
    if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
            updateNodes(data[i]);
        }
    }
    else if (typeof data === 'object') {
        var _loop_1 = function (key) {
            //process the content of those nodes
            if (['link', 'meta', 'extension', 'attribution'].includes(key)) {
                if (Array.isArray(data[key])) {
                    data[key] = data[key].map(function (item) { return updateSingle(item, key); });
                }
                else {
                    data[key] = updateSingle(data[key], key);
                }
            }
            updateNodes(data[key]);
        };
        for (var key in data) {
            _loop_1(key);
        }
    }
}
function updateSingle(data, type) {
    if (!data)
        return;
    var prop_name = Object.keys(data)[0];
    var prop_value = data[prop_name];
    switch (type) {
        case 'link':
            return {
                _attributes: {
                    rel: prop_name,
                    href: prop_value
                }
            };
            break;
        case 'meta':
            return {
                _attributes: {
                    rel: prop_name,
                    content: prop_value
                }
            };
            break;
        case 'extension':
            //TOUFIX
            break;
        case 'attribution':
            //TOUFIX
            break;
        default:
            return data;
    }
}
