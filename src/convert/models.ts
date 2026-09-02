import { JspfPlaylistI } from '../entities/interfaces';
import { DataConverterI } from './interfaces';

export abstract class DataConverter implements DataConverterI {
  // `format`/`contentType` are required statics, but TypeScript doesn't support
  // `abstract static` class members: the contract is enforced instead where each
  // converter is registered, by typing that list against DataConverterStaticI.

  //get DTO playlist from data
  public abstract get(data: any): JspfPlaylistI;

  //converts DTO playlist to data
  public abstract set(dto: JspfPlaylistI): string;
}
