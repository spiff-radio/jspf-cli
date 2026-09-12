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
