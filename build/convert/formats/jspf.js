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
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../entities/models");
var models_2 = require("../models");
var JspfConverter = /** @class */ (function (_super) {
    __extends(JspfConverter, _super);
    function JspfConverter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfConverter.prototype.get = function (data) {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            console.error('Unable to parse JSON.');
            throw e;
        }
        var jspf = new models_1.Jspf(data);
        var json = jspf.toJSON();
        return json.playlist;
    };
    JspfConverter.prototype.set = function (playlistData) {
        var jspf = new models_1.Jspf();
        jspf.playlist = new models_1.JspfPlaylist(playlistData);
        var cleaned = jspf.toDTO();
        return JSON.stringify(cleaned, null, 4);
    };
    JspfConverter.type = 'jspf';
    JspfConverter.contentType = 'application/jspf+json;charset=utf-8';
    return JspfConverter;
}(models_2.DataConverter));
exports.default = JspfConverter;
