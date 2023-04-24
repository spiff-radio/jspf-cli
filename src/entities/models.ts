import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema} from 'jsonschema';
import {JspfI,PlaylistI,TrackI,AttributionI,MetaI,LinkI,ExtensionI} from './interfaces';
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
    plainToClassFromExist(this, data);
  }

  //export to JSON - override built-in class function
  public toJSON(): Record<string, any> {
    let obj = classToPlain(this, { excludePrefixes: ['_'] });
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

export class Validation extends JspfBase{
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

  private static removeValuesWithErrors(dto:PlaylistI,errors:ValidationError[] | undefined):PlaylistI {
    errors = errors ?? [];
    errors.forEach(error => Playlist.removeValueForError(dto,error));
    return dto;
  }

  private static removeValueForError(dto:PlaylistI, error: ValidationError): object {
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

export class SinglePair extends Validation{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string;
  [key: string]: any;
  static schemaPath:string;
  toJSON(){
    return classToPlain(this, { excludePrefixes: ['_'] });
  }
  toString(){
    return JSON.stringify(this.toJSON());
  }
}

export class Attribution extends SinglePair implements AttributionI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/attribution',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Attribution.get_schema(schema);
    return super.isValid(schema);
  }
}

export class Meta extends SinglePair implements MetaI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/meta',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Meta.get_schema(schema);
    return super.isValid(schema);
  }
}

/*
export class MetaCollection extends Array<MetaI> implements MetaCollectionI {
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

  mergeMetas(metas: MetaCollectionI) {
    metas.forEach(meta => {
      const key = meta.keys[0];
      const value = meta[key];
      this.setMeta(key, value);
    });
  }
}
*/

export class Link extends SinglePair implements LinkI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/link',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Link.get_schema(schema);
    return super.isValid(schema);
  }
}

export class Extension extends Validation implements ExtensionI{
  //TOUFIX SHOULD BE THIS BUT FIRES A TS ERROR [key: string]: string[];
  [key: string]: any;

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/extension',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Extension.get_schema(schema);
    return super.isValid(schema);
  }
}

export class Track extends Validation implements TrackI{

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

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/track',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Track.get_schema(schema);
    return super.isValid(schema);
  }

}

export class Playlist extends Validation implements PlaylistI{

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

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('properties/playlist',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Playlist.get_schema(schema);
    return super.isValid(schema);
  }

}

export class Jspf extends Validation implements JspfI {

  @Type(() => Playlist)
  playlist:Playlist

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = Jspf.get_schema(schema);
    return super.isValid(schema);
  }

  //export to JSON - override built-in class function
  //TOUFIX should be within class JspfBase ?
  public toJSON():Record<string, any>{
    let obj = classToPlain(this, { excludePrefixes: ['_'] });
    obj = cleanNestedObject(obj);
    return obj;
  }

  //export to string - override built-in class function
  //TOUFIX should be within class JspfBase ?
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
