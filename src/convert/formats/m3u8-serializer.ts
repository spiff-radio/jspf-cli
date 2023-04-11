import { PlaylistDataI,TrackDataI } from '../../entities/jspf/interfaces';
import { Playlist } from '../../entities/models';


export default function serializeM3U8(input: PlaylistDataI): string {
  let output:string = '';

  let lines:string[] = [];
  lines.push("#EXTM3U");

  // Add playlist information
  if (input.title){
    lines.push(`#EXTINF:-1,t=${input.title}`);
  }

  if (input.image){
    lines.push(`#EXTVLCOPT:artworkURL=${input.image}`);
  }

  if (input.date){
    lines.push(`#EXTVLCOPT:meta-date=${input.date}`);
  }

  output = lines.join("\n");

  // Add tracks
  if (input.track) {
    for (const trackInput of input.track) {
      const track:string = serializeTrack(trackInput);
      output+= track;
    }
  }

  return output;
}

function serializeTrack(input: TrackDataI): string {
  let lines:string[] = [];

  if (input.title){
    lines.push(`#EXTINF:${input.duration || '-1'},t=${input.title}`);
  }

  //location (only the first one)
  if (input.location?.[0]){
    lines.push(`${input.location[0]}`);
  }

  // Add track metadata
  if (input.meta) {
    for (const meta of input.meta) {
      for (const key in meta) {
        lines.push(`#EXTVLCOPT:meta-${key}=${meta[key]}`);
      }
    }
  }
  return lines.join("\n");
}
