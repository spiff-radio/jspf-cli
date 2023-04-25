//TOUFIX official types not existing yet.
//TOUFIX title is not extracted : https://github.com/videojs/m3u8-parser/issues/created_by/spiff-radio
// @ts-ignore
import { Parser } from 'm3u8-parser';
import {
  JspfTrackI,
  JspfPlaylistI,
} from '../../entities/interfaces';

//TOUFIX handle both basic and extended format ?
function parseTrackTitle(segmentTitle: string): string | undefined {
  const regex = /^a=(.*),t=(.*)$/;
  const match = regex.exec(segmentTitle);
  return match?.[2];
}

//TOUFIX handle both basic and extended format ?
function parseTrackArtist(segmentTitle: string): string | undefined {
  const regex = /^a=(.*),t=(.*)$/;
  const match = regex.exec(segmentTitle);
  return match?.[1];
}

function parseTrack(segment:any):JspfTrackI{

  const trackData: JspfTrackI = {
    location: [segment.uri],
    duration: segment.duration,
    extension: {},
  };

  if (segment.title) {
    trackData.title = parseTrackTitle(segment.title);
    trackData.creator = parseTrackArtist(segment.title);
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

export default function parseM3U8(input: string): JspfPlaylistI {
  const parser = new Parser();
  parser.push(input);
  parser.end();

  let output: JspfPlaylistI = {};

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
