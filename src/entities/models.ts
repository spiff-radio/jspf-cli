import { Type } from 'class-transformer';
import {JSPFData,PlaylistData,TrackData,AttributionData,MetaData,LinkData,ExtensionData,DataConverter} from '../dto/models';

export class Attribution extends AttributionData{
}

export class Link extends LinkData{
}

export class Meta extends MetaData{
}

export class Extension extends ExtensionData{
}

export class Track extends TrackData{
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
  @Type(() => Link)
  link: Link[];
  @Type(() => Meta)
  meta: Meta[];
  @Type(() => Extension)
  extension: Extension;
}

export class Playlist extends PlaylistData{
  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  @Type(() => Attribution)
  attribution: Attribution[];
  @Type(() => Link)
  link: Link[];
  @Type(() => Meta)
  meta: Meta[];
  @Type(() => Extension)
  extension: Extension;
  @Type(() => Track)
  track: Track[];

  hello(){
    console.log("hello");
  }
}

export class Jspf extends JSPFData{
  @Type(() => Playlist)
  playlist: Playlist;
}
