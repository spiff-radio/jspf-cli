import { validate,validateSync, IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type,Transform, TransformFnParams, plainToClass } from 'class-transformer';
import {IsUri} from './isUri'
import {IsSinglePropertyObject} from './isSinglePropertyObject'

/*
function TransformURI(){
  const toPlain = Transform(({ value }) => value.toString(), { toPlainOnly: true });
  const toClass = Transform(({ value }) => new URL(value), { toClassOnly: true });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };

}
*/

type TransformUriOptions = {
  each?: boolean
}


type TransformPairsOptions = {
  each?: boolean
}

export const TransformUri = (options: TransformUriOptions = { each: false }): PropertyDecorator => {

  const toPlain = Transform(({ value }) => {

    if(!options.each){
      return value.toString();
    }else{

      return value.map((item:any) => item.toString());
    }

  }, { toPlainOnly: true });

  const toClass = Transform(({ value }) => {
    if(!options.each){
      return new URL(value);
    }else{
      return value.map((item:any) => new URL(item));
    }
  }, { toClassOnly: true });

  return (target: Object, propertyKey: string | symbol) => {
    toPlain(target, propertyKey);
    toClass(target, propertyKey);
  };



}

export const TransformDate: PropertyDecorator = (target: Object, propertyKey: string | symbol) => {
  const toPlain = Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  const toClass = Transform(({ value }) => new Date(value), { toClassOnly: true })

  toPlain(target, propertyKey)
  toClass(target, propertyKey)
}

/*
Some JSPF datas (metas, attribution, links...) are arrays of key-value pairs.
It's difficult to handle them since the name of the properties are unknown.
So convert them to an object with a 'name' and 'data' property.
*/

class SinglePair {
  @TransformUri()
  rel: string;
  content: any;

  constructor(data:any){
    console.log("SINGLEPAIR CONSTRUCTOR",data);
  }

}

export class Meta extends SinglePair{
}

export class Link extends SinglePair{
}

export class Attribution extends SinglePair{
}

export class Extension extends SinglePair{
}



//convert key-value pairs to an object extending SinglePair
function pairToSingle(pair: { [key: string]: any }): any {
  const name: string = Object.keys(pair)[0];
  const data: any = pair[name];
  return {rel:name,content:data};
}

//converts an array of SinglePair objects to build an object of key-value pairs from
function SingleToPair(instance: any): { [key: string]: any } {
  const hash: { [key: string]: string } = {};
  hash[instance.rel] = instance.content;
  return hash;
}

export const TransformPair = (options: TransformPairsOptions = { each: false }): PropertyDecorator => {

  const toPlain = Transform(({ value }) => {

    if(!options.each){
      return SingleToPair(value);
    }else{

      return value.map((item:any) => SingleToPair(item));
    }

  }, { toPlainOnly: true });

  const toClass = Transform(({ value }) => {
    if(!options.each){
    }else{
      return value.map((item:any) => pairToSingle(item));
    }
  }, { toClassOnly: true });

  return (target: Object, propertyKey: string | symbol) => {
    toPlain(target, propertyKey);
    toClass(target, propertyKey);
  };
}


export class Track {

/*
@IsOptional()
@IsArray()
@TransformUri({each:true})
@IsUri(,{})
location?: URL[];
*/


  @IsOptional()
  @IsArray()
  @TransformUri({each:true})
  @IsUri({},{each:true})
  location?: URL[];


  @IsOptional()
  @IsArray()
  @TransformUri({each:true})
  @IsUri({},{each:true})
  identifier?: URL[];

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
  @IsUri()
  @TransformUri()
  info?: URL;

  @IsOptional()
  @IsUri()
  @TransformUri()
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
  @TransformPair({each:true})
  @Type(() => Link)
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true})
  @Type(() => Meta)
  meta?: Meta[];

  @IsOptional()
  @TransformPair()
  @ValidateNested()
  extension?: Extension;

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
  @IsUri()
  @TransformUri()
  info?: URL;

  @IsOptional()
  @IsUri()
  @TransformUri()
  location?: URL;

  @IsOptional()
  @IsUri()
  @TransformUri()
  identifier?: URL;

  @IsOptional()
  @IsUri()
  @TransformUri()
  image?: URL;

  @IsOptional()
  @IsDate()
  @TransformDate
  date?: Date;

  @IsOptional()
  @IsUri()
  @TransformUri()
  license?: URL;

  @IsOptional()
  @IsArray()
  @TransformPair({each:true})
  @ValidateNested()
  @Type(() => Attribution)
  attribution?: Attribution[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true})
  @Type(() => Link)
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true})
  @Type(() => Meta)
  meta?: Meta[];

  @IsOptional()
  @TransformPair()
  @ValidateNested()
  extension?: Extension;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Track)
  track?: Track[];
}
