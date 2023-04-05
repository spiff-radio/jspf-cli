JSPF Playlist
===============

> *The Node.js tool to handle JSPF Playlists *

JSPF Playlist is a command line utility to validate and convert music playlist files.
It's based on [JSPF](https://www.xspf.org/jspf), the JSON Shareable Playlist Format, created by [Xiph](https://xiph.org/).

It has been developed as a module for our music website, Spiff Radio, which uses JSPF has a "backbone".

More tools and modules are available on [our Github profile](https://github.com/spiff-radio) !

## Installation

```sh
$ [sudo] npm install -g jspf
```

## Usage

```sh
jspf --path_in="path-to-input-file.xspf" --format_in="xspf" --path_out="path-to-output-file.jspf" --format_out="jspf"
```

See [https://github.com/spiff-radio/jspf-playlist](https://github.com/spiff-radio/jspf-playlist) for more
input options.

## License
