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
    super(data, schema || z.record(z.string(), z.any()));
    if (data) {
      Object.assign(this, data);
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
  link?: JspfLink[];
  meta?: JspfMeta[];
  extension?: JspfExtension;

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
      this.link = Array.isArray(data.link) ? data.link.map((l: any) => new JspfLink(l)) : undefined;
      this.meta = Array.isArray(data.meta) ? data.meta.map((m: any) => new JspfMeta(m)) : undefined;
      this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
    }
  }

  public isValid(): boolean {
    return super.isValid();
  }

  public toJSON(): JspfTrackI {
    const base = super.toJSON();
    return {
      ...base,
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
  attribution?: JspfAttribution[];
  link?: JspfLink[];
  meta?: JspfMeta[];
  extension?: JspfExtension;
  track?: JspfTrack[];

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
      this.attribution = Array.isArray(data.attribution) ? data.attribution.map((a: any) => new JspfAttribution(a)) : undefined;
      this.link = Array.isArray(data.link) ? data.link.map((l: any) => new JspfLink(l)) : undefined;
      this.meta = Array.isArray(data.meta) ? data.meta.map((m: any) => new JspfMeta(m)) : undefined;
      this.extension = data.extension ? new JspfExtension(data.extension) : undefined;
      this.track = Array.isArray(data.track) ? data.track.map((t: any) => new JspfTrack(t)) : undefined;
    }
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

