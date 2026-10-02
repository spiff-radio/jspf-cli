import { describe, it, expect } from 'vitest';
import { JspfPlaylist, JspfTrack, mergeMeta } from '../../src/entities/models';

const titles = (p: JspfPlaylist) => (p.track ?? []).map((t) => t.title).join(',');
const nums = (p: JspfPlaylist) => (p.track ?? []).map((t) => t.trackNum).join(',');

describe('JspfPlaylist track manipulation', () => {
  it('appends without renumbering existing tracks', () => {
    // An album playlist carries meaningful track numbers; appending must not clobber them.
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A', trackNum: 7 }] });
    p.appendTrack({ title: 'B' });
    expect(titles(p)).toBe('A,B');
    expect(p.track![0].trackNum).toBe(7);
  });

  it('appendTrack returns the created track and accepts an existing instance', () => {
    const p = new JspfPlaylist({ title: 'P' });
    const created = p.appendTrack({ title: 'A' });
    expect(created).toBeInstanceOf(JspfTrack);
    const existing = new JspfTrack({ title: 'B' });
    expect(p.appendTrack(existing)).toBe(existing);
    expect(titles(p)).toBe('A,B');
  });

  it('appendTrack creates the track list when there is none', () => {
    const p = new JspfPlaylist({ title: 'P' });
    p.appendTrack({ title: 'A' });
    expect(p.track).toHaveLength(1);
  });

  it('deletes and renumbers', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] });
    p.deleteTrack(0);
    expect(titles(p)).toBe('B,C');
    expect(nums(p)).toBe('1,2');
  });

  it('moves and renumbers, clamping an out-of-range target', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] });
    p.moveTrack(2, 0);
    expect(titles(p)).toBe('C,A,B');
    expect(nums(p)).toBe('1,2,3');
    p.moveTrack(0, 99);
    expect(titles(p)).toBe('A,B,C');
  });

  it('moveTrack to the same index is a no-op', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }] });
    p.moveTrack(1, 1);
    expect(titles(p)).toBe('A,B');
  });

  it('merges update data into the existing track', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A', creator: 'X', album: 'Alb' }] });
    p.updateTrack(0, { title: 'A2' });
    expect(p.track![0].title).toBe('A2');
    expect(p.track![0].creator).toBe('X');
    expect(p.track![0].album).toBe('Alb');
  });

  it('removes a field explicitly set to undefined', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A', creator: 'X' }] });
    p.updateTrack(0, { creator: undefined });
    expect(p.track![0].creator).toBeUndefined();
  });

  it('repositions the track when the update changes trackNum', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] });
    const newIndex = p.updateTrack(0, { trackNum: 3 });
    expect(titles(p)).toBe('B,C,A');
    expect(newIndex).toBe(2);
    expect(nums(p)).toBe('1,2,3');
  });

  it('returns the original index when nothing moved', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }] });
    expect(p.updateTrack(1, { title: 'B2' })).toBe(1);
  });

  it('replaceTrack drops what the new track does not carry', () => {
    // The reason this method exists: a merge cannot say "this field is now empty", because the DTO
    // a caller naturally builds has had its empty values stripped. Replacing says it by construction.
    const p = new JspfPlaylist({
      title: 'P',
      track: [{ title: 'A', creator: 'C', album: 'Al', location: ['a.mp3'], identifier: ['isrc:X'] }],
    });
    p.replaceTrack(0, { title: 'A' });
    const after = p.track![0].toDTO();
    expect(after.title).toBe('A');
    expect(after.creator).toBeUndefined();
    expect(after.album).toBeUndefined();
    expect(after.location).toBeUndefined();
    expect(after.identifier).toBeUndefined();
  });

  it('replaceTrack accepts an instance as well as a plain object', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }] });
    p.replaceTrack(1, new JspfTrack({ title: 'B2' }));
    expect(titles(p)).toBe('A,B2');
    // And numbering is left alone: a playlist that had none does not acquire it because somebody
    // edited a title. Renumbering follows a reorder, not any write - see `placeTrack`.
    expect(nums(p)).toBe(',');
  });

  it('leaves a track where it is when the write does not change its trackNum', () => {
    // The teleporting-track bug: a selection borrowed from a longer playlist keeps that playlist's
    // numbers, so every background write (which echoes the fields it was handed) used to be read as
    // "put me at 1590" and sent the track to the end.
    const p = new JspfPlaylist({
      title: 'Radio',
      track: [{ title: 'A', trackNum: 1590 }, { title: 'B', trackNum: 42 }, { title: 'C', trackNum: 7 }],
    });
    const newIndex = p.updateTrack(0, { location: ['a.mp3'] });
    expect(newIndex).toBe(0);
    expect(titles(p)).toBe('A,B,C');
    expect(nums(p)).toBe('1590,42,7');
    expect(p.track![0].location).toEqual(['a.mp3']);
  });

  it('replaceTrack leaves non-positional numbering alone too', () => {
    // Same rule through the other door: an album's numbering survives an edit to one of its tracks.
    const p = new JspfPlaylist({
      title: 'Album, side B',
      track: [{ title: 'A', trackNum: 7 }, { title: 'B', trackNum: 8 }],
    });
    p.replaceTrack(0, { title: 'A2', trackNum: 7 });
    expect(titles(p)).toBe('A2,B');
    expect(nums(p)).toBe('7,8');
  });

  it('a track with no number at all is not moved or renumbered by a write', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }] });
    expect(p.updateTrack(1, { creator: 'X' })).toBe(1);
    expect(titles(p)).toBe('A,B');
    expect(nums(p)).toBe(',');
  });

  it('replaceTrack repositions the track when the new one asks for another trackNum', () => {
    // Same rule as updateTrack's: editing the number is how a user reorders, whichever write it is.
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] });
    const newIndex = p.replaceTrack(2, { title: 'C', trackNum: 1 });
    expect(newIndex).toBe(0);
    expect(titles(p)).toBe('C,A,B');
    expect(nums(p)).toBe('1,2,3');
  });

  it('replaceTrack on a missing index is a no-op', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }] });
    expect(p.replaceTrack(5, { title: 'Z' })).toBe(5);
    expect(titles(p)).toBe('A');
  });

  it('updateTrack on a missing index is a no-op', () => {
    const p = new JspfPlaylist({ title: 'P', track: [{ title: 'A' }] });
    expect(p.updateTrack(5, { title: 'X' })).toBe(5);
    expect(titles(p)).toBe('A');
  });
});

describe('JspfPlaylist.merge', () => {
  it('concatenates tracks and keeps the first playlist metadata', () => {
    const merged = JspfPlaylist.merge([
      new JspfPlaylist({ title: 'P1', creator: 'C1', track: [{ title: 'a' }] }),
      new JspfPlaylist({ title: 'P2', track: [{ title: 'b' }, { title: 'c' }] }),
    ]);
    expect(merged.title).toBe('P1');
    expect(merged.creator).toBe('C1');
    expect(titles(merged)).toBe('a,b,c');
  });

  it('accepts plain objects as well as instances', () => {
    const merged = JspfPlaylist.merge([{ title: 'P1', track: [{ title: 'a' }] }, { track: [{ title: 'b' }] }]);
    expect(titles(merged)).toBe('a,b');
  });

  it('returns an empty playlist for an empty list', () => {
    const merged = JspfPlaylist.merge([]);
    expect(merged.title).toBe('Merged Playlist');
    expect(merged.track ?? []).toHaveLength(0);
  });

  it('merges meta with later playlists winning on a shared key', () => {
    const merged = JspfPlaylist.merge([
      new JspfPlaylist({ title: 'P1', meta: [{ 'https://x.org/a': '1' }, { 'https://x.org/b': '2' }] }),
      new JspfPlaylist({ title: 'P2', meta: [{ 'https://x.org/a': '9' }] }),
    ]);
    expect(merged.toDTO().meta).toEqual([{ 'https://x.org/a': '9' }, { 'https://x.org/b': '2' }]);
  });

  it('leaves meta absent when no playlist has any', () => {
    const merged = JspfPlaylist.merge([{ title: 'P1', track: [{ title: 'a' }] }]);
    expect(merged.toDTO().meta).toBeUndefined();
  });
});

describe('meta accessors', () => {
  it('round-trips a value on a track and on a playlist', () => {
    const t = new JspfTrack({ title: 'A' });
    t.setMeta('https://x.org/k', 'v');
    expect(t.getMeta('https://x.org/k')).toBe('v');
    expect(t.toDTO().meta).toEqual([{ 'https://x.org/k': 'v' }]);

    const p = new JspfPlaylist({ title: 'P' });
    p.setMeta('https://x.org/k', 'v');
    expect(p.getMeta('https://x.org/k')).toBe('v');
  });

  it('replaces rather than duplicates an existing key, and removes on undefined', () => {
    const t = new JspfTrack({ title: 'A' });
    t.setMeta('https://x.org/k', '1');
    t.setMeta('https://x.org/k', '2');
    expect(t.toDTO().meta).toEqual([{ 'https://x.org/k': '2' }]);
    t.setMeta('https://x.org/k', undefined);
    expect(t.toDTO().meta).toBeUndefined();
  });

  it('mergeMeta is exported for callers combining meta outside a playlist', () => {
    expect(mergeMeta([{ a: '1' }], [{ a: '2' }, { b: '3' }])).toEqual([{ a: '2' }, { b: '3' }]);
  });
});
