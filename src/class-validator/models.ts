import { validate, validateSync, IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type, Transform, TransformFnParams, plainToClass, plainToClassFromExist, classToPlain, instanceToInstance } from 'class-transformer';

import { IsSinglePropertyObject } from './validation-custom';
import { TransformDate, TransformPair } from './transform-custom';



export class SinglePair {
  rel: string;
  content: any;
  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }
}

export class JspfAttribution extends SinglePair{
  @IsString()
  rel: string;
  @IsUrl()
  content:string;
}

export class JspfMeta extends SinglePair{
  @IsUrl()
  rel: string;
  content:any;
}

export class JspfLink extends SinglePair{
  @IsUrl()
  rel: string;
  @IsUrl()
  content:string;
}

export class JspfExtension extends SinglePair{
  @IsUrl()
  rel: string;
  @IsArray()
  content:any[];
}

export class JspfTrack {

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
  @TransformPair({each:true,type:JspfLink})
  link?: JspfLink[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:JspfMeta})
  meta?: JspfMeta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:JspfExtension})
  extension?: JspfExtension;

  constructor(data?: any) {
    plainToClassFromExist(this, data);
  }

}

type PlaylistOptions = {
  strip: boolean
}


export class JspfPlaylist {
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
  @TransformPair({each:true,type:JspfAttribution})
  attribution?: JspfAttribution[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:JspfLink})
  link?: JspfLink[];

  @IsOptional()
  @IsArray()
  @ValidateNested({each:true})
  @TransformPair({each:true,type:JspfMeta})
  meta?: JspfMeta[];

  @IsOptional()
  @ValidateNested()
  @TransformPair({type:JspfExtension})
  extension?: JspfExtension;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => JspfTrack)
  track?: JspfTrack[];

  constructor(data?: any,options: PlaylistOptions = { strip: false }) {
    plainToClassFromExist(this, data);
  }

}
