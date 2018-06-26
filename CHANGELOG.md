# Changelog

## [2.0.1] - 2017-12-29

## Changed

- dependency version updates
- `npm run compile` will run `npm run clean` first


## Removed

- unneeded babel preset in `devDependencies`

## Fixed

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
