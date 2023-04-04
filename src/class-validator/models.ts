import { validate,validateSync, IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type,Transform, TransformFnParams, plainToClass, plainToClassFromExist } from 'class-transformer';
import {IsSinglePropertyObject} from './validation-custom';
import {TransformDate,TransformPair} from './transform-custom';
import {XSPF_VERSION} from './../constants';


export class SinglePair {
  rel: string;
  content: any;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class Attribution extends SinglePair{
  @IsString()
  rel: string;
  @IsUrl()
  content:string;
}

export class Meta extends SinglePair{
  @IsUrl()
  rel: string;
  content:any;
}

export class Link extends SinglePair{
  @IsUrl()
  rel: string;
  @IsUrl()
  content:string;
}

export class Extension extends SinglePair{
  @IsUrl()
  rel: string;
  @IsArray()
  content:any[];
}

export class Track {

  @IsOptional()
  @IsArray()
  @IsUrl({},{each:true})
  location?: string[];


  @IsOptional()
  @IsArray()
  @IsUrl({},{each:true})
  identifier?: string[];

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
  @IsUrl()
  info?: URL;

  @IsOptional()
  @IsUrl()
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
  @TransformPair({each:true,type:Link})
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Meta})
  meta?: Meta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:Extension})
  extension?: Extension;

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

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
  @IsUrl()
  info?: URL;

  @IsOptional()
  @IsUrl()
  location?: URL;

  @IsOptional()
  @IsUrl()
  identifier?: URL;

  @IsOptional()
  @IsUrl()
  image?: URL;

  @IsOptional()
  @IsDate()
  @TransformDate
  date?: Date;

  @IsOptional()
  @IsUrl()
  license?: URL;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @TransformPair({each:true,type:Attribution})
  attribution?: Attribution[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Link})
  link?: Link[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:Meta})
  meta?: Meta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:Extension})
  extension?: Extension;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Track)
  track?: Track[];

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

}