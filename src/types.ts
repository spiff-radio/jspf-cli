//https://github.com/metabrainz/listenbrainz-server/blob/cdc4df46738402d7d003acf08febfe7c7cf2fe4f/frontend/js/src/utils/types.d.ts
import {Type,Expose} from "class-transformer";


export type URIT = string;

export type JSPFAttributionT = Record<string,URIT>;
export type JSPFLinkT = Record<URIT,URIT>;
//export type JSPFMetaT = Record<URIT,any>;
export type JSPFMetaT = {
  [url: string]: any;
};
export type JSPFExtensionT = Record<URIT,any>;

export interface JSPFTrackT{
  location: Set<URIT>,
  identifier: URIT[],
  title: string,
  creator: string,
  annotation: string,
  info: URIT,
  image: URIT,
  album: URIT,
  trackNum: number,//should be a non-negative integer
  duration: number,//should be a non-negative integer
  link: JSPFLinkT[],
  meta: JSPFMetaT[],
  extension: JSPFExtensionT
};

export interface JSPFPlaylistT{
  title: string,
  creator: string,
  annotation: string,
  info: URIT,
  location: URIT,
  identifier: URIT,
  image: URIT,
  date: Date, //DateTimeIso8601String
  license: URIT,
  attribution: JSPFAttributionT[],
  link: JSPFLinkT[],
  meta: JSPFMetaT[],
  extension: JSPFExtensionT,
  track: JSPFTrackT[]
};

export interface JSPFObjectT{
  playlist: JSPFPlaylistT
};

export class JSPFTrack{

  @Expose()
  location: Set<URIT>;

  @Expose()
  identifier: Set<URIT>;

  @Expose()
  title: string;

  @Expose()
  creator: string;

  @Expose()
  annotation: string;

  @Expose()
  info: URIT;

  @Expose()
  image: URIT;

  @Expose()
  album: URIT;

  @Expose()
  trackNum: number;//should be a non-negative integer

  @Expose()
  duration: number;//should be a non-negative integer

  @Expose()
  link: JSPFLinkT[];

  @Expose()
  meta: JSPFMetaT[];

  @Expose()
  extension: JSPFExtensionT;

  constructor(partial: Partial<JSPFTrack>) {
    console.log("ZOB")
    Object.assign(this, partial);
  }

  hello(){
    return "TRACK YO"
  }

}

export class JSPFPlaylist {
  @Expose()
  title: string;

  @Expose()
  creator: string;

  @Expose()
  annotation: string;

  @Expose()
  info: URIT;

  @Expose()
  location: URIT;

  @Expose()
  identifier: URIT;

  @Expose()
  image: URIT;

  @Type(() => Date)
  @Expose()
  date: Date; //DateTimeIso8601String

  @Expose()
  license: URIT;

  @Expose()
  attribution: JSPFAttributionT[];

  @Expose()
  link: JSPFLinkT[];

  @Expose()
  meta: JSPFMetaT[];

  @Expose()
  extension: JSPFExtensionT;

  @Type(() => JSPFTrack)
  @Expose()
  track: JSPFTrack[];

  constructor(partial: Partial<JSPFPlaylist>) {
    Object.assign(this, partial);
  }

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
