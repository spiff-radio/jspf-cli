import { Type } from 'class-transformer';
import {DTOJspf,DTOPlaylist,DTOTrack,DTOAttribution,DTOMeta,DTOLink,DTOExtension,DTOConverter} from '../dto/models';

export class Attribution extends DTOAttribution{
}

export class Link extends DTOLink{
}

export class Meta extends DTOMeta{
}

export class Extension extends DTOExtension{
}

export class Track extends DTOTrack{
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

export class Playlist extends DTOPlaylist{
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
}

export class Jspf extends DTOJspf{
  @Type(() => Playlist)
  playlist: Playlist;
}
