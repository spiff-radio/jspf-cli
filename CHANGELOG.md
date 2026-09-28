## [2.0.15]
- `JspfExtensionSchema` now accepts an object as well as an array per namespace - some extensions
  (ours, MusicBrainz's own `.../doc/jspf#track`) hold a flat set of named properties rather than a
  list of items, and the array-only schema silently stripped those on a `stripInvalid` export.
- `JspfExtensionI`'s index signature updated to match (`any[] | Record<string, any>`).

## [2.0.14]
- `matchKey()` extracted as a standalone `trackMatchKey()` function (same reason `getTrackLabel()`
  already is one: works on a plain DTO, not just a `JspfTrack` instance).
- `matchKey()`/`trackMatchKey()` no longer includes `album` - two tracks with the same title and
  creator are duplicates regardless of which album (if any) is attached to either.

## [2.0.13]
- JspfPlaylist serializes its own fields instead of the constructor's input: a title (or creator,
  annotation, image, ...) assigned after construction was silently dropped by toJSON/toDTO and
  every conversion built on them. Tracks were never affected.
- Validation (isValid/getValidationErrors/parse/safeParse) now runs against what the object would
  export rather than what it was built from, so an edit cannot be judged on the old value.
- Note: a non-JSPF field passed to the JspfPlaylist constructor is no longer echoed back by
  toJSON. Tracks have always dropped those.
## [2.0.6]
Claude audit and fixes:
- added a license
- cleaned and improved tests
- duration bug fixed
- removed dead deps
## [2.0.5]
- Fix SinglePair re-wrapping and normalize meta/link arrays; update deps
## [2.0.4]
- Replaced custom cleanNestedObject with cleanDeep from clean-deep package.
## [2.0.0]
- removed class-validator
- removed class-transformer"
- removed reflect-metadata
- added zod
## [1.1.0]
- bugfixes and test routines (IA)
## [1.0.8] - 2024-09-28
- updated dependencies
