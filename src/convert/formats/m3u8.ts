const m3u8Parser = require('m3u8-parser');
import { DataConverterI } from '../interfaces';
import { DataConverter } from '../models';
import { PlaylistDataI } from '../../entities/jspf/interfaces';
import { Playlist } from '../../entities/models';

export default class M3u8Converter extends DataConverter {
  public static readonly types = ['m3u8'];

  public get(filedata:string):PlaylistDataI{

    let rawData:object = {};

    const parser = new m3u8Parser.Parser();
    parser.push(filedata);
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

    rawData = {
      ...rawData,
      title: playlistTitle,
      creator: playlistAuthor,
      track: tracks
    }

    return new Playlist(rawData);

  }

  public set(dto: PlaylistDataI):string{
    let output = "#EXTM3U\n";

    // Add playlist information
    output += `#EXTINF:-1,t=${dto.title} a=${dto.creator}\n`;

    // Add tracks to the playlist
    const tracks = dto.track ?? [];
    tracks.forEach((track) => {

      output += `#EXTINF:-1,t=${track.title} a=${track.creator}\n`;

      // We can only keep the first link. //TOUFIX this should be done within a Model
      const track_location = track.location && track.location[0] ? track.location[0] : undefined;

      if (track.location && track.location.length > 0) {
        output += `${track.location[0]}\n`;
      }

    });

    return output;
  }

}
