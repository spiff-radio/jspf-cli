//https://github.com/metabrainz/listenbrainz-server/blob/cdc4df46738402d7d003acf08febfe7c7cf2fe4f/frontend/js/src/utils/types.d.ts
import 'reflect-metadata';
import {plainToClass,classToPlain} from "class-transformer";


export type URIT = string;

export type JSPFAttributionT = Record<string,URIT>;
export type JSPFLinkT = Record<URIT,URIT>;
export type JSPFMetaT = Record<URIT,any>;
export type JSPFExtensionT = Record<URIT,any>;

export interface JSPFTrackT{
  location?: URIT[],
  identifier?: URIT[],
  title?: string,
  creator?: string,
  annotation?: string,
  info?: URIT,
  image?: URIT,
  album?: URIT,
  trackNum?: number,//should be a non-negative integer
  duration?: number,//should be a non-negative integer
  link?: JSPFLinkT[],
  meta?: JSPFMetaT[],
  extension?: JSPFExtensionT
};

export interface JSPFPlaylistT{
  title?: string,
  creator?: string,
  annotation?: string,
  info?: URIT,
  location?: URIT,
  identifier?: URIT,
  image?: URIT,
  date?: Date, //DateTimeIso8601String
  license?: URIT,
  attribution?: JSPFAttributionT[],
  link?: JSPFLinkT[],
  meta?: JSPFMetaT[],
  extension?: JSPFExtensionT,
  track?: JSPFTrackT[]
};

export interface JSPFObjectT{
  playlist: JSPFPlaylistT
};

export class JSPFTrack implements JSPFTrackT{
  location?: URIT[];
  identifier?: URIT[];
  title?: string;
  creator?: string;
  annotation?: string;
  info?: URIT;
  image?: URIT;
  album?: URIT;
  trackNum?: number;//should be a non-negative integer
  duration?: number;//should be a non-negative integer
  link?: JSPFLinkT[];
  meta?: JSPFMetaT[];
  extension?: JSPFExtensionT;

}

export class JSPFPlaylist implements JSPFPlaylistT {
  title?: string;
  creator?: string;
  annotation?: string;
  info?: URIT;
  location?: URIT;
  identifier?: URIT;
  image?: URIT;
  date?: Date; //DateTimeIso8601String
  license?: URIT;
  attribution?: JSPFAttributionT[];
  link?: JSPFLinkT[];
  meta?: JSPFMetaT[];
  extension?: JSPFExtensionT;
  track?: JSPFTrackT[];
  public addTracks(tracks:JSPFTrack[]) {
  }
  public removeTracks(tracks:JSPFTrack[]) {
  }
  public reindexTracks(tracks:JSPFTrack[],startNum:number) {
  }
  public clearTracks(){
  }
  public hello():string {
    return 'hello ' + this.title;
  }
}

export class JSPFObject implements JSPFObjectT {
  playlist:JSPFPlaylistT
}

//convert JSON to classes & vice-versa
export class JSPFConverter{
  public static objectFromJSON(json: string){
    const obj = JSON.parse(json);
    return plainToClass(JSPFObject,obj)
  }
  public static JSONFromObject(object: JSPFObjectT){
    return classToPlain(object);
  }
  public static playlistFromJSON(json: string){
    const obj = JSON.parse(json);
    return plainToClass(JSPFPlaylist,obj)
  }
  public static JSONFromPlaylist(playlist: JSPFPlaylistT){
    return classToPlain(playlist)
  }
  public static trackFromJSON(json: string){
    const obj = JSON.parse(json);
    return plainToClass(JSPFTrack,obj)
  }
  public static JSONFromTrack(track: JSPFTrackT){
    return classToPlain(track)
  }
}
