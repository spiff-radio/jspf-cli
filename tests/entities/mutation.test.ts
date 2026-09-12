import { describe, it, expect } from 'vitest';
import { JspfPlaylist, JspfTrack } from '../../src/entities/models';

/**
 * A field set after construction has to survive every way the object is read.
 *
 * `JspfPlaylist` used to serialize its plain fields from `_data` - the constructor's input - so
 * assigning to one changed what the object read back as and nothing about what it exported. The
 * value was dropped by toJSON, toDTO, toString and every conversion built on them, silently.
 * Tracks read their own properties and never had the bug, which is what these tests pin down:
 * the two classes behave the same way, whichever field is set and whenever it is set.
 */
describe('entities/models - mutation after construction', () => {
  describe('JspfPlaylist', () => {
    it('exports a title assigned after construction', () => {
      const playlist = new JspfPlaylist({ title: 'Before', track: [] });
      playlist.title = 'After';

      expect(playlist.title).toBe('After');
      expect(playlist.toJSON().title).toBe('After');
      expect(playlist.toDTO().title).toBe('After');
      expect(JSON.parse(playlist.toString()).title).toBe('After');
    });

    it('exports every plain field assigned after construction', () => {
      const playlist = new JspfPlaylist({ title: 'Test' });
      playlist.creator = 'Someone';
      playlist.annotation = 'A description';
      playlist.info = 'https://example.com/info';
      playlist.image = 'https://example.com/cover.jpg';
      playlist.date = '2026-01-01T00:00:00.000Z';
      playlist.license = 'https://example.com/license';
      playlist.location = 'https://example.com/playlist.jspf';
      playlist.identifier = 'https://example.com/id';

      expect(playlist.toDTO()).toMatchObject({
        creator: 'Someone',
        annotation: 'A description',
        info: 'https://example.com/info',
        image: 'https://example.com/cover.jpg',
        date: '2026-01-01T00:00:00.000Z',
        license: 'https://example.com/license',
        location: 'https://example.com/playlist.jspf',
        identifier: 'https://example.com/id'
      });
    });

    it('clears a field assigned undefined after construction', () => {
      const playlist = new JspfPlaylist({ title: 'Test', annotation: 'Gone soon' });
      playlist.annotation = undefined;

      expect(playlist.toDTO()).not.toHaveProperty('annotation');
    });

    it('validates what it would export, not what it was built from', () => {
      // `info` must be a URI: built valid, then broken
      const playlist = new JspfPlaylist({ title: 'Test', info: 'https://example.com' });
      playlist.info = 'not a uri';
      expect(playlist.getValidationErrors()).not.toBeNull();

      // ...and the other way round: built broken, then fixed
      const repaired = new JspfPlaylist({ title: 'Test', info: 'not a uri' });
      repaired.info = 'https://example.com';
      expect(repaired.getValidationErrors()).toBeNull();
    });
  });

  describe('JspfTrack', () => {
    it('exports a title assigned after construction', () => {
      const track = new JspfTrack({ title: 'Before' });
      track.title = 'After';

      expect(track.toJSON().title).toBe('After');
      expect(track.toDTO().title).toBe('After');
    });

    it('validates what it would export, not what it was built from', () => {
      const track = new JspfTrack({ title: 'Test', info: 'https://example.com' });
      track.info = 'not a uri';
      expect(track.getValidationErrors()).not.toBeNull();
    });
  });

  describe('a mutated playlist round-trips', () => {
    it('rebuilds from its own output', () => {
      const playlist = new JspfPlaylist({ title: 'Before', track: [{ title: 'A track' }] });
      playlist.title = 'After';
      playlist.annotation = 'Added later';

      const rebuilt = new JspfPlaylist(playlist.toDTO());
      expect(rebuilt.toDTO()).toEqual(playlist.toDTO());
      expect(rebuilt.title).toBe('After');
      expect(rebuilt.track?.[0].title).toBe('A track');
    });
  });
});
