# Date Calc
A simple TypeScript/JavaScript library for calculating the period between two dates. It is also the name of the live demo.

## Build
`build.sh` requires `typescript` and `typedoc` in `npm`.

For building only the JavaScript library:

``` Shell
tsc src/date-calc.ts
```

## Usage
See `doc/index.html` for API reference.

See `demo/index.html` for a demo.

The key is to call `DateCalc.between(dateString1, dateString2)`. The returned `Period` object has both dates and the period between them.

## Tips
The live demo accepts the URL query string. `p1` and `p2` are for the two dates. You can bookmark a URL like this for anniversaries, birthdays, and so on:

[https://zzpxyx.github.io/date-calc/index.html?p1=2017-09-21&p2=today](https://zzpxyx.github.io/date-calc/index.html?p1=2017-09-21&p2=today)

## License
See file `LICENSE`.
