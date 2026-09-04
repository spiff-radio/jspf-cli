"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jspf = exports.JspfPlaylist = exports.JspfTrack = exports.JspfExtension = exports.JspfLink = exports.JspfMeta = exports.JspfAttribution = exports.SinglePair = exports.JspfValidation = exports.JspfBase = exports.ZodValidationError = void 0;
const zod_1 = require("zod");
const schemas_1 = require("./schemas");
const clean_deep_1 = __importDefault(require("clean-deep"));
// Custom error class for Zod validation errors
class ZodValidationError extends Error {
    errors;
    name;
    constructor(message, errors) {
        super(message);
        Object.setPrototypeOf(this, ZodValidationError.prototype);
        this.errors = errors;
        this.name = 'ZodValidationError';
    }
}
exports.ZodValidationError = ZodValidationError;
// Base class with common functionality
class JspfBase {
    _data;
    constructor(data) {
        // Re-wrapping an existing JspfBase instance (e.g. `new JspfPlaylist(existingPlaylist)`)
        // must use its plain data, not the instance itself - otherwise internal
        // bookkeeping fields (_data, _schema) get copied onto the new instance too.
        const plainData = data instanceof JspfBase ? data.toJSON() : data;
        this._data = plainData ? { ...plainData } : {};
    }
    // Export to JSON
    toJSON() {
        return { ...this._data };
    }
    // Export a DTO (data transfer object) - strip all empty and undefined values
    toDTO() {
        const obj = this.toJSON();
        return (0, clean_deep_1.default)(obj, {
            emptyArrays: true,
            emptyObjects: true,
            emptyStrings: true,
            nullValues: true,
            undefinedValues: true
        });
    }
    // Export to string
    toString() {
        return JSON.stringify(this.toJSON(), null, 4);
    }
}
exports.JspfBase = JspfBase;
// Validation base class
class JspfValidation extends JspfBase {
    _schema;
    constructor(data, schema) {
        super(data);
        if (!schema) {
            throw new Error('Schema is required for JspfValidation');
        }
        this._schema = schema;
    }
    // Validate against Zod schema
    isValid() {
        const result = this._schema.safeParse(this._data);
        if (!result.success) {
            throw new ZodValidationError('Validation failed', result.error);
        }
        return true;
    }
    // Get validation errors without throwing
    getValidationErrors() {
        const result = this._schema.safeParse(this._data);
        if (!result.success) {
            return result.error;
        }
        return null;
    }
    // Parse and validate data, returning the validated data
    parse() {
        return this._schema.parse(this._data);
    }
    // Safe parse - returns success/error without throwing
    safeParse() {
        return this._schema.safeParse(this._data);
    }
}
exports.JspfValidation = JspfValidation;
// Single pair classes (for attribution, link, meta)
// These need index signatures to match the interfaces
class SinglePair extends JspfValidation {
    constructor(data, schema) {
        // Re-wrapping an existing SinglePair instance (e.g. `new JspfMeta(existingMeta)`)
        // must use its plain data, not the instance itself - otherwise internal
        // bookkeeping fields (_data, _schema) get copied onto the new instance too.
        const plainData = data instanceof SinglePair ? data.toJSON() : data;
        super(plainData, schema || zod_1.z.record(zod_1.z.string(), zod_1.z.any()));
        if (plainData) {
            Object.assign(this, plainData);
        }
    }
    toJSON() {
        return super.toJSON();
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.SinglePair = SinglePair;
class JspfAttribution extends SinglePair {
    constructor(data) {
        super(data, schemas_1.JspfAttributionSchema);
    }
    isValid() {
        return super.isValid();
    }
}
exports.JspfAttribution = JspfAttribution;
class JspfMeta extends SinglePair {
    constructor(data) {
        super(data, schemas_1.JspfMetaSchema);
    }
    isValid() {
        return super.isValid();
    }
}
exports.JspfMeta = JspfMeta;
class JspfLink extends SinglePair {
    constructor(data) {
        super(data, schemas_1.JspfLinkSchema);
    }
    isValid() {
        return super.isValid();
    }
}
exports.JspfLink = JspfLink;
class JspfExtension extends JspfValidation {
    constructor(data) {
        super(data, schemas_1.JspfExtensionSchema);
        if (data) {
            Object.assign(this, data);
        }
    }
    isValid() {
        return super.isValid();
    }
}
exports.JspfExtension = JspfExtension;
// meta/link/attribution are all "arrays of single-key pair objects" per the
// XSPF/JSPF spec. Accessors on JspfTrack/JspfPlaylist route every assignment
// (not just constructor-time data) through this normalizer, so the field can
// never end up in a shape toJSON() can't handle - e.g. a plain object instead
// of an array, or an array of un-wrapped plain objects.
function normalizePairArray(value, Ctor) {
    if (value === undefined || value === null)
        return undefined;
    const arr = Array.isArray(value) ? value : [value];
    const normalized = arr
        .filter((item) => item !== undefined && item !== null)
        .map((item) => (item instanceof Ctor ? item : new Ctor(item)));
    return normalized.length ? normalized : undefined;
}
class JspfTrack extends JspfValidation {
    location;
    identifier;
    title;
    creator;
    annotation;
    info;
    image;
    album;
    trackNum;
    duration;
    extension;
    _link;
    _meta;
    constructor(data) {
        super(data, schemas_1.JspfTrackSchema);
        // Populate properties from data
        if (data) {
            this.location = data.location;
            this.identifier = data.identifier;
            this.title = data.title;
            this.creator = data.creator;
            this.annotation = data.annotation;
            this.info = data.info;
            this.image = data.image;
            this.album = data.album;
            this.trackNum = data.trackNum;
            this.duration = data.duration;
            this.link = data.link;
            this.meta = data.meta;
            this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
        }
    }
    get link() {
        return this._link;
    }
    set link(value) {
        this._link = normalizePairArray(value, JspfLink);
    }
    get meta() {
        return this._meta;
    }
    set meta(value) {
        this._meta = normalizePairArray(value, JspfMeta);
    }
    isValid() {
        return super.isValid();
    }
    /**
     * Identity key for duplicate matching (title + creator + album) - two
     * tracks with the same matchKey are considered duplicates of each other,
     * regardless of location, duration, or trackNum.
     */
    matchKey() {
        let key = `'${this.title || ''}' by '${this.creator || ''}'`;
        if (this.album) {
            key += ` on '${this.album}'`;
        }
        return key;
    }
    toJSON() {
        return {
            location: this.location,
            identifier: this.identifier,
            title: this.title,
            creator: this.creator,
            annotation: this.annotation,
            info: this.info,
            image: this.image,
            album: this.album,
            trackNum: this.trackNum,
            duration: this.duration,
            link: this.link?.map(l => l.toJSON()),
            meta: this.meta?.map(m => m.toJSON()),
            extension: this.extension?.toJSON(),
        };
    }
}
exports.JspfTrack = JspfTrack;
class JspfPlaylist extends JspfValidation {
    title;
    creator;
    annotation;
    info;
    location;
    identifier;
    image;
    date;
    license;
    extension;
    track;
    _attribution;
    _link;
    _meta;
    constructor(data) {
        super(data, schemas_1.JspfPlaylistSchema);
        // Populate properties from data
        if (data) {
            this.title = data.title;
            this.creator = data.creator;
            this.annotation = data.annotation;
            this.info = data.info;
            this.location = data.location;
            this.identifier = data.identifier;
            this.image = data.image;
            this.date = data.date;
            this.license = data.license;
            this.attribution = data.attribution;
            this.link = data.link;
            this.meta = data.meta;
            this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
            this.track = Array.isArray(data.track) ? data.track.map((t) => new JspfTrack(t)) : undefined;
        }
    }
    get attribution() {
        return this._attribution;
    }
    set attribution(value) {
        this._attribution = normalizePairArray(value, JspfAttribution);
    }
    get link() {
        return this._link;
    }
    set link(value) {
        this._link = normalizePairArray(value, JspfLink);
    }
    get meta() {
        return this._meta;
    }
    set meta(value) {
        this._meta = normalizePairArray(value, JspfMeta);
    }
    isValid() {
        return super.isValid();
    }
    /**
     * Find tracks in this playlist that are duplicates of the given track
     * (same matchKey - title + creator + album), excluding the track itself.
     */
    findDuplicatesOf(track) {
        if (!this.track)
            return [];
        const key = track.matchKey();
        return this.track.filter(t => t !== track && t.matchKey() === key);
    }
    toJSON() {
        const base = super.toJSON();
        return {
            ...base,
            attribution: this.attribution?.map(a => a.toJSON()),
            link: this.link?.map(l => l.toJSON()),
            meta: this.meta?.map(m => m.toJSON()),
            extension: this.extension?.toJSON(),
            track: this.track?.map(t => t.toJSON()),
        };
    }
}
exports.JspfPlaylist = JspfPlaylist;
class Jspf extends JspfValidation {
    playlist;
    constructor(data) {
        super(data, schemas_1.JspfSchema);
        if (data?.playlist) {
            this.playlist = new JspfPlaylist(data.playlist);
        }
        else {
            this.playlist = new JspfPlaylist();
        }
    }
    isValid() {
        return super.isValid();
    }
    toJSON() {
        return {
            playlist: this.playlist.toJSON(),
        };
    }
}
exports.Jspf = Jspf;
