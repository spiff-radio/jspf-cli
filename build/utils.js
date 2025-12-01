"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathExtension = getPathExtension;
exports.getPathFilename = getPathFilename;
exports.isJsonString = isJsonString;
//get extension out of a file path
function getPathExtension(filePath) {
    var match = /[^/.]\.([^/.]+)$/.exec(filePath);
    if (match) {
        return match[1].toLowerCase();
    }
    return null;
}
//get filename out of a file path
function getPathFilename(filePath) {
    var match = filePath.match(/[/\\]([^/\\]+)$/); //both unix & windows
    if (match) {
        return match[1];
    }
    return filePath;
}
/**
 * Check if a string is a JSON string (starts and ends with double quotes)
 * @param str - The string to check
 * @returns true if the string appears to be a JSON string
 */
function isJsonString(str) {
    str = str.trim();
    return str.length >= 2 && str[0] === '"' && str[str.length - 1] === '"';
}
