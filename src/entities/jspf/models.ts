import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema} from 'jsonschema';
import {BaseDataI,JSPFDataI,PlaylistDataI,TrackDataI,AttributionDataI,MetaDataI,LinkDataI,ExtensionDataI} from './interfaces';
import {removeEmptyAndUndefined,getChildSchema} from '../../utils';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class BaseData implements BaseDataI{

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

  //export to JSON - override built-in class function
  public toJSON():object{
    let obj = classToPlain(this);
    return obj;
  }

  //export a DTO (data transfer object) :
  //- strip all empty and undefined values
  public toDTO():object{
    let obj = this.toJSON();
    obj = removeEmptyAndUndefined(obj);
    return obj;
  }

  //export to string - override built-in class function
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }


}

export class ValidateData extends BaseData{
  @Exclude()
  validator:any;//FIX type

  @Exclude()
  validation:any;//FIX type

  //Checks if a JSPF fragment is valid against a JSON schema (defining a full JSPF).
  public isValid(schema?:Schema):boolean{
    this.validator = new Validator();
    this.validation = this.validator.validate(this.toDTO(),schema);
    if (this.validation.errors.length){
      throw new JSONValidationErrors("The playlist is not valid.",this.validation);
    }else{
      return true;
    }
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

}

export class SingleKeyValue extends ValidateData{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string;
  [key: string]: any;
  static schemaPath:string;
  toJSON(){
    return classToPlain(this);
  }
  toString(){
    return JSON.stringify(this.toJSON());
  }
}

export class AttributionData extends SingleKeyValue implements AttributionDataI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/attribution',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = AttributionData.get_schema(schema);
    return super.isValid(schema);
  }
}

export class MetaData extends SingleKeyValue implements MetaDataI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/meta',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = MetaData.get_schema(schema);
    return super.isValid(schema);
  }
}

export class LinkData extends SingleKeyValue implements LinkDataI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/link',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = LinkData.get_schema(schema);
    return super.isValid(schema);
  }
}

export class ExtensionData extends ValidateData implements ExtensionDataI{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string[];
  [key: string]: any;

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/extension',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = ExtensionData.get_schema(schema);
    return super.isValid(schema);
  }
}

export class TrackData extends ValidateData implements TrackDataI{

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
  @Type(() => LinkData)
  link: LinkData[];
  @Type(() => MetaData)
  meta: MetaData[];
  @Type(() => ExtensionData)
  extension: ExtensionData;

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/track',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = TrackData.get_schema(schema);
    return super.isValid(schema);
  }

}

export class PlaylistData extends ValidateData implements PlaylistDataI{

  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  @Type(() => AttributionData)
  attribution: AttributionData[];
  @Type(() => LinkData)
  link: LinkData[];
  @Type(() => MetaData)
  meta: MetaData[];
  @Type(() => ExtensionData)
  extension: ExtensionData;
  @Type(() => TrackData)
  track: TrackData[];

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('properties/playlist',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = PlaylistData.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JSPFData extends ValidateData implements JSPFDataI {

  @Type(() => PlaylistData)
  playlist:PlaylistData

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JSPFData.get_schema(schema);
    return super.isValid(schema);
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

export class JSONValidationErrors extends Error {
  validation:ValidatorResult;
  name:string;
  constructor(message:string,validation:ValidatorResult) {
    super(message);
    Object.setPrototypeOf(this, JSONValidationErrors.prototype);//without this, TypeScript build fails - https://www.ashsmith.io/handling-custom-error-classes-in-typescript
    this.validation = validation;
    this.name = 'JSONValidationErrors';
  }
}
