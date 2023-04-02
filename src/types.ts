import { IsDefined, IsUrl, IsNotEmptyObject, IsArray, IsOptional, IsString, IsDate, IsNotEmpty, ValidateNested, IsObject, IsDateString, IsInt, Min } from 'class-validator';
import { Type,Transform, TransformFnParams, plainToClass } from 'class-transformer';
import { validate,validateSync } from 'class-validator';

interface RawPlaylist {
  title: string;
  creator: string;
  date: string;
  tracks: RawTrack[];
  attribution?: { [key: string]: string };
}

interface RawTrack {
  title: string;
  creator?: string;
  info?: string;
  location?: string | string[];
  identifier?: string;
  image?: string;
  album?: string;
  duration?: number;
  attribution?: { [key: string]: string };
  license?: string;
}

class Attribution {
  [key: string]: any;

  @IsUrl()
  value: string;
}

function TransformDate() {
  const toPlain = Transform(({ value }) => value.toISOString(), { toPlainOnly: true });
  const toClass = Transform(({ value }) => new Date(value), { toClassOnly: true });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}

/*
function TransformDate(): PropertyDecorator {
  const toPlain = Transform(({ value }) => value.toISOString(), { toPlainOnly: true });
  const toClass = Transform(({ value }) => new Date(value), { toClassOnly: true });
  const isUrl = IsUrl();

  return (target: Record<string, any>, propertyKey: string | symbol) => {
    isUrl(target, propertyKey);
    toClass(target, propertyKey);
    toPlain(target, propertyKey);
  };
}
*/
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

function TransformURI(): PropertyDecorator {
  const toClass = Transform(({ value }) => new URL(value), { toClassOnly: true });
  const toPlain = Transform(({ value }) => value.toString(), { toPlainOnly: true });
  const isUrl = IsUrl();

  return (target: Record<string, any>, propertyKey: string | symbol) => {
    isUrl(target, propertyKey);
    toClass(target, propertyKey);
    toPlain(target, propertyKey);
  };
}

/*
class TrackLink {
  @IsString()
  key: string;

  @IsUrl()
  @TransformURI()
  value: URL;
}
*/

class TrackLink {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class Track {
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  location?: string[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
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
  info?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsUrl()
  license?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribution)
  attribution?: Attribution[];

  @IsDefined({ message: 'links should not be null or undefined' })
  @IsArray({ message: 'links must be an array' })
  @ValidateNested({ each: true })
  @Type(() => TrackLink)
  links: TrackLink[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  meta?: Object[];

  @IsOptional()
  @IsInt()
  @Min(0)
  trackNum?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  extension?: Object;
}

export class Playlist {
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
  info?: string;

  @IsOptional()
  @IsUrl()
  location?: string;

  @IsOptional()
  @IsUrl()
  identifier?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsDate()
  @TransformDate()
  date?: Date;

  @IsOptional()
  @IsUrl()
  license?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribution)
  attribution?: Attribution[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  link?: Object[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  meta?: Object[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  extension?: Object;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Track)
  track?: Track[];
}
