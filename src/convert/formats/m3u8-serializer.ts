import { PlaylistI,TrackI } from '../../entities/interfaces';


export default function serializeM3U8(input: PlaylistI): string {
  let output:string = '';

  let lines:string[] = [];
  lines.push("#EXTM3U");

  // Add playlist information
  if (input.title){
    lines.push(`#EXTINF:-1,t=${input.title}`);
  }
  if (input.creator){
    lines.push(`#EXTINF:-1,a=${input.creator}`);
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
    output += "\n";
    for (const trackInput of input.track) {
      const track:string = serializeTrack(trackInput);
      output+= "\n" + track + "\n";
    }
  }

  return output;
}

function serializeTrack(input: TrackI): string {
  let lines:string[] = [];

  const duration = input.duration ?? -1;

  let firstLine:string[] = [`#EXTINF:${duration}`];

  if (input.creator){
    firstLine.push(`a=${input.creator}`);
  }
  if (input.title){
    firstLine.push(`t=${input.title}`);
  }
  lines.push(firstLine.join(','));

  if (input.location){
    for (const location of input.location){
      lines.push(location);
    }
  }


  // Add metadatas
  if (input.meta) {
    for (const meta of input.meta) {
      for (const key in meta) {
        lines.push(`#EXTVLCOPT:meta-${key}=${meta[key]}`);
      }
    }
  }
  return lines.join("\n");
}
