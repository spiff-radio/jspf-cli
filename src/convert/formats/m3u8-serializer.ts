import jsesc from 'jsesc';

import { JspfPlaylistI, JspfTrackI } from '../../entities/interfaces';

/**
 * Escape a value for use in M3U8 format.
 * Uses jsesc for proper JavaScript string escaping (quotes, backslashes, etc.)
 * which is the standard for M3U8 format.
 */
function escapeM3U8Value(value: string): string {
  // If value contains commas, quotes, backslashes, or newlines, quote it
  if (value.includes(',') || value.includes('"') || value.includes('\\') || value.includes('\n')) {
    // Use jsesc for proper escaping, then wrap in quotes
    const escaped = jsesc(value, { quotes: 'double', wrap: false });
    return `"${escaped}"`;
  }
  return value;
}

/**
 * Build the title string for EXTINF tag.
 * Standard format: #EXTINF:duration,title
 * If both creator and title exist, format as: #EXTINF:duration,"Artist - Title"
 */
function buildExtinfTitle(creator?: string, title?: string): string {
  if (creator && title) {
    const combined = `${creator} - ${title}`;
    return escapeM3U8Value(combined);
  }
  if (title) {
    return escapeM3U8Value(title);
  }
  if (creator) {
    return escapeM3U8Value(creator);
  }
  return '';
}

export default function serializeM3U8(input: JspfPlaylistI): string {
  const lines: string[] = [];
  
  // M3U8 header
  lines.push('#EXTM3U');

  // Playlist-level metadata (using comments, not EXTINF which is track-specific)
  // Note: M3U8 doesn't have standard playlist-level metadata tags
  // VLC-specific tags are kept for compatibility but are non-standard
  if (input.image) {
    lines.push(`#EXTVLCOPT:artworkURL=${escapeM3U8Value(input.image)}`);
  }

  if (input.date) {
    lines.push(`#EXTVLCOPT:meta-date=${escapeM3U8Value(input.date)}`);
  }

  // Add tracks
  if (input.track && input.track.length > 0) {
    for (const trackInput of input.track) {
      const track = serializeTrack(trackInput);
      lines.push(track);
    }
  }

  return lines.join('\n');
}

function serializeTrack(input: JspfTrackI): string {
  const lines: string[] = [];

  const duration = input.duration ?? -1;
  
  // Build title for EXTINF tag (standard format: duration,title)
  const title = buildExtinfTitle(input.creator, input.title);
  
  // Standard EXTINF format: #EXTINF:duration,title
  lines.push(`#EXTINF:${duration},${title}`);

  // Add track locations (URIs)
  if (input.location && input.location.length > 0) {
    for (const location of input.location) {
      lines.push(location);
    }
  }

  // Add metadata (VLC-specific, non-standard but commonly used)
  if (input.meta) {
    for (const meta of input.meta) {
      for (const key in meta) {
        const value = String(meta[key]);
        lines.push(`#EXTVLCOPT:meta-${key}=${escapeM3U8Value(value)}`);
      }
    }
  }

  return lines.join('\n');
}
