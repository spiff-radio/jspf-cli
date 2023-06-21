"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPlaylist = exports.importPlaylist = exports.getConverterByType = exports.getConverterTypes = void 0;
var models_1 = require("../entities/models");
var jspf_1 = __importDefault(require("./formats/jspf"));
var m3u8_1 = __importDefault(require("./formats/m3u8"));
var pls_1 = __importDefault(require("./formats/pls"));
var xspf_1 = __importDefault(require("./formats/xspf"));
var converters = [jspf_1.default, m3u8_1.default, pls_1.default, xspf_1.default];
// Get a flat array of all the converter types
function getConverterTypes() {
    return converters.flatMap(function (converter) { return converter.types; });
}
exports.getConverterTypes = getConverterTypes;
// Get a converter by a type
function getConverterByType(type) {
    var converter = converters.find(function (converter) { return converter.types.includes(type); });
    if (converter) {
        return converter;
    }
    else {
        throw new Error("Converter with type '".concat(type, "' was not found."));
    }
}
exports.getConverterByType = getConverterByType;
function importPlaylist(data, format, options) {
    if (format === void 0) { format = 'jspf'; }
    if (options === void 0) { options = { ignoreValidationErrors: false, stripInvalid: true }; }
    var converterClass = getConverterByType(format);
    var converter = new converterClass();
    var dto = converter.get(data);
    var playlist = new models_1.JspfPlaylist(dto);
    try {
        playlist.isValid(); //will eventually throw a JSONValidationErrors
    }
    catch (e) {
        if (e instanceof models_1.JSONValidationErrors) {
            if (!options.ignoreValidationErrors) {
                throw (e);
            }
        }
        else {
            throw (e);
        }
    }
    return playlist.toDTO();
}
exports.importPlaylist = importPlaylist;
function exportPlaylist(dto, format, options) {
    if (format === void 0) { format = 'jspf'; }
    if (options === void 0) { options = { ignoreValidationErrors: false, stripInvalid: true }; }
    var playlist = new models_1.JspfPlaylist(dto);
    try {
        playlist.isValid(); //will eventually throw a JSONValidationErrors
    }
    catch (e) {
        if (e instanceof models_1.JSONValidationErrors) {
            if (!options.ignoreValidationErrors) {
                throw (e);
            }
        }
        else {
            throw (e);
        }
    }
    var converterClass = getConverterByType(format);
    var converter = new converterClass();
    dto = playlist.toDTO();
    var data = converter.set(dto);
    return data;
}
exports.exportPlaylist = exportPlaylist;
