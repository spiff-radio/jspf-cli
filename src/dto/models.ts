import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';
import defaultJsonSchema from './jspf-schema.json';
import {JSPFDataI,PlaylistDataI,TrackDataI,AttributionDataI,MetaDataI,LinkDataI,ExtensionDataI,DataConverterI} from './interfaces';
import {removeEmptyAndUndefined} from '../utils';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class BaseData{
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

  /*
  //export to JSON - override built-in class function

  toJSON():Record<string, any>{

  }

  //export to string - override built-in class function
  toString():any{
  }
  */

}

export class AttributionData extends BaseData implements AttributionDataI{
  [key: string]: string;
}

export class MetaData extends BaseData implements MetaDataI{
  [key: string]: string;
}

export class LinkData extends BaseData implements LinkDataI{
  [key: string]: string;
}

export class ExtensionData extends BaseData implements ExtensionDataI{
  [key: string]: string[];
}

export class TrackData extends BaseData implements TrackDataI{
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
  link: LinkData[];
  meta: MetaData[];
  extension: ExtensionData;
}

export class PlaylistData extends BaseData implements PlaylistDataI{
  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  attribution: AttributionData[];
  link: LinkData[];
  meta: MetaData[];
  extension: ExtensionData;
  track: TrackData[];

  @Exclude()
  validator:any;//FIX type

  @Exclude()
  validation:any;//FIX type

  constructor(data?: any, options: PlaylistOptions = defaultPlaylistOptions) {

    super(data);

    this.validator = new Validator();

    //clean input data
    if (options.stripNotValid){
      const valid = this.is_valid(); //populate validation errors
      data = PlaylistData.removeValuesWithErrors(data,this.validation.errors);
    }

    plainToClassFromExist(this, data);

  }

  public is_valid(jsonSchema = defaultJsonSchema):boolean{
    this.validation = this.validator.validate(this.toJSON(),defaultJsonSchema);
    return (!this.validation.errors.length);
  }

  private static removeValuesWithErrors(dto:PlaylistDataI,errors:ValidationError[] | undefined):PlaylistDataI {
    errors = errors ?? [];
    errors.forEach(error => PlaylistData.removeValueForError(dto,error));
    return dto;
  }

  private static removeValueForError(dto:PlaylistDataI, error: ValidationError): object {
    const errorPath = error.property.replace(/\[(\w+)\]/g, '.$1').split('.');
    let currentNode: { [key: string]: any } = dto;

    for (let i = 0; i < errorPath.length; i++) {
      const key = errorPath[i];
      if (i === errorPath.length - 1) {
        if (Array.isArray(currentNode)) {
          if (key !== null) {
            currentNode.splice(parseInt(key, 10), 1);
          }
        } else if (typeof currentNode === 'object') {
          delete currentNode[key];
        }
      } else {
        if (!currentNode.hasOwnProperty(key)) {
          // Property is not defined in the data, maybe already deleted, move on to next error
          continue;
        }
        currentNode = currentNode[key];
      }
    }
    return dto;
  }


  //export to JSON - override built-in class function
  //TOUFIX should be within class BaseData ?
  public toJSON():Record<string, any>{
    let obj = classToPlain(this);
    obj = removeEmptyAndUndefined(obj);
    return obj;
  }


  //export to string - override built-in class function
  //TOUFIX should be within class BaseData ?
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }

}

export class JSPFData extends BaseData implements JSPFDataI {
  @Type(() => PlaylistData)
  playlist:PlaylistData

  //export to JSON - override built-in class function
  //TOUFIX should be within class BaseData ?
  public toJSON():Record<string, any>{
    let obj = classToPlain(this);
    obj = removeEmptyAndUndefined(obj);
    return obj;
  }

  //export to string - override built-in class function
  //TOUFIX should be within class BaseData ?
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }

}

export abstract class DataConverter implements DataConverterI {
  public static readonly types: string[] = [];

  //get DTO playlist from data
  public abstract get(data: any): PlaylistDataI;

  //converts DTO playlist to data
  public abstract set(dto: PlaylistDataI): any;
}
