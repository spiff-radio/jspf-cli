import { JspfPlaylistI,JspfTrackI } from '../../entities/jspf/interfaces';


export default function serializePLS(input: JspfPlaylistI): string {

  let output:string = '';
  let lines:string[] = [];

  const tracks = input.track ?? [];
  const trackCount = tracks.length;

  lines.push("[playlist]");
  lines.push(`NumberOfEntries=${trackCount}`);

  output = lines.join("\n") + "\n";

  let i = 1;
  for (const track of tracks) {
    output+=serializeTrack(track,i) + "\n";
    i++;
  }

  return output;
}

function serializeTrack(input: JspfTrackI,index:number): string {
  let output:string = '';
  let lines:string[] = [];

  if (input?.location?.[0]){
    lines.push(`File${index}=${input.location[0]}`);
  }

  if (input?.title){
    lines.push(`Title${index}=${input.title}`);
  }

  if (input?.duration){
    lines.push(`Length${index}=${input.duration}`);
  }

  if (input?.creator){
    lines.push(`Artist${index}=${input.creator}`);
  }

  if (input?.album){
    lines.push(`Album${index}=${input.album}`);
  }

  output = lines.join("\n");

  return output;

}
