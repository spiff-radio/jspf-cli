import { z } from 'zod';
import { JspfI, JspfPlaylistI, JspfTrackI, JspfAttributionI, JspfMetaI, JspfLinkI, JspfExtensionI } from './interfaces';
export declare class ZodValidationError extends Error {
    errors: z.ZodError;
    name: string;
    constructor(message: string, errors: z.ZodError);
}
export declare class JspfBase {
    protected _data: Record<string, any>;
    constructor(data?: any);
    toJSON(): Record<string, any>;
    toDTO(): Record<string, any>;
    toString(): string;
}
export declare class JspfValidation extends JspfBase {
    protected _schema: z.ZodSchema;
    constructor(data?: any, schema?: z.ZodSchema);
    isValid(): boolean;
    getValidationErrors(): z.ZodError | null;
    parse(): any;
    safeParse(): z.ZodSafeParseResult<unknown>;
}
export declare class SinglePair extends JspfValidation {
    [key: string]: any;
    constructor(data?: any, schema?: z.ZodSchema);
    toJSON(): Record<string, any>;
    toString(): string;
}
export declare class JspfAttribution extends SinglePair implements JspfAttributionI {
    [key: string]: string | any;
    constructor(data?: any);
    isValid(): boolean;
}
export declare class JspfMeta extends SinglePair implements JspfMetaI {
    [key: string]: string | any;
    constructor(data?: any);
    isValid(): boolean;
}
export declare class JspfLink extends SinglePair implements JspfLinkI {
    [key: string]: string | any;
    constructor(data?: any);
    isValid(): boolean;
}
export declare class JspfExtension extends JspfValidation implements JspfExtensionI {
    [key: string]: any[] | any;
    constructor(data?: any);
    isValid(): boolean;
}
export declare class JspfTrack extends JspfValidation implements JspfTrackI {
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
    private _link?;
    private _meta?;
    constructor(data?: any);
    get link(): JspfLink[] | undefined;
    set link(value: any);
    get meta(): JspfMeta[] | undefined;
    set meta(value: any);
    isValid(): boolean;
    toJSON(): JspfTrackI;
}
export declare class JspfPlaylist extends JspfValidation implements JspfPlaylistI {
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
    private _attribution?;
    private _link?;
    private _meta?;
    constructor(data?: any);
    get attribution(): JspfAttribution[] | undefined;
    set attribution(value: any);
    get link(): JspfLink[] | undefined;
    set link(value: any);
    get meta(): JspfMeta[] | undefined;
    set meta(value: any);
    isValid(): boolean;
    toJSON(): JspfPlaylistI;
}
export declare class Jspf extends JspfValidation implements JspfI {
    playlist: JspfPlaylist;
    constructor(data?: any);
    isValid(): boolean;
    toJSON(): {
        playlist: JspfPlaylistI;
    };
}
