import { plainToClass, plainToClassFromExist,classToPlain, Exclude, Type } from 'class-transformer';
import {Validator, ValidatorResult, ValidationError, Schema} from 'jsonschema';
import {JspfBaseI,JspfObjectI,JspfPlaylistI,JspfTrackI,JspfAttributionI,JspfMetaI,JspfLinkI,JspfExtensionI} from './interfaces';
import {cleanNestedObject,getChildSchema} from '../../utils';

type PlaylistOptions = {
  notValidError?: boolean,
  stripNotValid?: boolean
}

const defaultPlaylistOptions: PlaylistOptions = {
  notValidError: true,
  stripNotValid: true
};

export class JspfBase implements JspfBaseI{

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

export class JspfValidate extends JspfBase{
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

  private static removeValuesWithErrors(dto:JspfPlaylistI,errors:ValidationError[] | undefined):JspfPlaylistI {
    errors = errors ?? [];
    errors.forEach(error => JspfPlaylist.removeValueForError(dto,error));
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

export class JspfSingleKeyValue extends JspfValidate{
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

export class JspfAttribution extends JspfSingleKeyValue implements JspfAttributionI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/attribution',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfAttribution.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfMeta extends JspfSingleKeyValue implements JspfMetaI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/meta',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfMeta.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfLink extends JspfSingleKeyValue implements JspfLinkI{
  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('$defs/link',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfLink.get_schema(schema);
    return super.isValid(schema);
  }
}

export class JspfExtension extends JspfValidate implements JspfExtensionI{
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

export class JspfTrack extends JspfValidate implements JspfTrackI{

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
  @Type(() => JspfLink)
  link: JspfLink[];
  @Type(() => JspfMeta)
  meta: JspfMeta[];
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

export class JspfPlaylist extends JspfValidate implements JspfPlaylistI{

  title: string;
  creator: string;
  annotation: string;
  info: string;
  location: string;
  identifier: string;
  image: string;
  date: string;
  license: string;
  @Type(() => JspfAttribution)
  attribution: JspfAttribution[];
  @Type(() => JspfLink)
  link: JspfLink[];
  @Type(() => JspfMeta)
  meta: JspfMeta[];
  @Type(() => JspfExtension)
  extension: JspfExtension;
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

export class JspfObject extends JspfValidate implements JspfObjectI {

  @Type(() => JspfPlaylist)
  playlist:JspfPlaylist

  public static get_schema(schema?:Schema):Schema{
    return getChildSchema('',schema);
  }

  public isValid(schema?:Schema):boolean{
    schema = JspfObject.get_schema(schema);
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
