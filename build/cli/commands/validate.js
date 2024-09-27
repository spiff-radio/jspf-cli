"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var models_1 = require("../../entities/models");
var index_1 = require("../../convert/index");
var index_2 = require("../index");
function validateCommand(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path_in, _b, format_in, input_data, dto, playlist, fileName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = argv.path_in, path_in = _a === void 0 ? '' : _a, _b = argv.format_in, format_in = _b === void 0 ? '' : _b;
                    //Check file paths
                    try {
                        path_in = (0, index_2.validateOptionPath)('path_in', path_in, true);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    //check file formats
                    try {
                        format_in = (0, index_2.validateOptionFormat)('format_in', format_in, path_in);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    if (!path_in || !format_in) {
                        process.exit();
                    }
                    return [4 /*yield*/, (0, index_2.readFile)(path_in)];
                case 1:
                    input_data = _c.sent();
                    dto = {};
                    try {
                        dto = (0, index_1.importPlaylist)(input_data, format_in, {
                            ignoreValidationErrors: true
                        });
                    }
                    catch (e) {
                        console.error('Unable to load data.');
                        throw e;
                    }
                    playlist = new models_1.JspfPlaylist(dto);
                    fileName = (0, utils_1.getPathFilename)(path_in);
                    try {
                        playlist.isValid(); //will eventually throw a JSONValidationErrors
                    }
                    catch (e) {
                        if (e instanceof models_1.JSONValidationErrors) {
                            console.info(e.validation.errors);
                            console.log();
                            console.error("Your playlist '".concat(fileName, "' is not valid.  Check the JSPF specs here: ").concat(constants_1.JSPF_SPECS_URL));
                            console.log();
                            process.exit();
                        }
                        else {
                            throw (e);
                        }
                    }
                    console.error("Congratulations, your playlist '".concat(fileName, "' is valid!  ...Sometimes, life is beautiful!"));
                    console.log();
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    command: 'validate',
    describe: 'Validate a playlist file against the JSPF specifications.',
    builder: function (yargs) {
        return yargs;
    },
    handler: validateCommand
};
