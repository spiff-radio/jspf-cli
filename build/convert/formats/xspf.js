"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../models");
var xspf_parser_1 = __importDefault(require("./xspf-parser"));
var xspf_serializer_1 = __importDefault(require("./xspf-serializer"));
var XspfConverter = /** @class */ (function (_super) {
    __extends(XspfConverter, _super);
    function XspfConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    XspfConverter.prototype.get = function (data) {
        return (0, xspf_parser_1.default)(data);
    };
    XspfConverter.prototype.set = function (data) {
        return (0, xspf_serializer_1.default)(data);
    };
    XspfConverter.type = 'xspf';
    XspfConverter.contentType = 'application/xspf+xml;charset=utf-8';
    return XspfConverter;
}(models_1.DataConverter));
exports.default = XspfConverter;
