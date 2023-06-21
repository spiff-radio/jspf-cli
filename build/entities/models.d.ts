import { Validator, ValidatorResult, Schema } from 'jsonschema';
import { JspfI, JspfPlaylistI, JspfTrackI, JspfAttributionI, JspfMetaI, JspfLinkI, JspfExtensionI } from './interfaces';
export declare class JspfBase {
    constructor(data?: any);
    toJSON(): Record<string, any>;
    toDTO(): Record<string, any>;
    toString(): string;
}
export declare class JspfValidation extends JspfBase {
    validator: Validator;
    validation: ValidatorResult;
    isValid(schema?: Schema): boolean;
    private static removeValuesWithErrors;
    private static removeValueForError;
}
export declare class SinglePair extends JspfValidation {
    [key: string]: any;
    static schemaPath: string;
    toJSON(): Record<string, any>;
    toString(): string;
}
export declare class JspfAttribution extends SinglePair implements JspfAttributionI {
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JspfMeta extends SinglePair implements JspfMetaI {
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JspfLink extends SinglePair implements JspfLinkI {
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JspfExtension extends JspfValidation implements JspfExtensionI {
    [key: string]: any;
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JspfTrack extends JspfValidation implements JspfTrackI {
    location: string[];
    identifier: string[];
    title: string;
    creator: string;
    annotation: string;
    info: string;
    image: string;
    album: string;
    trackNum: number;
    duration: number;
    link: JspfLink[];
    meta: JspfMeta[];
    extension: JspfExtension;
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JspfPlaylist extends JspfValidation implements JspfPlaylistI {
    title: string;
    creator: string;
    annotation: string;
    info: string;
    location: string;
    identifier: string;
    image: string;
    date: string;
    license: string;
    attribution: JspfAttribution[];
    link: JspfLink[];
    meta: JspfMeta[];
    extension: JspfExtension;
    track: JspfTrack[];
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class Jspf extends JspfValidation implements JspfI {
    playlist: JspfPlaylist;
    static get_schema(schema?: Schema): Schema;
    isValid(schema?: Schema): boolean;
}
export declare class JSONValidationErrors extends Error {
    validation: ValidatorResult;
    name: string;
    constructor(message: string, validation: ValidatorResult);
}
