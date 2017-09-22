# Date Calc
A simple Typescript/Javascript library for calculating the period betwen two dates. It is also the name of the live demo.

## Build
`build.sh` requies `typescript` and `typedoc` in `npm`.

For building only the Javascript library:

``` Shell
tsc src/date-calc.ts
```

## Usage
See `doc/index.html` for API reference.

See `demo/index.html` for a demo.

The key is to call `DateCalc.between(dateString1, dateString2)`. The returned `Period` object has both dates and the period between them.

## License
See file `LICENSE`.
