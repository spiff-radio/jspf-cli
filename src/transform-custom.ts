import { validate,validateSync, IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type,Transform, TransformFnParams, plainToClass, plainToClassFromExist } from 'class-transformer';
import {SinglePair} from './models';

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
  each?: boolean,
  type:any
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

//convert key-value pairs to an object extending SinglePair
function pairToSingle(pair: { [key: string]: any },options: TransformPairsOptions = { each: false, type:SinglePair }): any {
  const name: string = Object.keys(pair)[0];
  const data: any = pair[name];
  const hash = {rel:name,content:data};
  return plainToClass(options.type,hash);
}

//converts an array of SinglePair objects to build an object of key-value pairs from
function SingleToPair(instance: any): { [key: string]: any } {
  const hash: { [key: string]: string } = {};
  hash[instance.rel] = instance.content;
  return hash;
}

export const TransformPair = (options: TransformPairsOptions = { each: false, type:SinglePair }): PropertyDecorator => {

  const toPlain = Transform(({ value }) => {

    if(!options.each){
      return SingleToPair(value);
    }else{

      return value.map((item:any) => SingleToPair(item));
    }

  }, { toPlainOnly: true });

  const toClass = Transform(({ value }) => {
    if(!options.each){
      return pairToSingle(value,options);
    }else{
      return value.map((item:any) => pairToSingle(item,options));
    }
  }, { toClassOnly: true });

  return (target: Object, propertyKey: string | symbol) => {
    toPlain(target, propertyKey);
    toClass(target, propertyKey);
  };
}
