describe("LocalDate", function() {
    it("can calculate days since hypothetical Day 0.", function() {
        expect(new LocalDate(1, 1, 1).sinceDayZero()).toBe(1);
        expect(new LocalDate(1, 1, 2).sinceDayZero()).toBe(2);
        expect(new LocalDate(1, 2, 2).sinceDayZero()).toBe(33);
        expect(new LocalDate(1, 3, 3).sinceDayZero()).toBe(62);
        expect(new LocalDate(4, 3, 3).sinceDayZero()).toBe(1158);
    });
    it("can check if a given year is a leap year.", function() {
        expect(LocalDate.isLeapYear(1)).toBe(false);
        expect(LocalDate.isLeapYear(4)).toBe(true);
        expect(LocalDate.isLeapYear(100)).toBe(false);
        expect(LocalDate.isLeapYear(400)).toBe(true);
        expect(LocalDate.isLeapYear(1900)).toBe(false);
        expect(LocalDate.isLeapYear(2000)).toBe(true);
    });
    it("can parse a string to get a LocalDate object.", function() {
        expect(LocalDate.parse("2017-01-01") instanceof LocalDate).toBe(true);
        expect(LocalDate.parse("2017/01/01") instanceof LocalDate).toBe(true);
        expect(LocalDate.parse("01/01/2017") instanceof LocalDate).toBe(true);
        expect(LocalDate.parse("Jan 1, 2017") instanceof LocalDate).toBe(true);
    })
});

describe("Period", function() {
    it("can calculate the days between the start and the end dates.",
        function() {
            expect(new Period(new LocalDate(1, 1, 1),
                new LocalDate(1, 1, 2)).getDays()).toBe(1);
            expect(new Period(new LocalDate(1, 1, 1),
                new LocalDate(1, 3, 1)).getDays()).toBe(59);
            expect(new Period(new LocalDate(2000, 1, 1),
                new LocalDate(2001, 1, 1)).getDays()).toBe(366);
        });
    it("can be shown in a string representation.", function() {
        expect(new Period(new LocalDate(1, 1, 1),
            new LocalDate(1, 1, 2)).toString()).toBe("1 day");
        expect(new Period(new LocalDate(1, 1, 1),
            new LocalDate(1, 3, 1)).toString()).toBe("2 months");
        expect(new Period(new LocalDate(2000, 1, 1),
            new LocalDate(2001, 1, 1)).toString()).toBe("1 year");
        expect(new Period(new LocalDate(2000, 1, 1),
            new LocalDate(2001, 1, 2)).toString()).toBe("1 year 1 day");
        expect(new Period(new LocalDate(2000, 1, 1),
            new LocalDate(2001, 2, 2)).toString()).toBe("1 year 1 month 1 day");
        expect(new Period(new LocalDate(2000, 1, 1),
            new LocalDate(2002, 3, 3)).toString()).toBe(
            "2 years 2 months 2 days");
    });
})

describe("DateCalc", function() {
    it("can calculate the days between the start and the end dates.",
        function() {
            expect(DateCalc.daysBetween("0001-01-01", "0001-01-02")).toBe(1);
            expect(DateCalc.daysBetween("2000-01-01", "2001-03-02")).toBe(426);
        });
    it("can calculate the period between the start and the end dates.",
        function() {
            expect(DateCalc.periodBetween("0001-01-01",
                "0001-01-02")).toBe("1 day");
            expect(DateCalc.periodBetween("2000-01-01",
                "2001-03-02")).toBe("1 year 2 months 1 day");
        });
})
