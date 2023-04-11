import { BaseDataI, PlaylistDataI, TrackDataI, AttributionDataI, LinkDataI, MetaDataI,ExtensionDataI }  from '../../entities/jspf/interfaces';
import { XSPFDataI }  from './xspf';
import { Playlist } from '../../entities/models';

import { xml2json,ElementCompact, xml2js } from 'xml-js';

export function parseXSPF(xml: string): PlaylistDataI {
  const data = xml2js(xml, { compact: true }) as ElementCompact;

  const rawData: PlaylistDataI = {};
  rawData.title = data.playlist?.title?._text;
  rawData.creator = data.playlist?.creator?._text;
  rawData.annotation = data.playlist?.annotation?._text;
  rawData.info = data.playlist?.info?._text;
  rawData.location = data.playlist?.location?._text;
  rawData.identifier = data.playlist?.identifier?._text;
  rawData.image = data.playlist?.image?._text;
  rawData.date = data.playlist?.date?._text;
  rawData.license = data.playlist?.license?._text;

  if (data.playlist?.attribution) {
    rawData.attribution = parseAttribution(data.playlist.attribution);
  }

  if (data.playlist?.link) {
    rawData.link = parseLinks(data.playlist.link);
  }

  if (data.playlist?.meta) {
    rawData.meta = parseMetaDatas(data.playlist.meta);
  }

  if (data.playlist?.extension) {
    rawData.extension = parseExtensionCollection(data.playlist.extension);
  }

  if (data.playlist?.trackList?.track) {
    rawData.track = parseTrackList(data.playlist.trackList.track);
  }


  return new Playlist(rawData);
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

function parseExtension(input:ElementCompact): any[] {

  //ignore '_attributes'
  delete input._attributes;

  //force array
  const output:any[] = [input];

  return output;

}

function parseExtensionCollection(input:ElementCompact[] | ElementCompact[]): ExtensionDataI {

  //force array
  if (!Array.isArray(input)){
    input = [input];
  }

  const output: ExtensionDataI = {};

  console.log("EXT",input);

  input.forEach((el:ElementCompact) => {
    const key = String(el._attributes?.application);
    const value = parseExtension(el);
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


      console.log("TRACK");
      console.log(track);
      console.log();


    if (track?.link) {
      t.link = parseLinks(track.link);
    }

    if (track?.meta) {
      t.meta = parseMetaDatas(track.meta);
    }

    if (track?.extension) {
      t.extension = parseExtensionCollection(track.extension);
    }

    return t;
  }).filter(Boolean); // filter out any undefined values
}
