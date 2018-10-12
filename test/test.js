describe("DateCalc", function() {
    it("can calculate the period between the start and the end dates.",
        function() {
            expect(DateCalc.calculate("0001-01-01", "0001-01-02"))
                .toBe("1 day");
            expect(DateCalc.calculate("2000-01-01", "2001-03-02"))
                .toBe("426 days (1 year 2 months 1 day)");
            expect(DateCalc.calculate("2000-02-10", "2002-01-05"))
                .toBe("695 days (1 year 10 months 26 days)");
            expect(DateCalc.calculate("today", "Today"))
                .toBe("0 days");
        }
    );
    it("can calculate the date after adding a given period to a given date.",
        function() {
            expect(DateCalc.calculate("0001-01-01", "1 day"))
                .toBe("0001-01-02");
            expect(DateCalc.calculate("2000-01-01", "426 days"))
                .toBe("2001-03-02");
            expect(DateCalc.calculate("2000-01-01", "1 year 2 months 1 day"))
                .toBe("2001-03-02");
            expect(DateCalc.calculate("2000-02-10", "695d"))
                .toBe("2002-01-05");
            expect(DateCalc.calculate("2000-02-10", "1y10m26d"))
                .toBe("2002-01-05");
            expect(DateCalc.calculate("2000-01-01", "24m31d"))
                .toBe("2002-02-01");
        }
    );
    it("can prompt input errors.", function() {
        expect(function() {
            DateCalc.calculate("0001-01-01", "abc");
        }).toThrowError(Error, "The second input is invalid.")
        expect(function() {
            DateCalc.calculate("-1year", "2000-01-01");
        }).toThrowError(Error, "The first input is invalid.")
        expect(function() {
            DateCalc.calculate("t", "T");
        }).toThrowError(Error, "At least one input must be a valid date.")
    });
})

describe("LocalDate", function() {
    it("can parse a string to get a LocalDate object.", function() {
        expect(LocalDate.parse("2017-01-02").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("01/02/2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("Jan 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("January 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("today") instanceof LocalDate).toBe(true);
        expect(LocalDate.parse("2017-02-29")).toBe(null);
    });
    it("can calculate days until another date.", function() {
        expect(new LocalDate(1, 1, 1).daysUntil(new LocalDate(1, 1, 2))).toBe(1);
        expect(new LocalDate(1, 1, 1).daysUntil(new LocalDate(1, 2, 2))).toBe(32);
        expect(new LocalDate(1, 1, 1).daysUntil(new LocalDate(4, 3, 3)))
            .toBe(1157);
        expect(new LocalDate(1, 1, 3).daysUntil(new LocalDate(1, 1, 2))).toBe(-1);
    });
    it("can calculate the period until another date.", function() {
        expect(new LocalDate(1, 1, 1).periodUntil(new LocalDate(1, 1, 2))
            .toString()).toBe("1 day");
        expect((new LocalDate(1, 1, 1)).periodUntil(new LocalDate(1, 3, 1))
            .toString()).toBe("2 months");
        expect((new LocalDate(2000, 1, 1)).periodUntil(new LocalDate(2001, 1, 1))
            .toString()).toBe("1 year");
        expect((new LocalDate(1, 1, 1)).periodUntil(new LocalDate(2, 3, 4))
            .toString()).toBe("1 year 2 months 3 days");
        expect((new LocalDate(1, 1, 3)).periodUntil(new LocalDate(1, 1, 2))
            .toString()).toBe("1 day");
    });
    it("can calculate the date after adding a period.", function() {
        expect(new LocalDate(1, 1, 1).addPeriod(new Period(1, 1, 1)).toString())
            .toBe("0002-02-02");
        expect(new LocalDate(1, 1, 1).addPeriod(new Period(1, 11, 31)).toString())
            .toBe("0003-01-01");
        expect(new LocalDate(1, 1, 1).addPeriod(new Period(1, 12, 31)).toString())
            .toBe("0003-02-01");
        expect(new LocalDate(1, 1, 1).addPeriod(new Period(0, 0, 365)).toString())
            .toBe("0002-01-01");
        expect(new LocalDate(4, 1, 1).addPeriod(new Period(0, 0, 365)).toString())
            .toBe("0004-12-31");
    });
    it("can print out a string representation.", function() {
        expect(new LocalDate(2018, 10, 6).toString()).toBe("2018-10-06");
        expect(new LocalDate(2018, 3, 14).toString()).toBe("2018-03-14");
        expect(new LocalDate(2018, 1, 2).toString()).toBe("2018-01-02");
        expect(new LocalDate(1, 1, 2).toString()).toBe("0001-01-02");
    });
})

describe("Period", function() {
    it("can parse a string to get a Period object.", function() {
        expect(Period.parse("1 year 2 months 3 days").toString())
            .toBe("1 year 2 months 3 days");
        expect(Period.parse("1year2month3day").toString())
            .toBe("1 year 2 months 3 days");
        expect(Period.parse("1 y2m 3 d").toString())
            .toBe("1 year 2 months 3 days");
        expect(Period.parse("1  year2 month3d").toString())
            .toBe("1 year 2 months 3 days");
        expect(Period.parse("2weeks")).toBe(null);
    })
    it("can print out a string representation.", function() {
        expect(new Period(0, 0, 1).toString()).toBe("1 day");
        expect(new Period(0, 2, 1).toString()).toBe("2 months 1 day");
        expect(new Period(3, 2, 1).toString()).toBe("3 years 2 months 1 day");
        expect(new Period(1, 1, 0).toString()).toBe("1 year 1 month");
        expect(new Period(1, 0, 0).toString()).toBe("1 year");
        expect(new Period(0, 0, 100).toString()).toBe("100 days");
        expect(new Period(100, 100, 100).toString())
            .toBe("100 years 100 months 100 days");
    });
})

describe("Utils", function() {
    it("can make simple plural form based on the count.", function() {
        expect(Utils.pluralize(0, "year")).toBe("years");
        expect(Utils.pluralize(1, "month")).toBe("month");
        expect(Utils.pluralize(2, "day")).toBe("days");
    })
})
