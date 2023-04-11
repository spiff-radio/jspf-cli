//TOUFIX official types not existing yet.
//https://github.com/videojs/m3u8-parser/pull/111
//https://github.com/henninghall/m3u8-parser/blob/a021326a42fbdd7cc1d48c94baca086730333ac0/index.d.ts
// @ts-ignore
import { Parser } from 'm3u8-parser';
import {
  BaseDataI,
  AttributionDataI,
  LinkDataI,
  MetaDataI,
  ExtensionDataI,
  TrackDataI,
  PlaylistDataI,
} from '../../entities/jspf/interfaces'; // replace with your actual file name

function parseTrack(segment:any):TrackDataI{
  const trackData: TrackDataI = {
    location: [segment.uri],
    duration: segment.duration,
    extension: {},
  };

  if (segment.title) {
    trackData.title = segment.title;
  }

  if (segment.byterange && trackData.extension) {
    trackData.extension['BYTERANGE'] = [`${segment.byterange.length}@${segment.byterange.offset}`];
  }

  if (segment.key && trackData.extension) {
    trackData.extension['KEY'] = [`${segment.key.method}:${segment.key.uri}`];
    if (segment.key.iv) {
      trackData.extension['KEY'].push(`IV:${segment.key.iv}`);
    }
  }

  if (segment.map && trackData.extension) {
    trackData.extension['MAP'] = [segment.map.uri];
  }
  return trackData;
}

export default function parseM3U8(input: string): PlaylistDataI {
  const parser = new Parser();
  parser.push(input);
  parser.end();

  let output: PlaylistDataI = {};

  if (parser.manifest.playlists) {

    //get the first playlist
    const playlist = parser.manifest.playlists?.[0];

    if (playlist.attributes?.['NAME']){
      output.title = playlist.attributes['NAME'];
    }

    if (playlist.attributes?.['CREATOR']){
      output.creator = playlist.attributes['CREATOR'];
    }

    if (playlist.attributes?.['URI']){
      output.location = playlist.attributes['URI'];
    }

    if (playlist.uri) {
      output = {
        ...output,
        extension:{
          ...output.extension,
          'X-STREAM-INF':[playlist.uri]
        }
      }
    }

  }

  if (parser.manifest.segments) {
    output.track = [];
    for (const segment of parser.manifest.segments) {
      const trackData = parseTrack(segment);
      output.track.push(trackData);
    }
  }

  return output;
}
