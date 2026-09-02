import { z } from 'zod';
import {
  JspfAttributionSchema,
  JspfLinkSchema,
  JspfMetaSchema,
  JspfExtensionSchema,
  JspfTrackSchema,
  JspfPlaylistSchema,
  JspfSchema,
} from './schemas';
import { JspfI, JspfPlaylistI, JspfTrackI, JspfAttributionI, JspfMetaI, JspfLinkI, JspfExtensionI } from './interfaces';
import cleanDeep from 'clean-deep';

// Custom error class for Zod validation errors
export class ZodValidationError extends Error {
  errors: z.ZodError;
  name: string;
  
  constructor(message: string, errors: z.ZodError) {
    super(message);
    Object.setPrototypeOf(this, ZodValidationError.prototype);
    this.errors = errors;
    this.name = 'ZodValidationError';
  }
}

// Base class with common functionality
export class JspfBase {
  protected _data: Record<string, any>;

  constructor(data?: any) {
    this._data = data ? { ...data } : {};
  }

  // Export to JSON
  public toJSON(): Record<string, any> {
    return { ...this._data };
  }

  // Export a DTO (data transfer object) - strip all empty and undefined values
  public toDTO(): Record<string, any> {
    const obj = this.toJSON();
    return cleanDeep(obj, {
      emptyArrays: true,
      emptyObjects: true,
      emptyStrings: true,
      nullValues: true,
      undefinedValues: true
    });
  }

  // Export to string
  public toString(): string {
    return JSON.stringify(this.toJSON(), null, 4);
  }
}

// Validation base class
export class JspfValidation extends JspfBase {
  protected _schema: z.ZodSchema;

  constructor(data?: any, schema?: z.ZodSchema) {
    super(data);
    if (!schema) {
      throw new Error('Schema is required for JspfValidation');
    }
    this._schema = schema;
  }

  // Validate against Zod schema
  public isValid(): boolean {
    const result = this._schema.safeParse(this._data);
    if (!result.success) {
      throw new ZodValidationError('Validation failed', result.error);
    }
    return true;
  }

  // Get validation errors without throwing
  public getValidationErrors(): z.ZodError | null {
    const result = this._schema.safeParse(this._data);
    if (!result.success) {
      return result.error;
    }
    return null;
  }

  // Parse and validate data, returning the validated data
  public parse(): any {
    return this._schema.parse(this._data);
  }

  // Safe parse - returns success/error without throwing
  public safeParse() {
    return this._schema.safeParse(this._data);
  }
}

// Single pair classes (for attribution, link, meta)
// These need index signatures to match the interfaces
export class SinglePair extends JspfValidation {
  [key: string]: any;

  constructor(data?: any, schema?: z.ZodSchema) {
    // Re-wrapping an existing SinglePair instance (e.g. `new JspfMeta(existingMeta)`)
    // must use its plain data, not the instance itself - otherwise internal
    // bookkeeping fields (_data, _schema) get copied onto the new instance too.
    const plainData = data instanceof SinglePair ? data.toJSON() : data;
    super(plainData, schema || z.record(z.string(), z.any()));
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

export class JspfAttribution extends SinglePair implements JspfAttributionI {
  [key: string]: string | any;

  constructor(data?: any) {
    super(data, JspfAttributionSchema);
  }

  public isValid(): boolean {
    return super.isValid();
  }
}

export class JspfMeta extends SinglePair implements JspfMetaI {
  [key: string]: string | any;

  constructor(data?: any) {
    super(data, JspfMetaSchema);
  }

  public isValid(): boolean {
    return super.isValid();
  }
}

export class JspfLink extends SinglePair implements JspfLinkI {
  [key: string]: string | any;

  constructor(data?: any) {
    super(data, JspfLinkSchema);
  }

  public isValid(): boolean {
    return super.isValid();
  }
}

export class JspfExtension extends JspfValidation implements JspfExtensionI {
  [key: string]: any[] | any;

  constructor(data?: any) {
    super(data, JspfExtensionSchema);
    if (data) {
      Object.assign(this, data);
    }
  }

  public isValid(): boolean {
    return super.isValid();
  }
}

// meta/link/attribution are all "arrays of single-key pair objects" per the
// XSPF/JSPF spec. Accessors on JspfTrack/JspfPlaylist route every assignment
// (not just constructor-time data) through this normalizer, so the field can
// never end up in a shape toJSON() can't handle - e.g. a plain object instead
// of an array, or an array of un-wrapped plain objects.
function normalizePairArray<T extends SinglePair>(
  value: any,
  Ctor: new (data?: any) => T
): T[] | undefined {
  if (value === undefined || value === null) return undefined;
  const arr = Array.isArray(value) ? value : [value];
  const normalized = arr
    .filter((item) => item !== undefined && item !== null)
    .map((item) => (item instanceof Ctor ? item : new Ctor(item)));
  return normalized.length ? normalized : undefined;
}

export class JspfTrack extends JspfValidation implements JspfTrackI {
  location?: string[];
  identifier?: string[];
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  image?: string;
  album?: string;
  trackNum?: number;
  duration?: number;
  extension?: JspfExtension;

  private _link?: JspfLink[];
  private _meta?: JspfMeta[];

  constructor(data?: any) {
    super(data, JspfTrackSchema);

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

  get link(): JspfLink[] | undefined {
    return this._link;
  }

  set link(value: any) {
    this._link = normalizePairArray(value, JspfLink);
  }

  get meta(): JspfMeta[] | undefined {
    return this._meta;
  }

  set meta(value: any) {
    this._meta = normalizePairArray(value, JspfMeta);
  }

  public isValid(): boolean {
    return super.isValid();
  }

  public toJSON(): JspfTrackI {
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
    } as JspfTrackI;
  }
}

export class JspfPlaylist extends JspfValidation implements JspfPlaylistI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  extension?: JspfExtension;
  track?: JspfTrack[];

  private _attribution?: JspfAttribution[];
  private _link?: JspfLink[];
  private _meta?: JspfMeta[];

  constructor(data?: any) {
    super(data, JspfPlaylistSchema);

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
      this.track = Array.isArray(data.track) ? data.track.map((t: any) => new JspfTrack(t)) : undefined;
    }
  }

  get attribution(): JspfAttribution[] | undefined {
    return this._attribution;
  }

  set attribution(value: any) {
    this._attribution = normalizePairArray(value, JspfAttribution);
  }

  get link(): JspfLink[] | undefined {
    return this._link;
  }

  set link(value: any) {
    this._link = normalizePairArray(value, JspfLink);
  }

  get meta(): JspfMeta[] | undefined {
    return this._meta;
  }

  set meta(value: any) {
    this._meta = normalizePairArray(value, JspfMeta);
  }

  public isValid(): boolean {
    return super.isValid();
  }

  public toJSON(): JspfPlaylistI {
    const base = super.toJSON();
    return {
      ...base,
      attribution: this.attribution?.map(a => a.toJSON()),
      link: this.link?.map(l => l.toJSON()),
      meta: this.meta?.map(m => m.toJSON()),
      extension: this.extension?.toJSON(),
      track: this.track?.map(t => t.toJSON()),
    } as JspfPlaylistI;
  }
}

export class Jspf extends JspfValidation implements JspfI {
  playlist: JspfPlaylist;

  constructor(data?: any) {
    super(data, JspfSchema);
    
    if (data?.playlist) {
      this.playlist = new JspfPlaylist(data.playlist);
    } else {
      this.playlist = new JspfPlaylist();
    }
  }

  public isValid(): boolean {
    return super.isValid();
  }

  public toJSON() {
    return {
      playlist: this.playlist.toJSON(),
    };
  }
}

