import { z } from 'zod';

// URI validation helper
const uriSchema = z.string().url();

// Single property object schemas (for attribution, link, meta)
// These are objects with max 1 property where the key is a string and value is a string/URI
const singlePropertyObjectSchema = z.record(z.string(), z.string()).refine(
  (obj) => Object.keys(obj).length <= 1,
  { message: "Object must have at most one property" }
);

// Attribution: single property object with URI value
export const JspfAttributionSchema = z.record(z.string(), uriSchema).refine(
  (obj) => Object.keys(obj).length <= 1,
  { message: "Attribution must have at most one property" }
);

// Link: single property object with URI key and URI value
export const JspfLinkSchema = z.record(uriSchema, uriSchema).refine(
  (obj) => Object.keys(obj).length <= 1,
  { message: "Link must have at most one property" }
);

// Meta: single property object with URI key and string value
export const JspfMetaSchema = z.record(uriSchema, z.string()).refine(
  (obj) => Object.keys(obj).length <= 1,
  { message: "Meta must have at most one property" }
);

// Extension: object with URI keys and array values
export const JspfExtensionSchema = z.record(uriSchema, z.array(z.any()));

// Track schema
export const JspfTrackSchema = z.object({
  location: z.array(uriSchema).optional(),
  identifier: z.array(uriSchema).optional(),
  title: z.string().optional(),
  creator: z.string().optional(),
  annotation: z.string().optional(),
  info: uriSchema.optional(),
  image: uriSchema.optional(),
  album: z.string().optional(),
  trackNum: z.number().int().min(0).optional(),
  duration: z.number().int().min(0).optional(),
  link: z.array(JspfLinkSchema).optional(),
  meta: z.array(JspfMetaSchema).optional(),
  extension: JspfExtensionSchema.optional(),
}).strict();

// Playlist schema
export const JspfPlaylistSchema = z.object({
  title: z.string().optional(),
  creator: z.string().optional(),
  annotation: z.string().optional(),
  info: uriSchema.optional(),
  location: uriSchema.optional(),
  identifier: uriSchema.optional(),
  image: uriSchema.optional(),
  date: z.string().optional(), // ISO 8601 date-time string
  license: uriSchema.optional(),
  attribution: z.array(JspfAttributionSchema).optional(),
  link: z.array(JspfLinkSchema).optional(),
  meta: z.array(JspfMetaSchema).optional(),
  extension: JspfExtensionSchema.optional(),
  track: z.array(JspfTrackSchema).optional(),
}).strict();

// Root JSPF schema
export const JspfSchema = z.object({
  playlist: JspfPlaylistSchema,
}).strict();

// Type exports
export type JspfAttribution = z.infer<typeof JspfAttributionSchema>;
export type JspfLink = z.infer<typeof JspfLinkSchema>;
export type JspfMeta = z.infer<typeof JspfMetaSchema>;
export type JspfExtension = z.infer<typeof JspfExtensionSchema>;
export type JspfTrack = z.infer<typeof JspfTrackSchema>;
export type JspfPlaylist = z.infer<typeof JspfPlaylistSchema>;
export type Jspf = z.infer<typeof JspfSchema>;

