"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const xspf_parser_1 = __importDefault(require("./xspf-parser"));
const xspf_serializer_1 = __importDefault(require("./xspf-serializer"));
class XspfConverter extends models_1.DataConverter {
    static format = 'xspf';
    static contentType = 'application/xspf+xml;charset=utf-8';
    get(data) {
        return (0, xspf_parser_1.default)(data);
    }
    set(data) {
        return (0, xspf_serializer_1.default)(data);
    }
}
exports.default = XspfConverter;
