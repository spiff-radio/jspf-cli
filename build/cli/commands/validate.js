"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const models_1 = require("../../entities/models");
const index_1 = require("../../convert/index");
const index_2 = require("../index");
async function validateCommand(argv) {
    let { path_in = '', format_in = '' } = argv;
    //Check file paths
    try {
        path_in = (0, index_2.validateOptionPath)('path_in', path_in, true);
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
    if (!path_in || !format_in) {
        process.exit(1);
    }
    //conversion IN
    const input_data = await (0, index_2.readFile)(path_in);
    let dto = {};
    try {
        dto = (0, index_1.importPlaylist)(input_data, format_in, {
            ignoreValidationErrors: true
        });
    }
    catch (e) {
        console.error('Unable to load data.');
        throw e;
    }
    const playlist = new models_1.JspfPlaylist(dto);
    //validation
    const fileName = (0, utils_1.getPathFilename)(path_in);
    try {
        playlist.isValid(); //will eventually throw a ZodValidationError
    }
    catch (e) {
        if (e instanceof models_1.ZodValidationError) {
            console.info(e.errors.issues);
            console.log();
            console.error(`Your playlist '${fileName}' is not valid.  Check the JSPF specs here: ${constants_1.JSPF_SPECS_URL}`);
            console.log();
            process.exit(1);
        }
        else {
            throw (e);
        }
    }
    console.log(`Congratulations, your playlist '${fileName}' is valid!  ...Sometimes, life is beautiful!`);
    console.log();
    process.exit(0);
}
module.exports = {
    command: 'validate',
    describe: 'Validate a playlist file against the JSPF specifications.',
    builder: (yargs) => {
        return yargs;
    },
    handler: validateCommand
};
