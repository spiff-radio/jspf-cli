import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';
import jsonSchema from './jspf-schema.json';
import {DTOJspfI,DTOPlaylistI,DTOTrackI,DTOAttributionI,DTOMetaI,DTOLinkI,DTOExtensionI,DTOConverterI} from './interfaces';
import {removeEmptyAndUndefined} from '../utils';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class DTOBase{
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

export class DTOAttribution extends DTOBase implements DTOAttributionI{
  [key: string]: string;
}

export class DTOMeta extends DTOBase implements DTOMetaI{
  [key: string]: string;
}

export class DTOLink extends DTOBase implements DTOLinkI{
  [key: string]: string;
}

export class DTOExtension extends DTOBase implements DTOExtensionI{
  [key: string]: string[];
}

export class DTOTrack extends DTOBase implements DTOTrackI{
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
  link: DTOLink[];
  meta: DTOMeta[];
  extension: DTOExtension;
}

export class DTOPlaylist extends DTOBase implements DTOPlaylistI{
  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  attribution: DTOAttribution[];
  link: DTOLink[];
  meta: DTOMeta[];
  extension: DTOExtension;
  track: DTOTrack[];

  @Exclude()
  private validator;

  @Exclude()
  private validation;

  constructor(data?: any, options: PlaylistOptions = defaultPlaylistOptions) {

    super(data);

    this.validator = new Validator();
    this.validation = this.validator.validate(data,jsonSchema);

    //clean input data
    if (options.stripNotValid){
      data = DTOPlaylist.removeValuesWithErrors(data,this.errors);
    }

    plainToClassFromExist(this, data);

  }

  public is_valid(){
    return (!this.validation.errors.length);
  }

  public get errors():ValidationError[] | undefined{
    if (!this.validation.errors.length) return undefined;
    return this.validation.errors;
  }

  private static removeValuesWithErrors(dto:DTOPlaylistI,errors:ValidationError[] | undefined):DTOPlaylistI {
    errors = errors ?? [];
    errors.forEach(error => DTOPlaylist.removeValueForError(dto,error));
    return dto;
  }

  private static removeValueForError(dto:DTOPlaylistI, error: ValidationError): object {
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
  //TOUFIX should be within class DTOBase ?
  public toJSON():Record<string, any>{
    let obj = classToPlain(this);
    obj = removeEmptyAndUndefined(obj);
    return obj;
  }


  //export to string - override built-in class function
  //TOUFIX should be within class DTOBase ?
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }

}

export class DTOJspf extends DTOBase implements DTOJspfI {
  @Type(() => DTOPlaylist)
  playlist:DTOPlaylist

  //export to JSON - override built-in class function
  //TOUFIX should be within class DTOBase ?
  public toJSON():Record<string, any>{
    let obj = classToPlain(this);
    obj = removeEmptyAndUndefined(obj);
    return obj;
  }

  //export to string - override built-in class function
  //TOUFIX should be within class DTOBase ?
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }

}

export abstract class DTOConverter implements DTOConverterI {
  public static readonly types: string[] = [];

  //get DTO playlist from data
  public abstract get(data: any): DTOPlaylistI;

  //converts DTO playlist to data
  public abstract set(dto: DTOPlaylistI): any;
}
