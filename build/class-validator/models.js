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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JspfPlaylist = exports.JspfTrack = exports.JspfExtension = exports.JspfLink = exports.JspfMeta = exports.JspfAttribution = exports.SinglePair = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var transform_custom_1 = require("./transform-custom");
var SinglePair = /** @class */ (function () {
    function SinglePair(data) {
        (0, class_transformer_1.plainToClassFromExist)(this, data);
    }
    return SinglePair;
}());
exports.SinglePair = SinglePair;
var JspfAttribution = exports.JspfAttribution = /** @class */ (function (_super) {
    __extends(JspfAttribution, _super);
    function JspfAttribution() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], JspfAttribution.prototype, "rel", void 0);
    __decorate([
        (0, class_validator_1.IsUrl)()
    ], JspfAttribution.prototype, "content", void 0);
    return JspfAttribution;
}(SinglePair));
var JspfMeta = exports.JspfMeta = /** @class */ (function (_super) {
    __extends(JspfMeta, _super);
    function JspfMeta() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsUrl)()
    ], JspfMeta.prototype, "rel", void 0);
    return JspfMeta;
}(SinglePair));
var JspfLink = exports.JspfLink = /** @class */ (function (_super) {
    __extends(JspfLink, _super);
    function JspfLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsUrl)()
    ], JspfLink.prototype, "rel", void 0);
    __decorate([
        (0, class_validator_1.IsUrl)()
    ], JspfLink.prototype, "content", void 0);
    return JspfLink;
}(SinglePair));
var JspfExtension = exports.JspfExtension = /** @class */ (function (_super) {
    __extends(JspfExtension, _super);
    function JspfExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, class_validator_1.IsUrl)()
    ], JspfExtension.prototype, "rel", void 0);
    __decorate([
        (0, class_validator_1.IsArray)()
    ], JspfExtension.prototype, "content", void 0);
    return JspfExtension;
}(SinglePair));
var JspfTrack = exports.JspfTrack = /** @class */ (function () {
    function JspfTrack(data) {
        (0, class_transformer_1.plainToClassFromExist)(this, data);
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsUrl)({}, { each: true })
    ], JspfTrack.prototype, "location", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsUrl)({}, { each: true })
    ], JspfTrack.prototype, "identifier", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDefined)(),
        (0, class_validator_1.IsString)()
    ], JspfTrack.prototype, "title", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], JspfTrack.prototype, "creator", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], JspfTrack.prototype, "annotation", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfTrack.prototype, "info", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfTrack.prototype, "image", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)()
    ], JspfTrack.prototype, "album", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.Min)(0)
    ], JspfTrack.prototype, "trackNum", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)(),
        (0, class_validator_1.Min)(0)
    ], JspfTrack.prototype, "duration", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, transform_custom_1.TransformPair)({ each: true, type: JspfLink })
    ], JspfTrack.prototype, "link", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, transform_custom_1.TransformPair)({ each: true, type: JspfMeta })
    ], JspfTrack.prototype, "meta", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, transform_custom_1.TransformPair)({ type: JspfExtension })
    ], JspfTrack.prototype, "extension", void 0);
    return JspfTrack;
}());
var JspfPlaylist = exports.JspfPlaylist = /** @class */ (function () {
    function JspfPlaylist(data, options) {
        if (options === void 0) { options = { strip: false }; }
        (0, class_transformer_1.plainToClassFromExist)(this, data);
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], JspfPlaylist.prototype, "title", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], JspfPlaylist.prototype, "creator", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)()
    ], JspfPlaylist.prototype, "annotation", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfPlaylist.prototype, "info", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfPlaylist.prototype, "location", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfPlaylist.prototype, "identifier", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfPlaylist.prototype, "image", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDate)(),
        transform_custom_1.TransformDate
    ], JspfPlaylist.prototype, "date", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUrl)()
    ], JspfPlaylist.prototype, "license", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)(),
        (0, transform_custom_1.TransformPair)({ each: true, type: JspfAttribution })
    ], JspfPlaylist.prototype, "attribution", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, transform_custom_1.TransformPair)({ each: true, type: JspfLink })
    ], JspfPlaylist.prototype, "link", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)({ each: true }),
        (0, transform_custom_1.TransformPair)({ each: true, type: JspfMeta })
    ], JspfPlaylist.prototype, "meta", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, transform_custom_1.TransformPair)({ type: JspfExtension })
    ], JspfPlaylist.prototype, "extension", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(function () { return JspfTrack; })
    ], JspfPlaylist.prototype, "track", void 0);
    return JspfPlaylist;
}());
