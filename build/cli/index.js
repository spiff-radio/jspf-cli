#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.validateOptionFormat = validateOptionFormat;
exports.validateOptionPath = validateOptionPath;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const figlet_1 = __importDefault(require("figlet"));
const constants_1 = require("../constants");
const index_1 = require("../convert/index");
const utils_1 = require("../utils");
// Read package version
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const PACKAGE_VERSION = packageJson.version;
async function readFile(path) {
    try {
        const data = await fs.promises.readFile(path, 'utf8');
        return data;
    }
    catch (error) {
        console.error('Failed to read input file.');
        throw error;
    }
}
async function writeFile(path, fileData) {
    try {
        await fs.promises.writeFile(path, fileData);
    }
    catch (error) {
        console.error('Failed to write output file.');
        throw error;
    }
}
function validateOptionFormat(name, value, path) {
    const allowedFormats = (0, index_1.getAvailableFormats)();
    //if value is not set, try to get it from the file path extension
    if (!value && path) {
        value = (0, utils_1.getPathExtension)(path) ?? '';
    }
    if (!value) {
        throw new Error(`❌ Please set a value for --${name}.`);
    }
    if (!allowedFormats.includes(value)) {
        throw new Error(`❌ Invalid value '${value}' for '--${name}'. Available formats: ${allowedFormats.join(', ')}.`);
    }
    return value;
}
function validateOptionPath(name, value, existsCheck = false) {
    if (!value) {
        throw new Error(`❌ Please set a value for --${name}.`);
    }
    if (existsCheck && !fs.existsSync(value)) {
        throw new Error(`❌ The path '${value}' specified in '--${name}' does not exist.`);
    }
    return value;
}
async function cli() {
    const allowedFormats = (0, index_1.getAvailableFormats)();
    console.clear();
    console.log(figlet_1.default.textSync('JSPF CLI', { horizontalLayout: 'full' }));
    const argv = (0, helpers_1.hideBin)(process.argv);
    await (0, yargs_1.default)(argv)
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
        describe: `The input format for conversion. If '--path_in' has an extension, this can be omitted.`,
        choices: allowedFormats,
        type: 'string'
    })
        .help('h')
        .alias('h', 'help')
        .epilogue(`Version: ${PACKAGE_VERSION}`)
        .epilogue(`JSPF version: ${constants_1.JSPF_VERSION} - ${constants_1.XSPF_URL}`)
        .epilogue(`for more information or issues, reach out ${constants_1.REPO_URL}`)
        .parseAsync();
}
cli().catch((e) => {
    console.error("❌ ERROR");
    console.error(e);
    console.log();
    console.info(`👹 That was a bug. Report it at ${constants_1.ISSUES_URL}`);
    process.exit(1);
});
