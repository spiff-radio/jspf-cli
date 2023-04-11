import { xml2json,ElementCompact, xml2js } from 'xml-js';
import { BaseDataI, PlaylistDataI, TrackDataI, AttributionDataI, LinkDataI, MetaDataI,ExtensionDataI }  from '../../entities/jspf/interfaces';
import { Playlist } from '../../entities/models';

export default function parseXSPF(input: string): PlaylistDataI {
  const data = xml2js(input, { compact: true }) as ElementCompact;

  const dto: PlaylistDataI = {};
  dto.title = data.playlist?.title?._text;
  dto.creator = data.playlist?.creator?._text;
  dto.annotation = data.playlist?.annotation?._text;
  dto.info = data.playlist?.info?._text;
  dto.location = data.playlist?.location?._text;
  dto.identifier = data.playlist?.identifier?._text;
  dto.image = data.playlist?.image?._text;
  dto.date = data.playlist?.date?._text;
  dto.license = data.playlist?.license?._text;

  if (data.playlist?.attribution) {
    dto.attribution = parseAttribution(data.playlist.attribution);
  }

  if (data.playlist?.link) {
    dto.link = parseLinks(data.playlist.link);
  }

  if (data.playlist?.meta) {
    dto.meta = parseMetaDatas(data.playlist.meta);
  }

  if (data.playlist?.extension) {
    dto.extension = parseExtension(data.playlist.extension);
  }

  if (data.playlist?.trackList?.track) {
    dto.track = parseTrackList(data.playlist.trackList.track);
  }


  return new Playlist(dto);
}

function parseAttribution(input: ElementCompact): AttributionDataI[] {

  const output: AttributionDataI[] = [];

  //ignore '_attributes'
  delete input._attributes;

  for (let [key, value] of Object.entries(input)) {
    value = String(value?._text);
    if (!key || !value) continue;
    const item: AttributionDataI = {
      [key] : value
    };
    output.push(item);
  }

  return output;

}

function parseLinks(input: ElementCompact | ElementCompact[]): LinkDataI[] {

  //force array
  if (!Array.isArray(input)){
    input = [input];
  }

  const output: LinkDataI[] = [];

  input.forEach((el:ElementCompact) => {
    const key = String(el._attributes?.rel);
    const value = String(el._text);
    if (!key || !value) return;
    const item: LinkDataI = {
      [key] : value
    };
    output.push(item);
  })

  return output;

}

function parseMetaDatas(input: ElementCompact | ElementCompact[]): MetaDataI[] {

  //force array
  if (!Array.isArray(input)){
    input = [input];
  }

  const output: MetaDataI[] = [];

  input.forEach((el:ElementCompact) => {
    const key = String(el._attributes?.rel);
    const value = String(el._text);
    if (!key || !value) return;
    const item: MetaDataI = {
      [key] : value
    };
    output.push(item);
  })

  return output;

}

function parseExtension(input:ElementCompact): ExtensionDataI {

  //force array
  if (!Array.isArray(input)){
    input = [input];
  }

  const output: ExtensionDataI = {};

  input.forEach((el:ElementCompact) => {
    const key = String(el._attributes?.application);
    delete el._attributes;//ignore '_attributes'
    const value:any[] = [el];
    output[key] = value;
  })

  return output;
}

function parseTrackLocationsOrIdentifiers(input:ElementCompact[] | ElementCompact[]): string[] {
  //force array
  if (!Array.isArray(input)){
    input = [input];
  }
  return input.map(el=>String(el._text))
}

function parseTrackList(tracks:ElementCompact[]): TrackDataI[] {

  return tracks.map((track:ElementCompact) => {
    const t: TrackDataI = {};

    if (track?.location){
      t.location = parseTrackLocationsOrIdentifiers(track.location);
    }

    if (track?.identifier){
      t.identifier = parseTrackLocationsOrIdentifiers(track.identifier);
    }

    if (track?.title?._text){
      t.title = String(track.title._text);
    }

    if (track?.creator?._text){
      t.creator = String(track.creator._text);
    }

    if (track?.annotation?._text){
      t.annotation = String(track.annotation._text);
    }

    if (track?.info?._text){
      t.info = String(track.info._text);
    }

    if (track?.image?._text){
      t.image = String(track.image._text);
    }

    if (track?.album?._text){
      t.album = String(track.album._text);
    }

    if (track?.trackNum?._text){
      t.trackNum = Number(track.trackNum._text);
    }

    if (track?.duration?._text){
      t.duration = Number(track.duration._text);
    }

    if (track?.link) {
      t.link = parseLinks(track.link);
    }

    if (track?.meta) {
      t.meta = parseMetaDatas(track.meta);
    }

    if (track?.extension) {
      t.extension = parseExtension(track.extension);
    }

    return t;
  }).filter(Boolean); // filter out any undefined values
}
