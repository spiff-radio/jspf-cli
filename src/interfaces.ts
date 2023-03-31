/**
 * The base GeoJSON object.
 * https://tools.ietf.org/html/rfc7946#section-3
 * The GeoJSON specification also allows foreign members
 * (https://tools.ietf.org/html/rfc7946#section-6.1)
 * Developers should use "&" type in TypeScript or extend the interface
 * to add these foreign members.
 */

export type Integer<T extends number> = '${T}' extends '${bigint}' ? T : never;
export type NonNegative<T extends Numeric> = T extends Zero ? T : Negative<T> extends never ? T : never;
export type NonNegativeInteger<T extends number> = NonNegative<Integer<T>>;

export type JspfMeta = Record<URL,any>
export type JspfMetaCollection = JspfMeta[]

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
  location?: string[],/*uri collection*/
  identifier?: string[],/*uri collection*/
  title?: string,
  creator?: string,
  annotation?: string,
  info?: string,/*uri*/
  image?: string,/*uri*/
  album?: string,
  trackNum?: NonNegativeInteger,/*positive number*/
  duration?: NonNegativeInteger,/*positive number*/
  link?: JspfLink[],
	meta?: JspfMeta[],
	extension?: JspfExtension
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
	attribution?: JspfAttribution[],
	link?: JspfLink[],
	meta?: JspfMeta[],
	extension?: JspfExtension,
	track?: JspfTrack[],
}
