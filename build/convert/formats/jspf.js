"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../entities/models");
const models_2 = require("../models");
class JspfConverter extends models_2.DataConverter {
    static format = 'jspf';
    static contentType = 'application/jspf+json;charset=utf-8';
    get(data) {
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        }
        catch (e) {
            console.error('Unable to parse JSON.');
            throw e;
        }
        const jspf = new models_1.Jspf(parsedData);
        const dto = jspf.toDTO();
        return dto.playlist;
    }
    set(playlistData) {
        const jspf = new models_1.Jspf({ playlist: playlistData });
        const cleaned = jspf.toDTO();
        return JSON.stringify(cleaned, null, 4);
    }
}
exports.default = JspfConverter;
