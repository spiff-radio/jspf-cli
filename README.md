# JSPF CLI — A command-line tool to convert and validate music playlists

**JSPF CLI** is a robust command-line tool (CLI) for converting and validating playlist files.  
It relies on the open **JSPF** format (JSON Scalable Playlist Format) as an internal model to ensure consistency and correctness.  Validation is made using [Zod](https://zod.dev/).  

### Supported playlist formats
`jspf` · `xspf` · `m3u8` · `m3u` · `pls`

JSPF is an open, JSON-based playlist format created by [Xiph](https://xiph.org/).  
It is simple, flexible, and well-suited for programmatic processing—making it an ideal pivot format.

This module was originally developed for [Spiff Radio](https://spiff-radio.org/), where JSPF plays a key role in the platform’s architecture.

---

## Installation


```sh
$ npm install -g jspf-cli
```

## Convert a playlist

```sh
jspf-cli convert [options]
```

### Options


- `-i, --path_in <file>`: Path to the input file [required].
- `-o, --path_out <file>`: Path to the output file [required].
- `--format_in <format>`: The input format. If omitted, the tool will use the extension of the input file.
- `--format_out <format>`: The output format. If omitted, the tool will use the extension of the output file.
- `--strict`: Abort the conversion if validation fails, instead of continuing with warnings [default is `false`].
- `--strip-invalid <boolean>`: Strip values that don't conform to the JSPF specification instead of failing on them [default is `true`].
- `--quiet`: Suppress validation warnings; only errors are shown [default is `false`].

### Example

Convert a `m3u8` playlist to a `xspf` one

```sh
jspf-cli convert -i "path-to-input-file.m3u8" -o "path-to-output-file.xspf"
```

## Validate a playlist

```sh
jspf-cli validate [options]
```

### Options


- `-i <file>`: Path to the input file [required].

### Example

```sh
jspf-cli  validate -i "path-to-input-file.xspf"
```

## Using it as a library

The conversion functions are also usable directly from JavaScript/TypeScript, without going through the CLI:

```js
const { importPlaylist, exportPlaylist } = require('jspf-cli/lib');

const jspfPlaylist = importPlaylist(m3u8FileContent, 'm3u8');
const xspfFileContent = exportPlaylist(jspfPlaylist, 'xspf');
```

Both functions accept the same `--strict`/`--strip-invalid` behavior as options:

```js
importPlaylist(data, 'jspf', { ignoreValidationErrors: true, stripInvalid: true });
```

Validation is done with [Zod](https://zod.dev/). When a conversion is rejected (`ignoreValidationErrors: false`), the thrown error is a `ZodValidationError` whose `.errors.issues` array describes what failed:

```js
const { ZodValidationError } = require('jspf-cli/build/entities/models.js');

try {
  exportPlaylist(playlist, 'jspf', { ignoreValidationErrors: false });
} catch (e) {
  if (e instanceof ZodValidationError) {
    console.error(e.errors.issues);
  }
}
```

## License

This tool is licensed under the [GNU General Public License v3.0 or later](https://www.gnu.org/licenses/gpl-3.0.en.html) — see [LICENSE](./LICENSE).
