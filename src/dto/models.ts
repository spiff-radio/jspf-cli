import { plainToClass, plainToClassFromExist,classToPlain, Exclude } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';
import jsonSchema from './jspf-schema.json';
import {DTOPlaylistI,DTOTrackI,DTOAttributionI,DTOMetaI,DTOLinkI,DTOExtensionI} from './interfaces';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class DTOAttribution implements DTOAttributionI{
  [key: string]: string;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class DTOMeta implements DTOMetaI{
  [key: string]: string;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class DTOLink implements DTOLinkI{
  [key: string]: string;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class DTOExtension implements DTOExtensionI{
  [key: string]: string[];
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class DTOTrack implements DTOTrackI{
  location?: string[];
  identifier?: string[];
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  image?: string;
  album?: string;
  trackNum?: number;
  duration?: number;
  link?: DTOLink[];
  meta?: DTOMeta[];
  extension?: DTOExtension;



  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

}

export class DTOPlaylist implements DTOPlaylistI{
  title?: string;
  creator?: string;
  annotation?: string;
  info?: string;
  location?: string;
  identifier?: string;
  image?: string;
  date?: string;
  license?: string;
  attribution?: DTOAttribution[];
  link?: DTOLink[];
  meta?: DTOMeta[];
  extension?: DTOExtension;
  track?: DTOTrack[];

  @Exclude()
  private validator;

  @Exclude()
  private validation;

  constructor(data?: any, options: PlaylistOptions = defaultPlaylistOptions) {

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

}
