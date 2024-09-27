"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUri = isUri;
exports.IsUri = IsUri;
exports.isSinglePropertyObject = isSinglePropertyObject;
exports.IsSinglePropertyObject = IsSinglePropertyObject;
//custom decorator
var class_validator_1 = require("class-validator");
var url_1 = require("url");
/**
 * Checks if a given value is a date.
 */
function isUri(value, options) {
    return value instanceof url_1.URL;
}
/**
 * Checks if a value is a date.
 */
function IsUri(options, validationOptions) {
    return (0, class_validator_1.ValidateBy)({
        name: 'isUri',
        constraints: [options],
        validator: {
            validate: function (value, args) { return isUri(value, args === null || args === void 0 ? void 0 : args.constraints[0]); },
            defaultMessage: (0, class_validator_1.buildMessage)(function (eachPrefix) { return eachPrefix + '$property must be an URI'; }, validationOptions),
        },
    }, validationOptions);
}
function isSinglePropertyObject(value) {
    var keys = Object.keys(value);
    return keys.length === 1;
}
function IsSinglePropertyObject(validationOptions) {
    return (0, class_validator_1.ValidateBy)({
        name: 'isSinglePropertyObject',
        validator: {
            validate: function (value, args) { return isSinglePropertyObject(value); },
            defaultMessage: (0, class_validator_1.buildMessage)(function (eachPrefix) { return eachPrefix + '$property must have a single property defined.'; }, validationOptions),
        },
    }, validationOptions);
}
