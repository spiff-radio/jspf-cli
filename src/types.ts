//
https://github.com/metabrainz/listenbrainz-server/blob/cdc4df46738402d7d003acf08febfe7c7cf2fe4f/frontend/js/src/utils/types.d.ts

export type URI = string;
export type URICollection = URI[];

export type JSPFAttribution = Record<string,URI>;
export type JSPFAttributionCollection = JSPFAttribution[];

export type JSPFLink = Record<URI,URI>;
export type JSPFLinkCollection = JSPFLink[];

export type JSPFMeta = Record<URI,any>;
export type JSPFMetaCollection = JSPFMeta[];

export type JSPFExtension = Record<URI,any>;

export type JSPFTrack{
  location?: URICollection,
  identifier?: URICollection,
  title?: string,
  creator?: string,
  annotation?: string,
  info?: URI,
  image?: URI,
  album?: URI,
  trackNum?: number,/*should be a non-negative integer*/
  duration?: number,/*should be a non-negative integer*/
  link?: JSPFLinkCollection,
  meta?: JSPFMetaCollection,
  extension?: JSPFExtension
};

export type JSPFTrackCollection = JSPFTrack[];

export type JSPFPlaylist{
  title?: string,
  creator?: string,
  annotation?: string,
  info?: URI,
  location?: URI,
  identifier?: URI,
  image?: URI,
  date?: Date, /*DateTimeIso8601String*/,
  license?: URI,
  attribution?: JSPFAttributionCollection,
  link?: JSPFLinkCollection,
  meta?: JSPFMetaCollection,
  extension?: JSPFExtension,
  track?: JSPFTrack[]
};

export type JSPFObject = {
  playlist: JSPFPlaylist
};



class Playlist = {
  //fill the object based on a JSON string
  public fromJson(json: string){
  }
  //converts the object to a JSON string
  public toJson(): string {
  }
  public addTracks(tracks:JSPFTrack[]) {
  }
  public removeTracks(tracks:JSPFTrack[]) {
  }
  public reindexTracks(tracks:JSPFTrack[],startNum:number) {
  }
  public clearTracks(){
  }
}

class JspfTrackClass = {
  static parse(jspf:string){
    //method to parse an input JSON playlist
  }

}
*/
