import { describe, it, expect } from 'vitest';
import { JspfTrack, JspfPlaylist } from '../../src/entities/models';
import { exportPlaylist } from '../../src/convert/index';

// A track's location/identifier are arrays of URIs per the spec, and JspfTrackSchema types
// them as such. Before these accessors existed, a bare string assigned to either survived into
// toJSON() and was then silently dropped by `stripInvalid` at export - so a track with exactly
// one location exported with no location at all, while a track with two exported fine.

describe('JspfTrack location/identifier normalization', () => {
  it('promotes a bare string location to the array form', () => {
    const track = new JspfTrack({ title: 'A', location: 'https://example.com/a.mp3' });
    expect(track.location).toEqual(['https://example.com/a.mp3']);
  });

  it('promotes a bare string identifier to the array form', () => {
    const track = new JspfTrack({ title: 'A', identifier: 'urn:isrc:USRC17607839' });
    expect(track.identifier).toEqual(['urn:isrc:USRC17607839']);
  });

  it('leaves an array of one alone', () => {
    const track = new JspfTrack({ title: 'A', location: ['https://example.com/a.mp3'] });
    expect(track.location).toEqual(['https://example.com/a.mp3']);
  });

  it('preserves multiple locations and their order', () => {
    const track = new JspfTrack({
      title: 'A',
      location: ['https://example.com/a.mp3', 'https://example.com/b.mp3'],
    });
    expect(track.location).toEqual(['https://example.com/a.mp3', 'https://example.com/b.mp3']);
  });

  it('drops blank and non-string entries, and empties to undefined', () => {
    expect(new JspfTrack({ title: 'A', location: '   ' }).location).toBeUndefined();
    expect(new JspfTrack({ title: 'A', location: [] }).location).toBeUndefined();
    expect(new JspfTrack({ title: 'A', location: ['', '  '] }).location).toBeUndefined();
    expect(
      new JspfTrack({ title: 'A', location: ['https://example.com/a.mp3', '', null] }).location
    ).toEqual(['https://example.com/a.mp3']);
  });

  it('normalizes assignment made after construction, not just constructor data', () => {
    const track = new JspfTrack({ title: 'A' });
    track.location = 'https://example.com/late.mp3';
    expect(track.location).toEqual(['https://example.com/late.mp3']);
    expect(track.toDTO().location).toEqual(['https://example.com/late.mp3']);
  });

  it('keeps a single location through a stripInvalid export', () => {
    // The regression this normalization exists for.
    const dto = {
      version: '1',
      title: 'P',
      track: [{ title: 'A', location: 'https://example.com/a.mp3' }],
    };
    const out = exportPlaylist(new JspfPlaylist(dto).toDTO(), 'jspf', {
      ignoreValidationErrors: true,
      stripInvalid: true,
    });
    expect(JSON.parse(out).playlist.track[0].location).toEqual(['https://example.com/a.mp3']);
  });

  it('leaves a playlist-level location as a single URI', () => {
    // JspfPlaylistSchema types playlist location/identifier as a bare uri, not an array - the
    // asymmetry with tracks is why this normalization is scoped to JspfTrack.
    const playlist = new JspfPlaylist({ title: 'P', location: 'https://example.com/p.jspf' });
    expect(playlist.location).toBe('https://example.com/p.jspf');
  });
});

// `extension` is where callers legitimately stash app-specific data under a namespace key, so
// they write plain objects into it. Before the accessor, that replaced the JspfExtension
// instance and toJSON() then called .toJSON() on a plain object - the whole playlist failed to
// serialize. This is the same unguarded-field bug as location/identifier above.
describe('JspfTrack/JspfPlaylist extension normalization', () => {
  const NS = 'https://example.org/ns/app';

  it('wraps a plain object assigned after construction', () => {
    const track = new JspfTrack({ title: 'A' });
    track.extension = { [NS]: [{ note: 'hi' }] };
    expect(typeof (track.extension as any).toJSON).toBe('function');
    expect(track.toDTO().extension).toEqual({ [NS]: [{ note: 'hi' }] });
  });

  it('keeps a playlist serializable after a plain-object extension assignment', () => {
    const playlist = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }] });
    playlist.track![0].extension = { [NS]: [{ note: 'hi' }] };
    playlist.extension = { [NS]: [{ scope: 'playlist' }] };
    expect(() => playlist.toDTO()).not.toThrow();
    expect(playlist.toDTO().track[0].extension).toEqual({ [NS]: [{ note: 'hi' }] });
  });

  it('accepts an existing JspfExtension instance unchanged', () => {
    const first = new JspfTrack({ title: 'A', extension: { [NS]: [{ n: 1 }] } });
    const second = new JspfTrack({ title: 'B' });
    second.extension = first.extension;
    expect(second.extension).toBe(first.extension);
  });

  it('clears on undefined', () => {
    const track = new JspfTrack({ title: 'A', extension: { [NS]: [{ n: 1 }] } });
    track.extension = undefined;
    expect(track.extension).toBeUndefined();
    expect(track.toDTO().extension).toBeUndefined();
  });
});
