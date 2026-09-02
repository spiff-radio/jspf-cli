"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConvertersList = getConvertersList;
exports.getAvailableFormats = getAvailableFormats;
exports.getConverterByFormat = getConverterByFormat;
exports.importPlaylist = importPlaylist;
exports.importPlaylistWithErrors = importPlaylistWithErrors;
exports.exportPlaylist = exportPlaylist;
exports.exportPlaylistWithErrors = exportPlaylistWithErrors;
exports.exportPlaylistAsBlob = exportPlaylistAsBlob;
const models_1 = require("../entities/models");
const utils_1 = require("../utils");
const jspf_1 = __importDefault(require("./formats/jspf"));
const m3u_1 = __importDefault(require("./formats/m3u"));
const m3u8_1 = __importDefault(require("./formats/m3u8"));
const pls_1 = __importDefault(require("./formats/pls"));
const xspf_1 = __importDefault(require("./formats/xspf"));
// Typing this list against DataConverterStaticI is what enforces the `format`/`contentType`
// contract: a converter missing either one fails to compile here instead of failing at runtime.
const converters = [jspf_1.default, m3u_1.default, m3u8_1.default, pls_1.default, xspf_1.default];
function getConvertersList() {
    if (!Array.isArray(converters))
        return [];
    return converters.map(converter => ({
        format: converter.format,
        name: converter.name
    }));
}
function getAvailableFormats() {
    if (!Array.isArray(converters))
        return [];
    return converters.map(converter => converter.format);
}
// Get a converter by a type
function getConverterByFormat(type) {
    const converter = converters.find(converter => converter.format === type);
    if (converter) {
        return converter;
    }
    else {
        throw new Error(`Converter with type '${type}' was not found.`);
    }
}
function importPlaylist(data, format = 'jspf', options = { ignoreValidationErrors: false, stripInvalid: true }) {
    return importPlaylistWithErrors(data, format, options).data;
}
function importPlaylistWithErrors(data, format = 'jspf', options = { ignoreValidationErrors: false, stripInvalid: true }) {
    const converterClass = getConverterByFormat(format);
    const converter = new converterClass();
    const dto = converter.get(data);
    const { playlist, validationErrors } = validateAndClean(new models_1.JspfPlaylist(dto), dto, options);
    return {
        data: playlist.toDTO(),
        validationErrors
    };
}
function exportPlaylist(dto, format = 'jspf', options = { ignoreValidationErrors: false, stripInvalid: true }) {
    return exportPlaylistWithErrors(dto, format, options).data;
}
function exportPlaylistWithErrors(dto, format = 'jspf', options = { ignoreValidationErrors: false, stripInvalid: true }) {
    const { playlist, validationErrors } = validateAndClean(new models_1.JspfPlaylist(dto), dto, options);
    const converterClass = getConverterByFormat(format);
    const converter = new converterClass();
    const data = converter.set(playlist.toDTO());
    return {
        data: data,
        validationErrors
    };
}
// Shared by import/export: if the playlist is invalid and `stripInvalid` is set, rebuild it
// from a copy with the offending paths removed (see stripInvalidPaths) instead of the raw
// data - the original error is still reported so the caller knows what was dropped.
function validateAndClean(playlist, dto, options) {
    const validationErrors = playlist.getValidationErrors();
    if (!validationErrors) {
        return { playlist, validationErrors: null };
    }
    if (options.stripInvalid) {
        const strippedDto = (0, utils_1.stripInvalidPaths)(dto, validationErrors.issues);
        const cleaned = new models_1.JspfPlaylist(strippedDto);
        const remainingErrors = cleaned.getValidationErrors();
        if (remainingErrors && !options.ignoreValidationErrors) {
            throw new models_1.ZodValidationError('Validation failed', remainingErrors);
        }
        return { playlist: cleaned, validationErrors };
    }
    if (!options.ignoreValidationErrors) {
        throw new models_1.ZodValidationError('Validation failed', validationErrors);
    }
    return { playlist, validationErrors };
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
function exportPlaylistAsBlob(dto, format = 'jspf', options = { ignoreValidationErrors: false, stripInvalid: true }) {
    const converterClass = getConverterByFormat(format);
    let blobString = exportPlaylist(dto, format, options);
    // Check if we're in a Node.js environment without Blob support
    if (typeof Blob === 'undefined') {
        // Node.js environment - return Buffer instead
        // Buffer is available in all Node.js versions
        return Buffer.from(blobString, 'utf8');
    }
    // Browser environment or Node.js 18+ - use native Blob
    let blob = new Blob([blobString], {
        type: converterClass.contentType
    });
    return blob;
}
