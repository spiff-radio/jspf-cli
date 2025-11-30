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
exports.cleanNestedObject = cleanNestedObject;
exports.getPathExtension = getPathExtension;
exports.getPathFilename = getPathFilename;
exports.isJsonString = isJsonString;
//Recursively removes all empty and undefined properties from a JSON object.
function cleanNestedObject(obj) {
    obj = __assign({}, obj); //clone it
    Object.keys(obj).forEach(function (key) {
        // Get this value and its type
        var value = obj[key];
        var type = typeof value;
        if (type === "object" && value !== null && !Array.isArray(value)) {
            cleanNestedObject(value);
            if (value === undefined || value === '') {
                delete obj[key];
            }
            if (!Object.keys(value).length) {
                delete obj[key];
            }
        }
        else if (type === "undefined" || value === null || value === '') {
            // Undefined, null, or empty string, remove it
            delete obj[key];
        }
    });
    return obj;
}
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
