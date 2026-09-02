import { describe, it, expect } from 'vitest';
import { JspfTrack, JspfPlaylist, JspfMeta } from '../../src/entities/models';

describe('JspfBase re-wrap safety', () => {
  it('re-wrapping an existing JspfPlaylist instance does not leak _data/_schema into its DTO', () => {
    // This is exactly the shape of a common caller pattern: passing an
    // already-constructed instance back into the constructor (e.g. a store
    // action typed as `setPlaylist(data)` receiving a JspfPlaylist instance
    // instead of a plain object).
    const original = new JspfPlaylist({ title: 'P1', track: [{ title: 'A' }] });
    const rewrapped = new JspfPlaylist(original);
    const dto = rewrapped.toDTO();
    expect(dto).toEqual({ title: 'P1', track: [{ title: 'A' }] });
    expect(dto).not.toHaveProperty('_data');
    expect(dto).not.toHaveProperty('_schema');
  });

  it('re-wrapping an existing JspfTrack instance does not leak _data/_schema into its DTO', () => {
    const original = new JspfTrack({ title: 'Song', creator: 'Artist' });
    const rewrapped = new JspfTrack(original);
    const dto = rewrapped.toDTO();
    expect(dto).toEqual({ title: 'Song', creator: 'Artist' });
    expect(dto).not.toHaveProperty('_data');
    expect(dto).not.toHaveProperty('_schema');
  });
});

describe('meta/link/attribution accessor normalization', () => {
  it('assigning a plain object post-construction still round-trips through toJSON/toDTO', () => {
    const track = new JspfTrack({ title: 'Song', creator: 'Artist' });
    // This is exactly the pattern that used to corrupt/crash: treating meta as a plain object
    (track as any).meta = { dateAdded: '2024-01-01T00:00:00.000Z' };
    expect(Array.isArray(track.meta)).toBe(true);
    expect(track.meta![0]).toBeInstanceOf(JspfMeta);
    expect(() => track.toJSON()).not.toThrow();
    expect(track.toJSON().meta).toEqual([{ dateAdded: '2024-01-01T00:00:00.000Z' }]);
    expect(() => track.toDTO()).not.toThrow();
  });

  it('assigning a single (non-array) meta entry wraps it into a one-element array', () => {
    const playlist = new JspfPlaylist({ title: 'P' });
    (playlist as any).meta = { 'importer/pagination': { page: 2 } };
    expect(playlist.meta).toHaveLength(1);
    expect(playlist.toDTO().meta).toEqual([{ 'importer/pagination': { page: 2 } }]);
  });

  it('re-wrapping an existing JspfMeta instance does not leak internal bookkeeping fields', () => {
    const original = new JspfMeta({ genre: 'rock' });
    const rewrapped = new JspfMeta(original);
    const json = rewrapped.toJSON();
    expect(json).toEqual({ genre: 'rock' });
    expect(json).not.toHaveProperty('_data');
    expect(json).not.toHaveProperty('_schema');
  });

  it('assigning an array of plain objects (e.g. from Object.assign-style merge) wraps each entry', () => {
    const playlist = new JspfPlaylist({ title: 'P' });
    (playlist as any).meta = [{ a: '1' }, { b: '2' }];
    expect(playlist.meta!.every(m => m instanceof JspfMeta)).toBe(true);
    expect(playlist.toDTO().meta).toEqual([{ a: '1' }, { b: '2' }]);
  });

  it('assigning undefined/null clears the field', () => {
    const track = new JspfTrack({ title: 'Song', meta: [{ a: '1' }] });
    expect(track.meta).toHaveLength(1);
    (track as any).meta = undefined;
    expect(track.meta).toBeUndefined();
    expect(track.toDTO()).not.toHaveProperty('meta');
  });
});
