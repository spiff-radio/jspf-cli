"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JspfSchema = exports.JspfPlaylistSchema = exports.JspfTrackSchema = exports.JspfExtensionSchema = exports.JspfMetaSchema = exports.JspfLinkSchema = exports.JspfAttributionSchema = void 0;
const zod_1 = require("zod");
/**
 * JSPF (JSON Shareable Playlist Format) Schemas
 *
 * Based on XSPF (XML Shareable Playlist Format) specification version 1
 * See: https://www.xspf.org/spec
 *
 */
// URI validation helper
const uriSchema = zod_1.z.string().url();
// Attribution: single property object with URI value
exports.JspfAttributionSchema = zod_1.z.record(zod_1.z.string(), uriSchema).refine((obj) => Object.keys(obj).length <= 1, { message: "Attribution must have at most one property" });
// Link: single property object
// According to XSPF spec: rel attribute MUST be a URI, content MUST be a URI
exports.JspfLinkSchema = zod_1.z.record(uriSchema, uriSchema).refine((obj) => Object.keys(obj).length <= 1, { message: "Link must have at most one property" });
// Meta: single property object
// According to XSPF spec: rel attribute MUST be a URI, content is plain text
exports.JspfMetaSchema = zod_1.z.record(uriSchema, zod_1.z.string()).refine((obj) => Object.keys(obj).length <= 1, { message: "Meta must have at most one property" });
// Extension: object with URI keys and array values
// According to XSPF spec: application attribute MUST be a URI
exports.JspfExtensionSchema = zod_1.z.record(uriSchema, zod_1.z.array(zod_1.z.any()));
// Track schema
exports.JspfTrackSchema = zod_1.z.object({
    location: zod_1.z.array(uriSchema).optional(),
    identifier: zod_1.z.array(uriSchema).optional(),
    title: zod_1.z.string().optional(),
    creator: zod_1.z.string().optional(),
    annotation: zod_1.z.string().optional(),
    info: uriSchema.optional(),
    image: uriSchema.optional(),
    album: zod_1.z.string().optional(),
    trackNum: zod_1.z.number().int().positive().optional(),
    duration: zod_1.z.number().int().min(0).optional(),
    link: zod_1.z.array(exports.JspfLinkSchema).optional(),
    meta: zod_1.z.array(exports.JspfMetaSchema).optional(),
    extension: exports.JspfExtensionSchema.optional(),
}).strict();
// Playlist schema
exports.JspfPlaylistSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    creator: zod_1.z.string().optional(),
    annotation: zod_1.z.string().optional(),
    info: uriSchema.optional(),
    location: uriSchema.optional(),
    identifier: uriSchema.optional(),
    image: uriSchema.optional(),
    date: zod_1.z.string().optional(), // ISO 8601 date-time string
    license: uriSchema.optional(),
    attribution: zod_1.z.array(exports.JspfAttributionSchema).optional(),
    link: zod_1.z.array(exports.JspfLinkSchema).optional(),
    meta: zod_1.z.array(exports.JspfMetaSchema).optional(),
    extension: exports.JspfExtensionSchema.optional(),
    track: zod_1.z.array(exports.JspfTrackSchema).optional(),
}).strict();
// Root JSPF schema
exports.JspfSchema = zod_1.z.object({
    playlist: exports.JspfPlaylistSchema,
}).strict();
