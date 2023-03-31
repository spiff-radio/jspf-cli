/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */
export interface JspfObject {
}

export interface JspfAttribution extends JspfObject {
}

export interface JspfLink extends JspfObject {
}

export interface JspfMeta extends JspfObject {
}

export interface JspfExtension extends JspfObject {
}

export interface JspfTrack extends JspfObject {
}

export interface JspfPlaylist extends JspfObject {
  title?: string,
	creator?: string,
	annotation?: string,
	info?: string,/*uri*/
	location?: string,/*uri*/
	identifier?: string,/*uri*/
	image?: string,/*uri*/
	date?: Date, /*DateTimeIso8601String*/,
	license?: string,/*uri*/
	attribution?: Attribution[],
	link?: Link[],
	meta?: Meta[],
	extension?: Extension,
	track?: Track[],
}
