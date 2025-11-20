import { JspfPlaylistI } from '../entities/interfaces';
import { DataConverterI } from './interfaces';

export abstract class DataConverter implements DataConverterI {
  public static readonly types: string[] = [];
  public static readonly contentType: string = '';

  //get DTO playlist from data
  public abstract get(data: any): JspfPlaylistI;

  //converts DTO playlist to data
  public abstract set(dto: JspfPlaylistI): string;
}
