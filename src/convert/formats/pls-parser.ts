
import {
  JspfTrackI,
  JspfPlaylistI,
} from '../../entities/interfaces';

function stripPLSHeader(input: string): string {
  const lines = input.split('\n');
  if (lines[0].toLowerCase() === '[playlist]') {
    lines.splice(0, 1);
  }
  return lines.join('\n');
}

function getTrackIndexFromPropName(str:string):number|undefined{
  const matches = str.match(/\d+$/);
  if (!matches) return undefined;
  return parseInt(matches[0]);
}

function parseTrack(input:Record<string, any>):JspfTrackI{
  let output: JspfTrackI = {};

  if (input.title){
    output.title = input.title;
  }

  if (input.artist){
    output.creator = input.artist;
  }

  if (input.album){
    output.album = input.album;
  }

  if (input.file){
    output.location = [input.file];
  }

  if (input.length){
    output.duration = Number(input.length);
  }

  return output;
}

export default function parsePLS(input: string): Record<string, any> {

  let output: JspfPlaylistI = {};

  // Remove header
  const entries = input = stripPLSHeader(input);

  // Split entries into an array
  const lines = entries.split('\n');

  // Remove any empty lines and trim whitespace
  const cleanedLines = lines.filter(line => line.trim() !== '').map(line => line.trim());

  // Create a new object for storing the key-value pairs
  const propsList: Record<string, any> = {};

  // Loop through each line and extract the key-value pair
  cleanedLines.forEach(line => {
    const [key, value] = line.split('=');
    propsList[key.trim()] = value.trim();
  });

  let tracksPropsObj:Record<string, any> = {}

  //fill an array of tracks where properties have their key stripped of their suffix
  for (let [key, value] of Object.entries(propsList)) {
    const trackIndex = getTrackIndexFromPropName(key);
    if (trackIndex){

      const itemProps: Record<string, any> = {};

      //strip number from key
      const newKey = key.slice(0, -trackIndex.toString().length).toLowerCase();
      //add to tracks props
      tracksPropsObj = {
        ...tracksPropsObj,
        [trackIndex]:{
          ...tracksPropsObj[trackIndex],
          [newKey]:value
        }
      }
      //remove from main props
      delete propsList[key];
    }
  }

  //fill tracks
  output.track = Object.values(tracksPropsObj).map(el => parseTrack(el));

  return output;
}
