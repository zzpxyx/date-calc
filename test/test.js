describe("DateCalc", function() {
    it("can calculate the period between the start and the end dates.",
        function() {
            expect(DateCalc.calculate("0001-01-01", "0001-01-02"))
                .toBe("1 day");
            expect(DateCalc.calculate("2000-01-01", "2001-03-02"))
                .toBe("426 days (1 year 2 months 1 day)");
            expect(DateCalc.calculate("today", "Today"))
                .toBe("0 days");
        }
    );
})

describe("LocalDate", function() {
    it("can parse a string to get a LocalDate object.", function() {
        expect(LocalDate.parse("2017-01-02").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("01/02/2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("Jan 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("January 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("today") instanceof LocalDate).toBe(true);
    });
    it("can calculate days until another date.", function() {
        expect(LocalDate.parse("1-1-1").daysUntil(LocalDate.parse("1-1-2")))
            .toBe(1);
        expect(LocalDate.parse("1-1-1").daysUntil(LocalDate.parse("1-2-2")))
            .toBe(32);
        expect(LocalDate.parse("1-1-1").daysUntil(LocalDate.parse("4-3-3")))
            .toBe(1157);
        expect(LocalDate.parse("1-1-3").daysUntil(LocalDate.parse("1-1-2")))
            .toBe(-1);
    });
    it("can calculate days since hypothetical Day 0.", function() {
        expect(LocalDate.parse("1-1-1").sinceDayZero()).toBe(1);
        expect(LocalDate.parse("1-2-2").sinceDayZero()).toBe(33);
        expect(LocalDate.parse("4-3-3").sinceDayZero()).toBe(1158);
    });
    it("can print out a string representation.", function() {
        expect(LocalDate.parse("2018-5-6").toString()).toBe("2018-05-06");
        expect(LocalDate.parse("03/04/2018").toString()).toBe("2018-03-04");
        expect(LocalDate.parse("Feb. 1 2018").toString()).toBe("2018-02-01");
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
    })
    it("can calculate the period between the start and the end dates.",
        function() {
            expect(Period.between(new LocalDate(1, 1, 1),
                new LocalDate(1, 1, 2)).toString()).toBe("1 day");
            expect(Period.between(new LocalDate(1, 1, 1),
                new LocalDate(1, 3, 1)).toString()).toBe("2 months");
            expect(Period.between(new LocalDate(2000, 1, 1),
                new LocalDate(2001, 1, 1)).toString()).toBe("1 year");
            expect(Period.between(new LocalDate(1, 1, 1), new LocalDate(2, 3, 4))
                .toString()).toBe("1 year 2 months 3 days");
            expect(Period.between(new LocalDate(1, 1, 3),
                new LocalDate(1, 1, 2)).toString()).toBe("1 day");
        }
    );
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
    it("can check if a given year is a leap year.", function() {
        expect(Utils.isLeapYear(1)).toBe(false);
        expect(Utils.isLeapYear(4)).toBe(true);
        expect(Utils.isLeapYear(100)).toBe(false);
        expect(Utils.isLeapYear(400)).toBe(true);
        expect(Utils.isLeapYear(1900)).toBe(false);
        expect(Utils.isLeapYear(2000)).toBe(true);
    });
    it("can make simple plural form based on the count.", function() {
        expect(Utils.pluralize(0, "year")).toBe("years");
        expect(Utils.pluralize(1, "month")).toBe("month");
        expect(Utils.pluralize(2, "day")).toBe("days");
    })
})
