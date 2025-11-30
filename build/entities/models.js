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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jspf = exports.JspfPlaylist = exports.JspfTrack = exports.JspfExtension = exports.JspfLink = exports.JspfMeta = exports.JspfAttribution = exports.SinglePair = exports.JspfValidation = exports.JspfBase = exports.ZodValidationError = void 0;
var zod_1 = require("zod");
var schemas_1 = require("./schemas");
var utils_1 = require("../utils");
// Custom error class for Zod validation errors
var ZodValidationError = /** @class */ (function (_super) {
    __extends(ZodValidationError, _super);
    function ZodValidationError(message, errors) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, ZodValidationError.prototype);
        _this.errors = errors;
        _this.name = 'ZodValidationError';
        return _this;
    }
    return ZodValidationError;
}(Error));
exports.ZodValidationError = ZodValidationError;
// Base class with common functionality
var JspfBase = /** @class */ (function () {
    function JspfBase(data) {
        this._data = data ? __assign({}, data) : {};
    }
    // Export to JSON
    JspfBase.prototype.toJSON = function () {
        return __assign({}, this._data);
    };
    // Export a DTO (data transfer object) - strip all empty and undefined values
    JspfBase.prototype.toDTO = function () {
        var obj = this.toJSON();
        return (0, utils_1.cleanNestedObject)(obj);
    };
    // Export to string
    JspfBase.prototype.toString = function () {
        return JSON.stringify(this.toJSON(), null, 4);
    };
    return JspfBase;
}());
exports.JspfBase = JspfBase;
// Validation base class
var JspfValidation = /** @class */ (function (_super) {
    __extends(JspfValidation, _super);
    function JspfValidation(data, schema) {
        var _this = _super.call(this, data) || this;
        if (!schema) {
            throw new Error('Schema is required for JspfValidation');
        }
        _this._schema = schema;
        return _this;
    }
    // Validate against Zod schema
    JspfValidation.prototype.isValid = function () {
        var result = this._schema.safeParse(this._data);
        if (!result.success) {
            throw new ZodValidationError('Validation failed', result.error);
        }
        return true;
    };
    // Get validation errors without throwing
    JspfValidation.prototype.getValidationErrors = function () {
        var result = this._schema.safeParse(this._data);
        if (!result.success) {
            return result.error;
        }
        return null;
    };
    // Parse and validate data, returning the validated data
    JspfValidation.prototype.parse = function () {
        return this._schema.parse(this._data);
    };
    // Safe parse - returns success/error without throwing
    JspfValidation.prototype.safeParse = function () {
        return this._schema.safeParse(this._data);
    };
    return JspfValidation;
}(JspfBase));
exports.JspfValidation = JspfValidation;
// Single pair classes (for attribution, link, meta)
// These need index signatures to match the interfaces
var SinglePair = /** @class */ (function (_super) {
    __extends(SinglePair, _super);
    function SinglePair(data, schema) {
        var _this = _super.call(this, data, schema || zod_1.z.record(zod_1.z.string(), zod_1.z.any())) || this;
        if (data) {
            Object.assign(_this, data);
        }
        return _this;
    }
    SinglePair.prototype.toJSON = function () {
        return _super.prototype.toJSON.call(this);
    };
    SinglePair.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };
    return SinglePair;
}(JspfValidation));
exports.SinglePair = SinglePair;
var JspfAttribution = /** @class */ (function (_super) {
    __extends(JspfAttribution, _super);
    function JspfAttribution(data) {
        return _super.call(this, data, schemas_1.JspfAttributionSchema) || this;
    }
    JspfAttribution.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    return JspfAttribution;
}(SinglePair));
exports.JspfAttribution = JspfAttribution;
var JspfMeta = /** @class */ (function (_super) {
    __extends(JspfMeta, _super);
    function JspfMeta(data) {
        return _super.call(this, data, schemas_1.JspfMetaSchema) || this;
    }
    JspfMeta.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    return JspfMeta;
}(SinglePair));
exports.JspfMeta = JspfMeta;
var JspfLink = /** @class */ (function (_super) {
    __extends(JspfLink, _super);
    function JspfLink(data) {
        return _super.call(this, data, schemas_1.JspfLinkSchema) || this;
    }
    JspfLink.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    return JspfLink;
}(SinglePair));
exports.JspfLink = JspfLink;
var JspfExtension = /** @class */ (function (_super) {
    __extends(JspfExtension, _super);
    function JspfExtension(data) {
        var _this = _super.call(this, data, schemas_1.JspfExtensionSchema) || this;
        if (data) {
            Object.assign(_this, data);
        }
        return _this;
    }
    JspfExtension.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    return JspfExtension;
}(JspfValidation));
exports.JspfExtension = JspfExtension;
var JspfTrack = /** @class */ (function (_super) {
    __extends(JspfTrack, _super);
    function JspfTrack(data) {
        var _this = _super.call(this, data, schemas_1.JspfTrackSchema) || this;
        // Populate properties from data
        if (data) {
            _this.location = data.location;
            _this.identifier = data.identifier;
            _this.title = data.title;
            _this.creator = data.creator;
            _this.annotation = data.annotation;
            _this.info = data.info;
            _this.image = data.image;
            _this.album = data.album;
            _this.trackNum = data.trackNum;
            _this.duration = data.duration;
            _this.link = Array.isArray(data.link) ? data.link.map(function (l) { return new JspfLink(l); }) : undefined;
            _this.meta = Array.isArray(data.meta) ? data.meta.map(function (m) { return new JspfMeta(m); }) : undefined;
            _this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
        }
        return _this;
    }
    JspfTrack.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    JspfTrack.prototype.toJSON = function () {
        var _a, _b, _c;
        var base = _super.prototype.toJSON.call(this);
        return __assign(__assign({}, base), { link: (_a = this.link) === null || _a === void 0 ? void 0 : _a.map(function (l) { return l.toJSON(); }), meta: (_b = this.meta) === null || _b === void 0 ? void 0 : _b.map(function (m) { return m.toJSON(); }), extension: (_c = this.extension) === null || _c === void 0 ? void 0 : _c.toJSON() });
    };
    return JspfTrack;
}(JspfValidation));
exports.JspfTrack = JspfTrack;
var JspfPlaylist = /** @class */ (function (_super) {
    __extends(JspfPlaylist, _super);
    function JspfPlaylist(data) {
        var _this = _super.call(this, data, schemas_1.JspfPlaylistSchema) || this;
        // Populate properties from data
        if (data) {
            _this.title = data.title;
            _this.creator = data.creator;
            _this.annotation = data.annotation;
            _this.info = data.info;
            _this.location = data.location;
            _this.identifier = data.identifier;
            _this.image = data.image;
            _this.date = data.date;
            _this.license = data.license;
            _this.attribution = Array.isArray(data.attribution) ? data.attribution.map(function (a) { return new JspfAttribution(a); }) : undefined;
            _this.link = Array.isArray(data.link) ? data.link.map(function (l) { return new JspfLink(l); }) : undefined;
            _this.meta = Array.isArray(data.meta) ? data.meta.map(function (m) { return new JspfMeta(m); }) : undefined;
            _this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
            _this.track = Array.isArray(data.track) ? data.track.map(function (t) { return new JspfTrack(t); }) : undefined;
        }
        return _this;
    }
    JspfPlaylist.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    JspfPlaylist.prototype.toJSON = function () {
        var _a, _b, _c, _d, _e;
        var base = _super.prototype.toJSON.call(this);
        return __assign(__assign({}, base), { attribution: (_a = this.attribution) === null || _a === void 0 ? void 0 : _a.map(function (a) { return a.toJSON(); }), link: (_b = this.link) === null || _b === void 0 ? void 0 : _b.map(function (l) { return l.toJSON(); }), meta: (_c = this.meta) === null || _c === void 0 ? void 0 : _c.map(function (m) { return m.toJSON(); }), extension: (_d = this.extension) === null || _d === void 0 ? void 0 : _d.toJSON(), track: (_e = this.track) === null || _e === void 0 ? void 0 : _e.map(function (t) { return t.toJSON(); }) });
    };
    return JspfPlaylist;
}(JspfValidation));
exports.JspfPlaylist = JspfPlaylist;
var Jspf = /** @class */ (function (_super) {
    __extends(Jspf, _super);
    function Jspf(data) {
        var _this = _super.call(this, data, schemas_1.JspfSchema) || this;
        if (data === null || data === void 0 ? void 0 : data.playlist) {
            _this.playlist = new JspfPlaylist(data.playlist);
        }
        else {
            _this.playlist = new JspfPlaylist();
        }
        return _this;
    }
    Jspf.prototype.isValid = function () {
        return _super.prototype.isValid.call(this);
    };
    Jspf.prototype.toJSON = function () {
        return {
            playlist: this.playlist.toJSON(),
        };
    };
    return Jspf;
}(JspfValidation));
exports.Jspf = Jspf;
