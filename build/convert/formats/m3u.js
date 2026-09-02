"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const m3u8_parser_1 = __importDefault(require("./m3u8-parser"));
const m3u8_serializer_1 = __importDefault(require("./m3u8-serializer"));
class M3uConverter extends models_1.DataConverter {
    static format = 'm3u';
    static contentType = 'audio/mpegurl';
    get(input) {
        return (0, m3u8_parser_1.default)(input);
    }
    set(dto) {
        return (0, m3u8_serializer_1.default)(dto);
    }
}
exports.default = M3uConverter;
