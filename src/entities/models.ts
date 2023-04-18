import { Type } from 'class-transformer';

import {getConverterByType} from '../convert/index';
import {ConvertOptionsI} from '../convert/interfaces';
import {JSONValidationErrors} from "./jspf/models";
import {JspfPlaylistI} from './jspf/interfaces';
import {PlaylistI,TrackI,AttributionI,MetaI,LinkI,ExtensionI} from './interfaces';
import {JspfObject,JspfPlaylist,JspfTrack,JspfAttribution,JspfMeta,JspfLink,JspfExtension} from './jspf/models';

export class Attribution extends JspfAttribution implements AttributionI{
}

export class Link extends JspfLink implements LinkI{
}

export class Meta extends JspfMeta implements MetaI{
}

export class Extension extends JspfExtension implements ExtensionI{
}

export class Track extends JspfTrack implements TrackI{
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

export class Playlist extends JspfPlaylist implements PlaylistI{
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

  public tracks(): Track[] {
    return this.track || [];
  }

  public import(data:string,format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):boolean|undefined{
    const converterClass = getConverterByType(format);
    const converter = new converterClass();
    const dto:JspfPlaylistI = converter.get(data);

    this.constructor(dto);

    try{
      this.isValid();//will eventually throw a JSONValidationErrors
      return true;
    }catch(e){
      if (e instanceof JSONValidationErrors) {
        if (!options.ignoreValidationErrors){
          throw(e);
        }
      }else{
        throw(e);
      }
    }

  }

  public export(format:string='jspf',options: ConvertOptionsI = {ignoreValidationErrors: false,stripInvalid:true}):string|undefined{

    try{
      this.isValid();//will eventually throw a JSONValidationErrors
    }catch(e){
      if (e instanceof JSONValidationErrors) {
        if (!options.ignoreValidationErrors){
          throw(e);
        }
      }else{
        throw(e);
      }
    }

    const converterClass = getConverterByType(format);
    const converter = new converterClass();

    const dto:JspfPlaylistI = this.toDTO();
    const data:string = converter.set(dto);
    return data;
  }

}

export class Jspf extends JspfObject{
  @Type(() => Playlist)
  playlist: Playlist;
}
