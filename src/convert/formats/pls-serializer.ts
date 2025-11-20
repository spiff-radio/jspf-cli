import { JspfPlaylistI, JspfTrackI } from '../../entities/interfaces';

/**
 * Escape a value for PLS format.
 * PLS uses key=value format, so values containing '=' or newlines need special handling.
 * For PLS, we escape backslashes and newlines, but preserve '=' as it's part of the format.
 * If a value contains newlines, we replace them with spaces.
 */
function escapePLSValue(value: string): string {
  // Replace newlines with spaces (PLS doesn't support multi-line values)
  const normalized = value.replace(/\n/g, ' ').replace(/\r/g, '');
  // Escape backslashes
  return normalized.replace(/\\/g, '\\\\');
}

export default function serializePLS(input: JspfPlaylistI): string {
  const lines: string[] = [];

  const tracks = input.track ?? [];
  const trackCount = tracks.length;

  lines.push('[playlist]');
  lines.push(`NumberOfEntries=${trackCount}`);

  let i = 1;
  for (const track of tracks) {
    const trackLines = serializeTrack(track, i);
    lines.push(...trackLines);
    i++;
  }

  return lines.join('\n') + '\n';
}

function serializeTrack(input: JspfTrackI, index: number): string[] {
  const lines: string[] = [];

  if (input?.location?.[0]) {
    lines.push(`File${index}=${escapePLSValue(input.location[0])}`);
  }

  if (input?.title) {
    lines.push(`Title${index}=${escapePLSValue(input.title)}`);
  }

  if (input?.duration !== undefined) {
    lines.push(`Length${index}=${input.duration}`);
  }

  if (input?.creator) {
    lines.push(`Artist${index}=${escapePLSValue(input.creator)}`);
  }

  if (input?.album) {
    lines.push(`Album${index}=${escapePLSValue(input.album)}`);
  }

  return lines;
}
