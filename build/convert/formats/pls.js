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
var pls_parser_1 = __importDefault(require("./pls-parser"));
var pls_serializer_1 = __importDefault(require("./pls-serializer"));
var PlsConverter = /** @class */ (function (_super) {
    __extends(PlsConverter, _super);
    function PlsConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlsConverter.prototype.get = function (input) {
        return (0, pls_parser_1.default)(input);
    };
    PlsConverter.prototype.set = function (dto) {
        return (0, pls_serializer_1.default)(dto);
    };
    PlsConverter.type = 'pls';
    PlsConverter.contentType = 'audio/x-scpls';
    return PlsConverter;
}(models_1.DataConverter));
exports.default = PlsConverter;
