#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.validateOptionFormat = validateOptionFormat;
exports.validateOptionPath = validateOptionPath;
var yargs_1 = __importDefault(require("yargs"));
var helpers_1 = require("yargs/helpers");
require("reflect-metadata");
var fs = require('fs');
var clear = require('clear');
var figlet = require('figlet');
var constants_1 = require("../constants");
var index_1 = require("../convert/index");
var utils_1 = require("../utils");
function readFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.promises.readFile(path, 'utf8')];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to read input file.');
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function writeFile(path, fileData) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.promises.writeFile(path, fileData)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Failed to write output file.');
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function validateOptionFormat(name, value, path) {
    var _a;
    var allowedTypes = (0, index_1.getConverterTypes)();
    //if value is not set, try to get it from the file path extension
    if (!value && path) {
        value = (_a = (0, utils_1.getPathExtension)(path)) !== null && _a !== void 0 ? _a : '';
    }
    if (!value) {
        throw new Error("\u274C Please set a value for --".concat(name, "."));
    }
    if (!allowedTypes.includes(value)) {
        throw new Error("\u274C Invalid value '".concat(value, "' for '--").concat(name, "'. Available formats: ").concat(allowedTypes.join(', '), "."));
    }
    return value;
}
function validateOptionPath(name, value, existsCheck) {
    if (existsCheck === void 0) { existsCheck = false; }
    if (!value) {
        throw new Error("\u274C Please set a value for --".concat(name, "."));
    }
    if (existsCheck && !fs.existsSync(value)) {
        throw new Error("\u274C The path '".concat(value, "' specified in '--").concat(name, "' does not exist."));
    }
    return value;
}
function cli() {
    return __awaiter(this, void 0, void 0, function () {
        var allowedTypes, argv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowedTypes = (0, index_1.getConverterTypes)();
                    clear();
                    console.log(figlet.textSync('JSPF CLI', { horizontalLayout: 'full' }));
                    argv = (0, helpers_1.hideBin)(process.argv);
                    return [4 /*yield*/, (0, yargs_1.default)(argv)
                            .scriptName('jspf-cli')
                            .usage('$0 <cmd> [args]')
                            .commandDir('./commands')
                            .demandCommand(1, 'You need at least one command before moving on')
                            .recommendCommands()
                            .option('path_in', {
                            describe: 'Path to the input file',
                            type: 'string',
                            alias: 'i',
                            demandOption: true
                        })
                            .option('format_in', {
                            describe: "The input format for conversion. If '--path_in' has an extension, this can be omitted.",
                            choices: allowedTypes,
                            type: 'string'
                        })
                            .help('h')
                            .alias('h', 'help')
                            .epilogue("JSPF version: ".concat(constants_1.JSPF_VERSION, " - ").concat(constants_1.XSPF_URL))
                            .epilogue("for more information or issues, reach out ".concat(constants_1.REPO_URL))
                            .parseAsync()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
cli().catch(function (e) {
    console.error("❌ ERROR");
    console.error(e);
    console.log();
    console.info("\uD83D\uDC79 That was a bug. Report it at ".concat(constants_1.ISSUES_URL));
    process.exit();
});
