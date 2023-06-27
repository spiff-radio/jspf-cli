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
var m3u8_parser_1 = __importDefault(require("./m3u8-parser"));
var m3u8_serializer_1 = __importDefault(require("./m3u8-serializer"));
var M3u8Converter = /** @class */ (function (_super) {
    __extends(M3u8Converter, _super);
    function M3u8Converter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    M3u8Converter.prototype.get = function (input) {
        return (0, m3u8_parser_1.default)(input);
    };
    M3u8Converter.prototype.set = function (dto) {
        return (0, m3u8_serializer_1.default)(dto);
    };
    M3u8Converter.type = 'm3u8';
    M3u8Converter.contentType = 'application/vnd.apple.mpegurl';
    return M3u8Converter;
}(models_1.DataConverter));
exports.default = M3u8Converter;
