"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformPair = exports.TransformDate = exports.TransformUri = void 0;
var class_transformer_1 = require("class-transformer");
var models_1 = require("./models");
var TransformUri = function (options) {
    if (options === void 0) { options = { each: false }; }
    var toPlain = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (!options.each) {
            return value.toString();
        }
        else {
            return value.map(function (item) { return item.toString(); });
        }
    }, { toPlainOnly: true });
    var toClass = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (!options.each) {
            return new URL(value);
        }
        else {
            return value.map(function (item) { return new URL(item); });
        }
    }, { toClassOnly: true });
    return function (target, propertyKey) {
        toPlain(target, propertyKey);
        toClass(target, propertyKey);
    };
};
exports.TransformUri = TransformUri;
var TransformDate = function (target, propertyKey) {
    var toPlain = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        return value.toISOString();
    }, { toPlainOnly: true });
    var toClass = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        return new Date(value);
    }, { toClassOnly: true });
    toPlain(target, propertyKey);
    toClass(target, propertyKey);
};
exports.TransformDate = TransformDate;
/*
Some JSPF datas (metas, attribution, links...) are arrays of key-value pairs.
It's difficult to handle them since the name of the properties are unknown.
So convert them to an object with a 'name' and 'data' property.
*/
//convert key-value pairs to an object extending SinglePair
function pairToSingle(pair, options) {
    if (options === void 0) { options = { each: false, type: models_1.SinglePair }; }
    var name = Object.keys(pair)[0];
    var data = pair[name];
    var hash = { rel: name, content: data };
    return (0, class_transformer_1.plainToClass)(options.type, hash);
}
//converts an array of SinglePair objects to build an object of key-value pairs from
function SingleToPair(instance) {
    var hash = {};
    hash[instance.rel] = instance.content;
    return hash;
}
var TransformPair = function (options) {
    if (options === void 0) { options = { each: false, type: models_1.SinglePair }; }
    var toPlain = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (!options.each) {
            return SingleToPair(value);
        }
        else {
            return value.map(function (item) { return SingleToPair(item); });
        }
    }, { toPlainOnly: true });
    var toClass = (0, class_transformer_1.Transform)(function (_a) {
        var value = _a.value;
        if (!options.each) {
            return pairToSingle(value, options);
        }
        else {
            return value.map(function (item) { return pairToSingle(item, options); });
        }
    }, { toClassOnly: true });
    return function (target, propertyKey) {
        toPlain(target, propertyKey);
        toClass(target, propertyKey);
    };
};
exports.TransformPair = TransformPair;
