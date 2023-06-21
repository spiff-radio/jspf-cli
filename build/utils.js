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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChildSchema = exports.getPathFilename = exports.getPathExtension = exports.cleanNestedObject = void 0;
var merge_1 = __importDefault(require("lodash/merge"));
var constants_1 = require("./constants");
var jspf_schema_json_1 = __importDefault(require("./entities/jspf-schema.json"));
//Recursively removes all empty and undefined properties from a JSON object.
function cleanNestedObject(obj) {
    obj = __assign({}, obj); //clone it
    Object.keys(obj).forEach(function (key) {
        // Get this value and its type
        var value = obj[key];
        var type = typeof value;
        if (type === "object") {
            cleanNestedObject(value);
            if (value === undefined || value === '') {
                delete obj[key];
            }
            if (!Object.keys(value).length) {
                delete obj[key];
            }
        }
        else if (type === "undefined") {
            // Undefined, remove it
            delete obj[key];
        }
    });
    return obj;
}
exports.cleanNestedObject = cleanNestedObject;
//get extension out of a file path
function getPathExtension(filePath) {
    var match = /[^/.]\.([^/.]+)$/.exec(filePath);
    if (match) {
        return match[1].toLowerCase();
    }
    return null;
}
exports.getPathExtension = getPathExtension;
//get filename out of a file path
function getPathFilename(filePath) {
    var match = filePath.match(/[/\\]([^/\\]+)$/); //both unix & windows
    if (match) {
        return match[1];
    }
    return filePath;
}
exports.getPathFilename = getPathFilename;
//Given a JSON schema (or using the default one) and a path, return a new schema - including local references.
//TOUFIX TOUCHECK use a package for this ?
function getChildSchema(path, inputSchema) {
    var _a;
    // If inputSchema is not provided, use the default schema
    inputSchema = inputSchema !== null && inputSchema !== void 0 ? inputSchema : jspf_schema_json_1.default;
    var rootSchema = inputSchema;
    // If path is empty, return the full rootSchema
    if (path === '')
        return rootSchema;
    var getTargetContent = function (path, rootSchema) {
        // Split the path by '.' to get the nested keys
        var keys = path.split('/');
        // Traverse the rootSchema to get the child schema
        var outputSchema = __assign({}, rootSchema);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (!outputSchema[key]) {
                throw new Error("Path \"".concat(path, "\" does not exist in the schema"));
            }
            outputSchema = outputSchema[key];
        }
        return outputSchema;
    };
    //From an object of paths, return a new filtered schema
    var filterSchema = function (paths, fragmentSchema) {
        var schema = {};
        paths.forEach(function (path) {
            var pathKeys = path.split('/');
            var currentSchema = fragmentSchema;
            var filteredSchema = schema;
            for (var i = 0; i < pathKeys.length; i++) {
                var pathKey = pathKeys[i];
                if (currentSchema.hasOwnProperty(pathKey)) {
                    if (i === pathKeys.length - 1) {
                        filteredSchema[pathKey] = currentSchema[pathKey];
                    }
                    else {
                        if (!filteredSchema.hasOwnProperty(pathKey)) {
                            filteredSchema[pathKey] = {};
                        }
                        filteredSchema = filteredSchema[pathKey];
                        currentSchema = currentSchema[pathKey];
                    }
                }
                else {
                    break;
                }
            }
        });
        return schema;
    };
    //get a list of local references for schema
    var getLocalReferences = function (path, schema) {
        var list = [];
        var searchLocalReferences = function (prop) {
            if (typeof prop === 'object' && prop !== null && !Array.isArray(prop)) {
                for (var _i = 0, _a = Object.entries(prop); _i < _a.length; _i++) {
                    var _b = _a[_i], propKey = _b[0], propValue = _b[1];
                    var propValue_1 = prop[propKey];
                    if (propKey === '$ref') {
                        var refPath = propValue_1.replace('#/', '');
                        list.push(refPath);
                    }
                    else {
                        searchLocalReferences(propValue_1);
                    }
                }
            }
            else if (Array.isArray(prop)) {
                prop.forEach(function (item) { return searchLocalReferences(item); });
            }
        };
        searchLocalReferences(schema);
        //get every local reference
        return filterSchema(list, rootSchema);
    };
    var contentSchema = getTargetContent(path, rootSchema);
    var childReferences = getLocalReferences(path, contentSchema);
    //Add schema version from original vile
    var schemaVersion = (_a = rootSchema.$schema) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_JSON_SCHEMA_VERSION;
    var childSchema = {
        $schema: schemaVersion
    };
    childSchema = (0, merge_1.default)(childSchema, contentSchema, childReferences);
    return childSchema;
}
exports.getChildSchema = getChildSchema;
