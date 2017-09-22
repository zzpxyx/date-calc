#!/bin/bash

tsc src/date-calc.ts
cp src/date-calc.js demo/scripts
typedoc --readme none --name "Date Calc" --out doc src
