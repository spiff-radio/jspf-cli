import { describe, it, expect } from 'vitest';
import parseXSPF from '../../../src/convert/formats/xspf-parser';
import serializeXSPF from '../../../src/convert/formats/xspf-serializer';

describe('convert/formats/xspf serializeXSPF', () => {
  it('round-trips attribution and extension instead of dropping them', () => {
    const playlist = {
      attribution: [
        { location: 'http://example.com/original.xspf' },
        { identifier: 'http://example.com/step2' }
      ],
      extension: {
        'http://example.com/app1': [{ foo: { _text: 'bar' } }],
        'http://example.com/app2': [{ baz: { _text: 'qux' } }]
      }
    };

    const xml = serializeXSPF(playlist as any);
    const reimported = parseXSPF(xml);

    expect(reimported.attribution).toEqual(playlist.attribution);
    expect(reimported.extension).toEqual(playlist.extension);
  });
});

describe('convert/formats/xspf parseXSPF', () => {
  it('ignores a <link> with no rel attribute instead of using the key "undefined"', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <playlist version="1" xmlns="http://xspf.org/ns/0/">
        <link>http://example.com/no-rel</link>
        <link rel="http://example.com/rel">http://example.com/with-rel</link>
      </playlist>`;

    const dto = parseXSPF(xml);

    expect(dto.link).toHaveLength(1);
    expect(dto.link?.[0]).toEqual({ 'http://example.com/rel': 'http://example.com/with-rel' });
    expect(dto.link?.[0]).not.toHaveProperty('undefined');
  });

  it('ignores a <meta> with no rel attribute instead of using the key "undefined"', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <playlist version="1" xmlns="http://xspf.org/ns/0/">
        <meta>orphan meta</meta>
        <meta rel="http://example.com/meta-rel">meta value</meta>
      </playlist>`;

    const dto = parseXSPF(xml);

    expect(dto.meta).toHaveLength(1);
    expect(dto.meta?.[0]).toEqual({ 'http://example.com/meta-rel': 'meta value' });
    expect(dto.meta?.[0]).not.toHaveProperty('undefined');
  });

  it('ignores an <extension> with no application attribute instead of using the key "undefined"', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <playlist version="1" xmlns="http://xspf.org/ns/0/">
        <extension><data>orphan</data></extension>
        <extension application="http://example.com/app"><data>value</data></extension>
      </playlist>`;

    const dto = parseXSPF(xml);

    expect(dto.extension).not.toHaveProperty('undefined');
    expect(Object.keys(dto.extension ?? {})).toEqual(['http://example.com/app']);
  });
});
