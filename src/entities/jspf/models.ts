import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema as JSONSchema} from 'jsonschema';
import defaultJsonSchema from './jspf-schema.json';
import {JSPFDataI,PlaylistDataI,TrackDataI,AttributionDataI,MetaDataI,LinkDataI,ExtensionDataI} from './interfaces';
import {removeEmptyAndUndefined} from '../../utils';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class BaseData{

  @Exclude()
  validator:any;//FIX type

  @Exclude()
  validation:any;//FIX type

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

  public is_valid(jsonSchema?:JSONSchema):boolean{
    this.validator = new Validator();
    jsonSchema = defaultJsonSchema;
    this.validation = this.validator.validate(this.toJSON(),jsonSchema);
    return (!this.validation.errors.length);
  }

  //export to JSON - override built-in class function
  public toJSON():any{
    let obj = classToPlain(this);
    //obj = removeEmptyAndUndefined(obj);
    return obj;
  }


  //export to string - override built-in class function
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }


}

export class SingleKeyValue extends BaseData{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string;
  [key: string]: any;
  toJSON(){
    return classToPlain(this);
  }
  toString(){
    return JSON.stringify(this.toJSON());
  }
}

export class AttributionData extends SingleKeyValue implements AttributionDataI{
}

export class MetaData extends SingleKeyValue implements MetaDataI{
}

export class LinkData extends SingleKeyValue implements LinkDataI{
}

export class ExtensionData extends BaseData implements ExtensionDataI{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string[];
  [key: string]: any;
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
