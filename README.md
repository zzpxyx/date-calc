# Date Calc
A simple TypeScript/JavaScript library for calculating dates. Given two dates, it can calculate the time period between them. Given a date and a time period, it can calculate the new date after adding the period to the date. It is also the name of the live demo.

## Build
`build.sh` requires `typescript` and `typedoc` in `npm`.

For building only the JavaScript library:

``` Shell
tsc src/date-calc.ts
```

## Usage
See `doc/index.html` for API reference.

See `demo/index.html` for a demo.

The key is to call `DateCalc.calculate(input1, input2)`. The returned string is the result of the calculation based on the two inputs.

## Tips
The live demo accepts URL query strings. `p1` and `p2` are for the two inputs. You can bookmark a URL like this for anniversaries, birthdays, and so on:

[https://zzpxyx.github.io/date-calc/index.html?p1=2017-09-21&p2=today](https://zzpxyx.github.io/date-calc/index.html?p1=2017-09-21&p2=today)

## License
See file `LICENSE`.
