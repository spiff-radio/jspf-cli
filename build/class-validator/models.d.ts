/// <reference types="node" />
export declare class SinglePair {
    rel: string;
    content: any;
    constructor(data?: any);
}
export declare class JspfAttribution extends SinglePair {
    rel: string;
    content: string;
}
export declare class JspfMeta extends SinglePair {
    rel: string;
    content: any;
}
export declare class JspfLink extends SinglePair {
    rel: string;
    content: string;
}
export declare class JspfExtension extends SinglePair {
    rel: string;
    content: any[];
}
export declare class JspfTrack {
    location?: string[];
    identifier?: string[];
    title?: string;
    creator?: string;
    annotation?: string;
    info?: URL;
    image?: URL;
    album?: string;
    trackNum?: number;
    duration?: number;
    link?: JspfLink[];
    meta?: JspfMeta[];
    extension?: JspfExtension;
    constructor(data?: any);
}
type PlaylistOptions = {
    strip: boolean;
};
export declare class JspfPlaylist {
    title?: string;
    creator?: string;
    annotation?: string;
    info?: URL;
    location?: URL;
    identifier?: URL;
    image?: URL;
    date?: Date;
    license?: URL;
    attribution?: JspfAttribution[];
    link?: JspfLink[];
    meta?: JspfMeta[];
    extension?: JspfExtension;
    track?: JspfTrack[];
    constructor(data?: any, options?: PlaylistOptions);
}
export {};
