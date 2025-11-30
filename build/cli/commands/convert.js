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
var index_1 = require("../../convert/index");
var models_1 = require("../../entities/models");
var index_2 = require("../index");
var allowedTypes = (0, index_1.getConverterTypes)();
function convertCommand(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path_in, _b, path_out, _c, format_in, _d, format_out, _e, strict, _f, stripInvalid, _g, quiet, input_data, dto, result, groupedWarnings_1, output_data, result, groupedWarnings_2;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _a = argv.path_in, path_in = _a === void 0 ? '' : _a, _b = argv.path_out, path_out = _b === void 0 ? '' : _b, _c = argv.format_in, format_in = _c === void 0 ? '' : _c, _d = argv.format_out, format_out = _d === void 0 ? '' : _d, _e = argv.strict, strict = _e === void 0 ? false : _e, _f = argv.stripInvalid, stripInvalid = _f === void 0 ? true : _f, _g = argv.quiet, quiet = _g === void 0 ? false : _g;
                    //Check file paths
                    try {
                        path_in = (0, index_2.validateOptionPath)('path_in', path_in, true);
                    }
                    catch (e) {
                        console.error(e);
                        process.exit(1);
                    }
                    try {
                        path_out = (0, index_2.validateOptionPath)('path_out', path_out);
                    }
                    catch (e) {
                        console.error(e);
                        process.exit(1);
                    }
                    //check file formats
                    try {
                        format_in = (0, index_2.validateOptionFormat)('format_in', format_in, path_in);
                    }
                    catch (e) {
                        console.error(e);
                        process.exit(1);
                    }
                    try {
                        format_out = (0, index_2.validateOptionFormat)('format_out', format_out, path_out);
                    }
                    catch (e) {
                        console.error(e);
                        process.exit(1);
                    }
                    if (!path_in || !path_out || !format_in || !format_out) {
                        process.exit(1);
                    }
                    // Check if input and output formats are the same
                    if (format_in === format_out) {
                        console.log("Input and output formats are the same (".concat(format_in, "). Skipping conversion."));
                        console.log();
                        process.exit(0);
                    }
                    return [4 /*yield*/, (0, index_2.readFile)(path_in)];
                case 1:
                    input_data = _h.sent();
                    dto = {};
                    try {
                        result = (0, index_1.importPlaylistWithErrors)(input_data, format_in, {
                            ignoreValidationErrors: !strict, // Default: ignore errors (show warnings), strict: abort
                            stripInvalid: stripInvalid
                        });
                        dto = result.data;
                        // Show warnings if validation errors exist and not quiet
                        if (result.validationErrors && !quiet) {
                            console.warn("⚠️  Validation warnings for input playlist:");
                            groupedWarnings_1 = new Map();
                            result.validationErrors.issues.forEach(function (issue) {
                                var path = issue.path.length > 0 ? issue.path.join('.') : 'root';
                                var key = issue.message;
                                if (!groupedWarnings_1.has(key)) {
                                    groupedWarnings_1.set(key, []);
                                }
                                groupedWarnings_1.get(key).push(path);
                            });
                            // Display grouped warnings
                            groupedWarnings_1.forEach(function (paths, message) {
                                if (paths.length === 1) {
                                    console.warn("  - ".concat(paths[0], ": ").concat(message));
                                }
                                else {
                                    console.warn("  - ".concat(paths.length, " fields: ").concat(message));
                                    // Show first few examples
                                    var examples = paths.slice(0, 3);
                                    examples.forEach(function (path) {
                                        console.warn("    \u2022 ".concat(path));
                                    });
                                    if (paths.length > 3) {
                                        console.warn("    ... and ".concat(paths.length - 3, " more"));
                                    }
                                }
                            });
                            console.log();
                        }
                    }
                    catch (e) {
                        if (e instanceof models_1.ZodValidationError) {
                            // Abort only if --strict is set
                            if (strict) {
                                console.error("❌ The input playlist is not valid, conversion has been stopped.");
                                if (!quiet) {
                                    console.error("Validation errors:");
                                    e.errors.issues.forEach(function (issue) {
                                        var path = issue.path.length > 0 ? issue.path.join('.') : 'root';
                                        console.error("  - ".concat(path, ": ").concat(issue.message));
                                    });
                                }
                                console.log();
                                console.error("Remove '--strict' to continue with warnings.");
                                console.log();
                                process.exit(1);
                            }
                            else {
                                // This shouldn't happen in default mode, but handle it anyway
                                throw (e);
                            }
                        }
                        else {
                            throw (e);
                        }
                    }
                    output_data = undefined;
                    try {
                        result = (0, index_1.exportPlaylistWithErrors)(dto, format_out, {
                            ignoreValidationErrors: !strict, // Default: ignore errors (show warnings), strict: abort
                            stripInvalid: stripInvalid
                        });
                        output_data = result.data;
                        // Show warnings if validation errors exist and not quiet
                        if (result.validationErrors && !quiet) {
                            console.warn("⚠️  Validation warnings for output playlist:");
                            groupedWarnings_2 = new Map();
                            result.validationErrors.issues.forEach(function (issue) {
                                var path = issue.path.length > 0 ? issue.path.join('.') : 'root';
                                var key = issue.message;
                                if (!groupedWarnings_2.has(key)) {
                                    groupedWarnings_2.set(key, []);
                                }
                                groupedWarnings_2.get(key).push(path);
                            });
                            // Display grouped warnings
                            groupedWarnings_2.forEach(function (paths, message) {
                                if (paths.length === 1) {
                                    console.warn("  - ".concat(paths[0], ": ").concat(message));
                                }
                                else {
                                    console.warn("  - ".concat(paths.length, " fields: ").concat(message));
                                    // Show first few examples
                                    var examples = paths.slice(0, 3);
                                    examples.forEach(function (path) {
                                        console.warn("    \u2022 ".concat(path));
                                    });
                                    if (paths.length > 3) {
                                        console.warn("    ... and ".concat(paths.length - 3, " more"));
                                    }
                                }
                            });
                            console.log();
                        }
                    }
                    catch (e) {
                        if (e instanceof models_1.ZodValidationError) {
                            // Abort only if --strict is set
                            if (strict) {
                                console.error("❌ The output playlist is not valid, conversion has been stopped.");
                                if (!quiet) {
                                    console.error("Validation errors:");
                                    e.errors.issues.forEach(function (issue) {
                                        var path = issue.path.length > 0 ? issue.path.join('.') : 'root';
                                        console.error("  - ".concat(path, ": ").concat(issue.message));
                                    });
                                }
                                console.log();
                                console.error("Remove '--strict' to continue with warnings.");
                                console.log();
                                process.exit(1);
                            }
                            else {
                                // This shouldn't happen in default mode, but handle it anyway
                                throw (e);
                            }
                        }
                        else {
                            throw (e);
                        }
                    }
                    if (!output_data) {
                        console.error("Failed to generate output data.");
                        process.exit(1);
                    }
                    //output
                    return [4 /*yield*/, (0, index_2.writeFile)(path_out, output_data)];
                case 2:
                    //output
                    _h.sent();
                    console.log("\uD83D\uDDF8 SUCCESSFULLY CONVERTED FILE! ( ".concat(format_in, " > ").concat(format_out, ")"));
                    console.log();
                    console.log(path_out);
                    console.log();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    command: 'convert',
    describe: 'Convert a playlist file to another format.',
    builder: function (yargs) {
        return yargs
            .option('path_out', {
            describe: 'Path to the output file',
            type: 'string',
            alias: 'o'
        })
            .option('format_out', {
            describe: "The output format for conversion. If '--path_out' has an extension, this can be omitted.",
            choices: allowedTypes,
            type: 'string'
        })
            .option('strict', {
            describe: 'Abort conversion if validation fails. By default, conversion continues with warnings.',
            type: 'boolean',
            default: false
        })
            .option('strip-invalid', {
            describe: 'Strip invalid values that do not conform to the JSPF specifications',
            type: 'boolean',
            default: true
        })
            .option('quiet', {
            describe: 'Suppress validation warnings. Only errors will be shown.',
            type: 'boolean',
            default: false
        });
        /*
        .check((argv) => {
          if (argv.format_in && !allowedTypes.includes(argv.format_in)) {
            throw new Error(`Invalid input format: ${argv.format_in}`);
          }
          if (argv.format_out && !allowedTypes.includes(argv.format_out)) {
            throw new Error(`Invalid output format: ${argv.format_out}`);
          }
          return true;
        });
        */
    },
    handler: convertCommand
};
