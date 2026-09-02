import { describe, it, expect } from 'vitest';
import parseM3U8 from '../../../src/convert/formats/m3u8-parser';
import serializeM3U8 from '../../../src/convert/formats/m3u8-serializer';

describe('convert/formats/m3u8', () => {
  describe('parseM3U8', () => {
    it('converts EXTINF duration (seconds) to JSPF duration (milliseconds)', () => {
      const input = [
        '#EXTM3U',
        '#EXTINF:240,Song',
        'http://example.com/song.mp3'
      ].join('\n');

      const playlist = parseM3U8(input);
      expect(playlist.track?.[0].duration).toBe(240000);
    });

    it('treats EXTINF:-1 (unknown duration) as undefined, not -1000', () => {
      const input = [
        '#EXTM3U',
        '#EXTINF:-1,Song',
        'http://example.com/song.mp3'
      ].join('\n');

      const playlist = parseM3U8(input);
      expect(playlist.track?.[0].duration).toBeUndefined();
    });
  });

  describe('serializeM3U8', () => {
    it('converts JSPF duration (milliseconds) to EXTINF duration (seconds)', () => {
      const output = serializeM3U8({
        track: [{ title: 'Song', duration: 240000, location: ['http://example.com/song.mp3'] }]
      });
      expect(output).toContain('#EXTINF:240,Song');
    });
  });
});
