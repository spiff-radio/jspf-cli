"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const pls_parser_1 = __importDefault(require("./pls-parser"));
const pls_serializer_1 = __importDefault(require("./pls-serializer"));
class PlsConverter extends models_1.DataConverter {
    static format = 'pls';
    static contentType = 'audio/x-scpls';
    get(input) {
        return (0, pls_parser_1.default)(input);
    }
    set(dto) {
        return (0, pls_serializer_1.default)(dto);
    }
}
exports.default = PlsConverter;
