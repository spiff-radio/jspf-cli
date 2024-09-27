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
exports.JSONValidationErrors = exports.Jspf = exports.JspfPlaylist = exports.JspfTrack = exports.JspfExtension = exports.JspfLink = exports.JspfMeta = exports.JspfAttribution = exports.SinglePair = exports.JspfValidation = exports.JspfBase = void 0;
var class_transformer_1 = require("class-transformer");
var jsonschema_1 = require("jsonschema");
var utils_1 = require("../utils");
var defaultPlaylistOptions = {
    notValidError: true,
    stripNotValid: true
};
var JspfBase = /** @class */ (function () {
    function JspfBase(data) {
        (0, class_transformer_1.plainToClassFromExist)(this, data, { excludeExtraneousValues: true, exposeUnsetFields: false });
    }
    //export to JSON - override built-in class function
    JspfBase.prototype.toJSON = function () {
        var obj = (0, class_transformer_1.classToPlain)(this);
        return obj;
    };
    //export a DTO (data transfer object) :
    //- strip all empty and undefined values
    JspfBase.prototype.toDTO = function () {
        var obj = this.toJSON();
        obj = (0, utils_1.cleanNestedObject)(obj);
        return obj;
    };
    //export to string - override built-in class function
    JspfBase.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    return JspfBase;
}());
exports.JspfBase = JspfBase;
var JspfValidation = /** @class */ (function (_super) {
    __extends(JspfValidation, _super);
    function JspfValidation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //Checks if a JSPF fragment is valid against a JSON schema (defining a full JSPF).
    JspfValidation.prototype.isValid = function (schema) {
        if (schema === void 0) { schema = {}; }
        this.validator = new jsonschema_1.Validator();
        this.validation = this.validator.validate(this.toDTO(), schema);
        if (this.validation.errors.length) {
            throw new JSONValidationErrors("The playlist is not valid.", this.validation);
        }
        else {
            return true;
        }
    };
    JspfValidation.removeValuesWithErrors = function (dto, errors) {
        errors = errors !== null && errors !== void 0 ? errors : [];
        errors.forEach(function (error) { return JspfValidation.removeValueForError(dto, error); });
        return dto;
    };
    JspfValidation.removeValueForError = function (dto, error) {
        var errorPath = error.property.replace(/\[(\w+)\]/g, '.$1').split('.');
        var currentNode = dto;
        for (var i = 0; i < errorPath.length; i++) {
            var key = errorPath[i];
            if (i === errorPath.length - 1) {
                if (Array.isArray(currentNode)) {
                    if (key !== null) {
                        currentNode.splice(parseInt(key, 10), 1);
                    }
                }
                else if (typeof currentNode === 'object') {
                    delete currentNode[key];
                }
            }
            else {
                if (!currentNode.hasOwnProperty(key)) {
                    // Property is not defined in the data, maybe already deleted, move on to next error
                    continue;
                }
                currentNode = currentNode[key];
            }
        }
        return dto;
    };
    return JspfValidation;
}(JspfBase));
exports.JspfValidation = JspfValidation;
var SinglePair = /** @class */ (function (_super) {
    __extends(SinglePair, _super);
    function SinglePair() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SinglePair.prototype.toJSON = function () {
        return (0, class_transformer_1.classToPlain)(this);
    };
    SinglePair.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return SinglePair;
}(JspfValidation));
exports.SinglePair = SinglePair;
var JspfAttribution = /** @class */ (function (_super) {
    __extends(JspfAttribution, _super);
    function JspfAttribution() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfAttribution.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('$defs/attribution', schema);
    };
    JspfAttribution.prototype.isValid = function (schema) {
        schema = JspfAttribution.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    return JspfAttribution;
}(SinglePair));
exports.JspfAttribution = JspfAttribution;
var JspfMeta = /** @class */ (function (_super) {
    __extends(JspfMeta, _super);
    function JspfMeta() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfMeta.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('$defs/meta', schema);
    };
    JspfMeta.prototype.isValid = function (schema) {
        schema = JspfMeta.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    return JspfMeta;
}(SinglePair));
exports.JspfMeta = JspfMeta;
/*
export class JspfMetaCollection extends Array<JspfMetaI> implements JspfMetaCollectionI {
  getMeta(key: string) {
    const meta = this.find(meta => meta.keys[0] === key);
    return meta;
  }

  getMetaValue(key: string): string | null {
    const meta = this.getMeta(key);
    return meta ? meta.values[0] : null;
  }

  removeMeta(key: string) {
    const existing = this.getMeta(key);
    const index = this.indexOf(existing);
    if (index !== -1) {
      this.splice(index, 1);
    }
  }

  setMeta(key: string, value: string) {
    // Remove any existing meta with the same key
    this.removeMeta(key);

    const metaObj = { [key]: value };
    this.push(metaObj);
  }

  mergeMetas(metas: JspfMetaCollectionI) {
    metas.forEach(meta => {
      const key = meta.keys[0];
      const value = meta[key];
      this.setMeta(key, value);
    });
  }
}
*/
var JspfLink = /** @class */ (function (_super) {
    __extends(JspfLink, _super);
    function JspfLink() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfLink.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('$defs/link', schema);
    };
    JspfLink.prototype.isValid = function (schema) {
        schema = JspfLink.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    return JspfLink;
}(SinglePair));
exports.JspfLink = JspfLink;
var JspfExtension = /** @class */ (function (_super) {
    __extends(JspfExtension, _super);
    function JspfExtension() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfExtension.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('$defs/extension', schema);
    };
    JspfExtension.prototype.isValid = function (schema) {
        schema = JspfExtension.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    return JspfExtension;
}(JspfValidation));
exports.JspfExtension = JspfExtension;
var JspfTrack = /** @class */ (function (_super) {
    __extends(JspfTrack, _super);
    function JspfTrack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfTrack.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('$defs/track', schema);
    };
    JspfTrack.prototype.isValid = function (schema) {
        schema = JspfTrack.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "location", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "identifier", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "title", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "creator", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "annotation", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "info", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "image", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "album", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "trackNum", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfTrack.prototype, "duration", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfLink; })
    ], JspfTrack.prototype, "link", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfMeta; })
    ], JspfTrack.prototype, "meta", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfExtension; })
    ], JspfTrack.prototype, "extension", void 0);
    return JspfTrack;
}(JspfValidation));
exports.JspfTrack = JspfTrack;
var JspfPlaylist = /** @class */ (function (_super) {
    __extends(JspfPlaylist, _super);
    function JspfPlaylist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JspfPlaylist.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('properties/playlist', schema);
    };
    JspfPlaylist.prototype.isValid = function (schema) {
        schema = JspfPlaylist.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "title", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "creator", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "annotation", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "info", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "location", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "identifier", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "image", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "date", void 0);
    __decorate([
        (0, class_transformer_1.Expose)()
    ], JspfPlaylist.prototype, "license", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfAttribution; })
    ], JspfPlaylist.prototype, "attribution", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfLink; })
    ], JspfPlaylist.prototype, "link", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfMeta; })
    ], JspfPlaylist.prototype, "meta", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfExtension; })
    ], JspfPlaylist.prototype, "extension", void 0);
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfTrack; })
    ], JspfPlaylist.prototype, "track", void 0);
    return JspfPlaylist;
}(JspfValidation));
exports.JspfPlaylist = JspfPlaylist;
var Jspf = /** @class */ (function (_super) {
    __extends(Jspf, _super);
    function Jspf() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Jspf.get_schema = function (schema) {
        return (0, utils_1.getChildSchema)('', schema);
    };
    Jspf.prototype.isValid = function (schema) {
        schema = Jspf.get_schema(schema);
        return _super.prototype.isValid.call(this, schema);
    };
    __decorate([
        (0, class_transformer_1.Expose)(),
        (0, class_transformer_1.Type)(function () { return JspfPlaylist; })
    ], Jspf.prototype, "playlist", void 0);
    return Jspf;
}(JspfValidation));
exports.Jspf = Jspf;
var JSONValidationErrors = /** @class */ (function (_super) {
    __extends(JSONValidationErrors, _super);
    function JSONValidationErrors(message, validation) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, JSONValidationErrors.prototype); //without this, TypeScript build fails - https://www.ashsmith.io/handling-custom-error-classes-in-typescript
        _this.validation = validation;
        _this.name = 'JSONValidationErrors';
        return _this;
    }
    return JSONValidationErrors;
}(Error));
exports.JSONValidationErrors = JSONValidationErrors;
