const m3u8Parser = require('m3u8-parser');
import { DTOPlaylistI, DTOConverterI } from '../interfaces';
import { DTOConverter } from '../models';

export default class M3u8Converter extends DTOConverter {
  public static readonly types = ['m3u8'];

  public get(data: DTOPlaylistI):DTOPlaylistI{
    const parser = new m3u8Parser.Parser();
    let dto:DTOPlaylistI = {};
    parser.push(data);
    parser.end();

    const parsedManifest = parser.manifest;
    const playlistTitle = parsedManifest?.playlists?.[0]?.attributes?.['NAME'] || '';
    const playlistAuthor = parsedManifest?.playlists?.[0]?.attributes?.['CREATOR'] || '';
    const tracks: any[] = [];

    parsedManifest.segments.forEach((segment: any, index: number) => {
      const artistTitle = segment.uri.split(' - ');
      const artist = artistTitle[0];
      const titleWithExtension = artistTitle[1];
      const title = titleWithExtension.slice(0, titleWithExtension.lastIndexOf('.'));
      tracks.push({
        trackNum: index + 1,
        creator: artist,
        title: title,
        location: [segment.uri],
        duration: segment.duration,
      });
    });

    dto = {
      ...dto,
      title: playlistTitle,
      creator: playlistAuthor,
      track: tracks
    }

    return dto;

  }

  public set(dto: DTOPlaylistI):string{
    throw new Error('Export to M3U8 not yet implemented.');
  }

}
