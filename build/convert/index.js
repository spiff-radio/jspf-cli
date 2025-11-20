"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConverterTypes = getConverterTypes;
exports.getConverterByType = getConverterByType;
exports.importPlaylist = importPlaylist;
exports.exportPlaylist = exportPlaylist;
exports.exportPlaylistAsBlob = exportPlaylistAsBlob;
var models_1 = require("../entities/models");
var jspf_1 = __importDefault(require("./formats/jspf"));
var m3u_1 = __importDefault(require("./formats/m3u"));
var m3u8_1 = __importDefault(require("./formats/m3u8"));
var pls_1 = __importDefault(require("./formats/pls"));
var xspf_1 = __importDefault(require("./formats/xspf"));
var converters = [jspf_1.default, m3u_1.default, m3u8_1.default, pls_1.default, xspf_1.default];
// Get a flat array of all the converter types
function getConverterTypes() {
    return converters.map(function (converter) { return converter.type; });
}
// Get a converter by a type
function getConverterByType(type) {
    var converter = converters.find(function (converter) { return converter.type === type; });
    if (converter) {
        return converter;
    }
    else {
        throw new Error("Converter with type '".concat(type, "' was not found."));
    }
}
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
/**
 * Export playlist as a Blob-like object (for browser environments).
 * Note: In Node.js environments where Blob is not available, this returns a Buffer instead.
 * For Node.js usage, consider using exportPlaylist() directly and handling the string result.
 *
 * @param dto - The playlist data transfer object
 * @param format - The output format (default: 'jspf')
 * @param options - Conversion options
 * @returns Blob in browser environments, Buffer in Node.js environments without Blob support
 */
function exportPlaylistAsBlob(dto, format, options) {
    if (format === void 0) { format = 'jspf'; }
    if (options === void 0) { options = { ignoreValidationErrors: false, stripInvalid: true }; }
    var converterClass = getConverterByType(format);
    var blobString = exportPlaylist(dto, format, options);
    // Check if we're in a Node.js environment without Blob support
    if (typeof Blob === 'undefined') {
        // Node.js environment - return Buffer instead
        // Buffer is available in all Node.js versions
        return Buffer.from(blobString, 'utf8');
    }
    // Browser environment or Node.js 18+ - use native Blob
    var blob = new Blob([blobString], {
        type: converterClass.contentType
    });
    return blob;
}
