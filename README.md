# JSPF CLI — A command-line tool to convert and validate music playlists

**JSPF CLI** is a robust command-line tool (CLI) for converting and validating playlist files.  
It relies on the open **JSPF** format (JSON Scalable Playlist Format) as an internal model to ensure consistency and correctness.

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
jspf-cli convert [options] <path_in> <path_out>
```

### Options


- `-i <file>`: Path to the input file [required].
- `-o <file>`: Path to the output file [required].
- `--force <boolean>`: Force conversion even if the validation fails.  Invalid values will be stripped [default is `false`].
- `--format_in <format>`: The input format. If omitted, the tool will use the extension of the input file.
- `--format_out <format>`: The output format. If omitted, the tool will use the extension of the output file.

### Example

Convert a `m3u8` playlist to a `xspf` one

```sh
jspf-cli convert -i "path-to-input-file.m3u8" -o "path-to-output-file.xspf"
```

## Validate a playlist

```sh
jspf-cli validate [options] <path>
```

### Options


- `-i <file>`: Path to the input file [required].

### Example

```sh
jspf-cli  validate -i "path-to-input-file.xspf"
```

## License

This tool is licensed under the [GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.en.html).
