import { validate,validateSync, IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type,Transform, TransformFnParams, plainToClass, plainToClassFromExist,classToPlain,instanceToInstance } from 'class-transformer';
import {IsSinglePropertyObject} from './validation-custom';
import {TransformDate,TransformPair} from './transform-custom';
import {JSPF_VERSION,XSPF_VERSION,XSPF_XMLNS} from './../constants';
import { json2xml } from 'xml-js';


export class SinglePair {
  rel: string;
  content: any;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class Attribution extends SinglePair{
  @IsString()
  rel: string;
  @IsUrl()
  content:string;
}

export class Meta extends SinglePair{
  @IsUrl()
  rel: string;
  content:any;
}

export class Link extends SinglePair{
  @IsUrl()
  rel: string;
  @IsUrl()
  content:string;
}

export class Extension extends SinglePair{
  @IsUrl()
  rel: string;
  @IsArray()
  content:any[];
}

export class Track {

  @IsOptional()
  @IsArray()
  @IsUrl({},{each:true})
  location?: string[];


  @IsOptional()
  @IsArray()
  @IsUrl({},{each:true})
  identifier?: string[];

  @IsOptional()
  @IsDefined()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  creator?: string;

  @IsOptional()
  @IsString()
  annotation?: string;

  @IsOptional()
  @IsUrl()
  info?: URL;

  @IsOptional()
  @IsUrl()
  image?: URL;

  @IsOptional()
  album?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  trackNum?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Link})
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Meta})
  meta?: Meta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:Extension})
  extension?: Extension;

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

}

type PlaylistOptions = {
  strip: boolean
}


export class Playlist {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  creator?: string;

  @IsOptional()
  @IsString()
  annotation?: string;

  @IsOptional()
  @IsUrl()
  info?: URL;

  @IsOptional()
  @IsUrl()
  location?: URL;

  @IsOptional()
  @IsUrl()
  identifier?: URL;

  @IsOptional()
  @IsUrl()
  image?: URL;

  @IsOptional()
  @IsDate()
  @TransformDate
  date?: Date;

  @IsOptional()
  @IsUrl()
  license?: URL;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @TransformPair({each:true,type:Attribution})
  attribution?: Attribution[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Link})
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Meta})
  meta?: Meta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:Extension})
  extension?: Extension;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Track)
  track?: Track[];

  constructor(data?: any,options: PlaylistOptions = { strip: false }) {
    plainToClassFromExist(this, data);
  }

  public toXML(data:any){
    const playlist = new Playlist(data);
    const playlistXML = new PlaylistXML(playlist);
    data = classToPlain(playlistXML);

    //add XML declaration

    //add playlist attributes
    data.playlist = {
      ...data.playlist,
      _attributes: {
        version: XSPF_VERSION,
        xmlns: XSPF_XMLNS
      }
    };


    const xml = json2xml(JSON.stringify(data), { compact: true, spaces: 4 });
    return xml;
  }

}

export class PlaylistXML{
  _declaration:object = {
    _attributes:{
      version:"1.0",
      encoding:"utf-8"
    }
  }
  playlist:any;

  constructor(playlist?: any) {

    this.playlist = classToPlain(playlist).playlist;

    //move tracks within a trackList node
    this.playlist.trackList = {track:this.playlist.track};
    delete this.playlist.track;

    //update some of the single nodes recursively
    this.updateNodes(this.playlist);

  }

  //TOUFIX. This should be better coded if it was within a transform function used with class-transform.
  updateNodes(data: any) {

    const updateSingle = (data:any,type:string) => {
      const prop_name:string = Object.keys(data)[0];
      const prop_value:any = data[prop_name];

      switch(type){
        case 'link':

          return {
            _attributes: {
              rel:prop_name,
              href:prop_value
            }
          }

        break;
        case 'meta':

          return {
            _attributes: {
              rel:prop_name,
              content:prop_value
            }
          }

        break;
        case 'extension':
          //TOUFIX
        break;
        case 'attribution':
          //TOUFIX
        break;
        default:
          return data;
      }

    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        this.updateNodes(data[i]);
      }
    } else if (typeof data === 'object') {
      for (let key in data) {

        //process the content of those nodes
        if (['link', 'meta', 'extension', 'attribution'].includes(key)) {

          if ( Array.isArray(data[key]) ){
            data[key] = data[key].map((item:any) => {return updateSingle(item,key)});
          }else{
            data[key] = updateSingle(data[key],key);
          }

        }

        this.updateNodes(data[key]);

      }
    }
  }

}
