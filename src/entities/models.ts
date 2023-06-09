import { plainToClass, plainToClassFromExist,classToPlain, Expose, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema} from 'jsonschema';
import {JspfI,JspfPlaylistI,JspfTrackI,JspfAttributionI,JspfMetaI,JspfLinkI,JspfExtensionI} from './interfaces';
import {cleanNestedObject,getChildSchema} from '../utils';
import {getConverterByType} from '../convert/index';


type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class JspfBase{

  constructor(data?: any) {
    plainToClassFromExist(this, data, { excludeExtraneousValues: true, exposeUnsetFields: false });
  }

  //export to JSON - override built-in class function
  public toJSON(): Record<string, any> {
    let obj = classToPlain(this);
    return obj;
  }

  //export a DTO (data transfer object) :
  //- strip all empty and undefined values
  public toDTO(): Record<string, any> {
    let obj = this.toJSON();
    obj = cleanNestedObject(obj);
    return obj;
  }

  //export to string - override built-in class function
  public toString():string{
    return JSON.stringify(this.toJSON(), null, 4);
  }

}

export class JspfValidation extends JspfBase{
  validator:Validator;
  validation:ValidatorResult;

  //Checks if a JSPF fragment is valid against a JSON schema (defining a full JSPF).
  public isValid(schema:Schema = {}):boolean{
    this.validator = new Validator();
    this.validation = this.validator.validate(this.toDTO(),schema);
    if (this.validation.errors.length){
      throw new JSONValidationErrors("The playlist is not valid.",this.validation);
    }else{
      return true;
    }
  }

  private static removeValuesWithErrors(dto:JspfPlaylistI,errors:ValidationError[] | undefined):JspfPlaylistI {
    errors = errors ?? [];
    errors.forEach(error => JspfValidation.removeValueForError(dto,error));
    return dto;
  }

  private static removeValueForError(dto:JspfPlaylistI, error: ValidationError): object {
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

export class SinglePair extends JspfValidation{
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

export class JspfAttribution extends SinglePair implements JspfAttributionI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/attribution',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfAttribution.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfMeta extends SinglePair implements JspfMetaI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/meta',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfMeta.get_schema(schema);
    return super.isValid(schema);
  }
}

/*
export class JspfMetaCollection extends Array<JspfMetaI> implements JspfMetaCollectionI {
  getMeta(key: string) {
    const meta = this.find(meta => meta.keys[0] === key);
    return meta;
  }

  getMetaValue(key: string): string | null {
    const meta = this.getMeta(key);
    return meta ? meta.values[0] : null;
  }

  removeMeta(key: string) {
    const existing = this.getMeta(key);
    const index = this.indexOf(existing);
    if (index !== -1) {
      this.splice(index, 1);
    }
  }

  setMeta(key: string, value: string) {
    // Remove any existing meta with the same key
    this.removeMeta(key);

    const metaObj = { [key]: value };
    this.push(metaObj);
  }

  mergeMetas(metas: JspfMetaCollectionI) {
    metas.forEach(meta => {
      const key = meta.keys[0];
      const value = meta[key];
      this.setMeta(key, value);
    });
  }
}
*/

export class JspfLink extends SinglePair implements JspfLinkI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/link',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfLink.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfExtension extends JspfValidation implements JspfExtensionI{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string[];
  [key: string]: any;

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/extension',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfExtension.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfTrack extends JspfValidation implements JspfTrackI{

  @Expose()
  location: string[];

  @Expose()
  identifier: string[];

  @Expose()
  title: string;

  @Expose()
  creator: string;

  @Expose()
  annotation: string;

  @Expose()
  info: string;

  @Expose()
  image: string;

  @Expose()
  album: string;

  @Expose()
  trackNum: number;

  @Expose()
  duration: number;

  @Expose()
  @Type(() => JspfLink)
  link: JspfLink[];

  @Expose()
  @Type(() => JspfMeta)
  meta: JspfMeta[];

  @Expose()
  @Type(() => JspfExtension)
  extension: JspfExtension;

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/track',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfTrack.get_schema(schema);
    return super.isValid(schema);
  }

}

export class JspfPlaylist extends JspfValidation implements JspfPlaylistI{
  @Expose()
  title: string;

  @Expose()
  creator: string;

  @Expose()
  annotation: string;

  @Expose()
  info: string;

  @Expose()
  location: string;

  @Expose()
  identifier: string;

  @Expose()
  image: string;

  @Expose()
  date: string;

  @Expose()
  license: string;

  @Expose()
  @Type(() => JspfAttribution)
  attribution: JspfAttribution[];

  @Expose()
  @Type(() => JspfLink)
  link: JspfLink[];

  @Expose()
  @Type(() => JspfMeta)
  meta: JspfMeta[];

  @Expose()
  @Type(() => JspfExtension)
  extension: JspfExtension;

  @Expose()
  @Type(() => JspfTrack)
  track: JspfTrack[];

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('properties/playlist',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfPlaylist.get_schema(schema);
    return super.isValid(schema);
  }

}

export class Jspf extends JspfValidation implements JspfI {
  @Expose()
  @Type(() => JspfPlaylist)
  playlist:JspfPlaylist

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Jspf.get_schema(schema);
    return super.isValid(schema);
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
