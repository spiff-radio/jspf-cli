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
    // Re-wrapping an existing JspfBase instance (e.g. `new JspfPlaylist(existingPlaylist)`)
    // must use its plain data, not the instance itself - otherwise internal
    // bookkeeping fields (_data, _schema) get copied onto the new instance too.
    const plainData = data instanceof JspfBase ? data.toJSON() : data;
    this._data = plainData ? { ...plainData } : {};
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

  /**
   * What validation runs against: whatever this object would export *now*.
   *
   * Not `_data`, which is the constructor's input and nothing else. Subclasses expose their
   * fields as properties and serialize those (see JspfTrack/JspfPlaylist.toJSON), so a value
   * set after construction lives in the property and never reaches `_data`. Validating `_data`
   * meant validating what the object was built from rather than what it holds - so an edit could
   * be rejected for a problem it had fixed, or pass for one it had introduced, and either way
   * the answer described a different object than `toJSON()` would hand over.
   */
  protected validationTarget(): Record<string, any> {
    return this.toJSON();
  }

  // Validate against Zod schema
  public isValid(): boolean {
    const result = this._schema.safeParse(this.validationTarget());
    if (!result.success) {
      throw new ZodValidationError('Validation failed', result.error);
    }
    return true;
  }

  // Get validation errors without throwing
  public getValidationErrors(): z.ZodError | null {
    const result = this._schema.safeParse(this.validationTarget());
    if (!result.success) {
      return result.error;
    }
    return null;
  }

  // Parse and validate data, returning the validated data
  public parse(): any {
    return this._schema.parse(this.validationTarget());
  }

  // Safe parse - returns success/error without throwing
  public safeParse() {
    return this._schema.safeParse(this.validationTarget());
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

// JSPF's `meta` is an array of single-key pair objects whose key must be a URI. These helpers
// do the key-based lookup/merge on top of that shape; they deliberately don't validate the key,
// but note that a non-URI key (`dateAdded` rather than `https://example.org/ns/dateAdded`) fails
// JspfMetaSchema and is silently discarded by `stripInvalid` on export.
function metaEntries(meta: JspfMeta[] | undefined): Record<string, any>[] {
  if (!Array.isArray(meta)) return [];
  return meta.map((m) => (m && typeof (m as any).toJSON === 'function' ? m.toJSON() : m)) as Record<string, any>[];
}

function readMeta(meta: JspfMeta[] | undefined, key: string): any {
  const entry = metaEntries(meta).find((m) => Object.prototype.hasOwnProperty.call(m, key));
  return entry ? entry[key] : undefined;
}

function writeMeta(meta: JspfMeta[] | undefined, key: string, value: any): Record<string, any>[] | undefined {
  const kept = metaEntries(meta).filter((m) => !Object.prototype.hasOwnProperty.call(m, key));
  if (value !== undefined && value !== null) kept.push({ [key]: value });
  return kept.length ? kept : undefined;
}

/** Merge meta arrays left to right; a later entry replaces an earlier one with the same key. */
export function mergeMeta(...metaArrays: (JspfMeta[] | Record<string, any>[] | undefined)[]): Record<string, any>[] {
  const result: Record<string, any>[] = [];
  for (const meta of metaArrays) {
    for (const entry of metaEntries(meta as JspfMeta[] | undefined)) {
      if (!entry) continue;
      const key = Object.keys(entry)[0];
      if (key === undefined) continue;
      const index = result.findIndex((m) => key in m);
      if (index !== -1) result[index] = entry;
      else result.push(entry);
    }
  }
  return result;
}

/**
 * `extension` is a single JspfExtension, not an array, but it needs the same accessor
 * treatment as link/meta for the same reason: assigning a plain object left `toJSON()` calling
 * `this.extension.toJSON()` on something that has no such method, and the whole playlist failed
 * to serialize. Callers legitimately write plain objects here - storing app data under a
 * namespace key is what `extension` is *for* - so wrapping belongs in the setter.
 */
function normalizeExtension(value: any): JspfExtension | undefined {
  if (value === undefined || value === null) return undefined;
  return value instanceof JspfExtension ? value : new JspfExtension(value);
}

// A track's location/identifier are ALWAYS an arrays of URIs
function normalizeUriArray(value: any): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  const arr = Array.isArray(value) ? value : [value];
  const normalized = arr.filter(
    (item): item is string => typeof item === 'string' && item.trim() !== ''
  );
  return normalized.length ? normalized : undefined;
}

/**
 * Human-readable label for a track - a tab title, a log line, a CLI prompt. Not an identity
 * key (see matchKey() for that). Works on a plain JSPF-shaped object (a DTO from
 * importPlaylist()/toDTO()) as well as a JspfTrack instance, so callers never need to
 * construct a class instance just to get a label - JspfTrack.getLabel() itself delegates here.
 */
export function getTrackLabel(track: Pick<JspfTrackI, 'title' | 'creator' | 'location'>): string {
  if (track.title && track.creator) return `${track.title} — ${track.creator}`;
  if (track.title) return track.title;
  if (track.creator) return track.creator;
  if (track.location?.[0]) return track.location[0];
  return 'Untitled track';
}

export class JspfTrack extends JspfValidation implements JspfTrackI {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  image?: string;
  album?: string;
  trackNum?: number;
  duration?: number;

  private _extension?: JspfExtension;
  private _location?: string[];
  private _identifier?: string[];
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
      this.extension = data.extension;
    }
  }

  get extension(): JspfExtension | undefined {
    return this._extension;
  }

  set extension(value: any) {
    this._extension = normalizeExtension(value);
  }

  get location(): string[] | undefined {
    return this._location;
  }

  set location(value: any) {
    this._location = normalizeUriArray(value);
  }

  get identifier(): string[] | undefined {
    return this._identifier;
  }

  set identifier(value: any) {
    this._identifier = normalizeUriArray(value);
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

  /** Read a `meta` value by its (URI) key. */
  public getMeta(key: string): any {
    return readMeta(this.meta, key);
  }

  /** Set a `meta` value by its (URI) key; `undefined`/`null` removes the entry. */
  public setMeta(key: string, value: any): void {
    this.meta = writeMeta(this.meta, key, value);
  }

  /**
   * Identity key for duplicate matching (title + creator + album) - two
   * tracks with the same matchKey are considered duplicates of each other,
   * regardless of location, duration, or trackNum.
   */
  public matchKey(): string {
    let key = `'${this.title || ''}' by '${this.creator || ''}'`;
    if (this.album) {
      key += ` on '${this.album}'`;
    }
    return key;
  }

  /** See getTrackLabel() - this just applies it to `this`. */
  public getLabel(): string {
    return getTrackLabel(this);
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
  track?: JspfTrack[];

  private _extension?: JspfExtension;
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
      this.extension = data.extension;
      this.track = Array.isArray(data.track) ? data.track.map((t: any) => new JspfTrack(t)) : undefined;
    }
  }

  get extension(): JspfExtension | undefined {
    return this._extension;
  }

  set extension(value: any) {
    this._extension = normalizeExtension(value);
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

  /**
   * Find tracks in this playlist that are duplicates of the given track
   * (same matchKey - title + creator + album), excluding the track itself.
   */
  public findDuplicatesOf(track: JspfTrack): JspfTrack[] {
    if (!this.track) return [];
    const key = track.matchKey();
    return this.track.filter(t => t !== track && t.matchKey() === key);
  }

  /** Read a `meta` value by its (URI) key. */
  public getMeta(key: string): any {
    return readMeta(this.meta, key);
  }

  /** Set a `meta` value by its (URI) key; `undefined`/`null` removes the entry. */
  public setMeta(key: string, value: any): void {
    this.meta = writeMeta(this.meta, key, value);
  }

  public ensureTrackList(): JspfTrack[] {
    if (!Array.isArray(this.track)) this.track = [];
    return this.track;
  }

  /**
   * Renumber every track by its position (1-based).
   *
   * Only the reordering operations below call this. Notably `appendTrack` does **not**: a
   * playlist imported from an album carries meaningful track numbers, and appending to it
   * shouldn't renumber the whole thing from its positions.
   */
  public reindexTracks(): void {
    if (!this.track) return;
    this.track.forEach((track, index) => {
      track.trackNum = index + 1;
    });
  }

  public appendTrack(track: any = {}): JspfTrack {
    const list = this.ensureTrackList();
    const newTrack = track instanceof JspfTrack ? track : new JspfTrack(track);
    list.push(newTrack);
    return newTrack;
  }

  /**
   * Merge `data` into the track at `index`. A key explicitly set to `undefined` is removed
   * rather than merged over.
   *
   * If the merge sets a `trackNum` that doesn't match the track's current position, the track
   * is *moved* there rather than just relabeled - editing the number is how a user reorders.
   *
   * @returns the track's index after the update, which differs from `index` if it moved.
   */
  public updateTrack(index: number, data: any = {}): number {
    if (!this.track || !this.track[index]) return index;

    const merged: Record<string, any> = { ...this.track[index].toDTO(), ...data };
    for (const key of Object.keys(data)) {
      if (data[key] === undefined) delete merged[key];
    }

    const updated = new JspfTrack(merged);
    this.track[index] = updated;

    let newIndex = index;
    const requested = updated.trackNum;
    if (Number.isFinite(requested) && (requested as number) > 0) {
      const target = Math.max(0, Math.min(this.track.length - 1, (requested as number) - 1));
      if (target !== index) {
        this.track.splice(index, 1);
        this.track.splice(target, 0, updated);
        newIndex = target;
      }
    }

    this.reindexTracks();
    return newIndex;
  }

  public deleteTrack(index: number): void {
    if (!this.track) return;
    this.track.splice(index, 1);
    this.reindexTracks();
  }

  public moveTrack(fromIndex: number, toIndex: number): void {
    if (!this.track || fromIndex === toIndex) return;
    const clamped = Math.max(0, Math.min(this.track.length - 1, toIndex));
    const [track] = this.track.splice(fromIndex, 1);
    if (!track) return;
    this.track.splice(clamped, 0, track);
    this.reindexTracks();
  }

  /**
   * Combine playlists into a new one: the first playlist's metadata, every playlist's tracks
   * concatenated in order, and `meta` merged key by key with later playlists winning.
   */
  public static merge(playlists: (JspfPlaylist | any)[] = []): JspfPlaylist {
    if (!playlists.length) return new JspfPlaylist({ title: 'Merged Playlist', track: [] });

    const dtos = playlists.map((p) =>
      (p instanceof JspfPlaylist ? p : new JspfPlaylist(p)).toDTO()
    );

    const merged: Record<string, any> = {
      ...dtos[0],
      track: dtos.flatMap((dto) => dto.track || []),
    };

    const mergedMeta = mergeMeta(...dtos.map((dto) => dto.meta));
    if (mergedMeta.length) merged.meta = mergedMeta;
    else delete merged.meta;

    return new JspfPlaylist(merged);
  }

  /**
   * Every field read from the object itself - the same shape JspfTrack.toJSON() has always had.
   *
   * It used to spread `_data` for the plain fields (title, creator, annotation, ...) and read only
   * the accessor-backed ones from the instance. `_data` is the constructor's input, so assigning
   * `playlist.title = 'X'` changed what the object read back as and nothing about what it
   * exported: the new title was silently dropped by every `toJSON`, `toDTO`, `toString` and
   * conversion. Tracks never had the bug, which is why it went unnoticed - and why the fix is to
   * make the playlist behave like the track rather than to invent anything.
   *
   * The one behaviour change: a field that is not part of JSPF and was passed to the constructor
   * anyway is no longer echoed back. Tracks have always dropped those, and the schema strips them
   * on validation regardless.
   */
  public toJSON(): JspfPlaylistI {
    return {
      title: this.title,
      creator: this.creator,
      annotation: this.annotation,
      info: this.info,
      location: this.location,
      identifier: this.identifier,
      image: this.image,
      date: this.date,
      license: this.license,
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
