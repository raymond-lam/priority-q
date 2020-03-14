# Changelog

## [3.0.11] - 2020-03-14

### Fixed

- Updated dev dependency to address security vulnerability

## [3.0.10] - 2020-02-09

### Fixed

- Fixed deployment

## [3.0.9] - 2020-02-09

### Changed

- Updated dev dependencies

## [3.0.8] - 2019-12-29

### Changed

- Updated dev dependencies

## [3.0.7] - 2019-10-27

### Changed

- Updated dev dependencies

### Fixed

- Fixed failing lint due to updated dev dependencies

## [3.0.6] - 2019-09-02

### Changed

- Updated dev dependencies

## [3.0.5] - 2019-08-03

### Changed

- Updated dev dependencies

## [3.0.4] - 2019-05-05

### Fixed

- Removed unnecessary dev dependencies to fix failing coverage script

### Changed

- Updated dev dependencies
- minor change README.md format

### Added

- coveralls.io integration
- additional badges in README.md

## [3.0.3] - 2019-02-22

- update dev dependencies due to security vulnerabilties in lodash 4.17.11
- migrate build badge to travis-ci.com

## [3.0.2] - 2018-09-06

### Fixed

- support very large priority queues (issue #10)
- deployment API key
- use rimraf so that npm clean is cross-platform
- ignore swp files

## [3.0.1] - 2018-06-28

### Changed

- changed references to git repo to priority-q

## [3.0.0] - 2018-06-26

### Added

- automatic NPM publication in Travis CI configuration
- linting

### Changed

- package name is now `priority-q`
- no longer transpiles to UMD module

## [2.0.1] - 2017-12-29

### Changed

- dependency version updates
- `npm run compile` will run `npm run clean` first

### Removed

- unneeded babel preset in `devDependencies`

### Fixed

- `prepublish` should be `prepublishOnly` in package.json

## [2.0.0] - 2017-05-14

### Added

- `filter` and `slice` methods
- index parameter to `peek` method
- `forEach` method
- `concat` method
- `indexOf` and `lastIndexOf` methods
- `some` and `every` methods
- `find` and `findIndex` methods
- `includes` method
- `join` method
- `reduce` and `reduceRight` methods
- `values` and `entries` methods
- `clear` method
- `toLocaleString`
- `clean` script in `package.json`

### Changed

- dependency version updates
- consolidated configuration into `package.json`

### Fixed

- `clone` will respect `Symbol.species` if specified, or return an object of the same class as `this`.
- minor bugs in test

## [1.0.6] - 2017-01-02

### Added
- Initial functionality
