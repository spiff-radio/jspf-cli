JSPF CLI
===============

JSPF CLI is a command line utility (CLI) relying on the [JSPF](https://www.xspf.org/jspf) format to convert and validate playlist files.

JSPF is an open format used to describe a list of multimedia files (audio or video), created by [Xiph](https://xiph.org/).
It is both simple and flexible, making it a good choice for programming purposes.

**Supported formats:** jspf,xspf,m3u8,m3u

This module was originally developed for [Spiff Radio](https://spiff-radio.org/), which uses JSPF as a fundamental part of its architecture.

Validation is done using a [JSON Schema](https://json-schema.org/) based on the [XSPF specifications](https://www.xspf.org/spec).

## Installation

```sh
$ npm install -g jspf-cli
```

## Usage

The tool provides two commands: **convert** and **validate**.

```sh
jspf-cli [command]
```

### Convert

```sh
jspf-cli convert [options] <path_in> <path_out>
```

#### Options


- `-i <file>`: Path to the input file [required].
- `-o <file>`: Path to the output file [required].
- `--format_in <format>`: The input format. If omitted, the tool will use the file extension of the input file.
- `--format_out <format>`: The output format. If omitted, the tool will use the file extension of the output file.

#### Example

Convert a JSPF playlist to a XSPF one

```sh
jspf-cli convert -i "path-to-input-file.xspf" -o "path-to-output-file.jspf"
```

### Validate

```sh
jspf-cli validate [options] <path>
```

#### Options


- `-i <file>`: Path to the input file [required].

#### Example

Validate a playlist

```sh
jspf-cli  validate -i "path-to-input-file.xspf"
```

## License

This tool is licensed under the [GNU General Public License (GPL)](https://www.gnu.org/licenses/gpl-3.0.en.html).
