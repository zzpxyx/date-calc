describe("LocalDate", function() {
    it("can calculate days since hypothetical Day 0.", function() {
        expect(new LocalDate(1, 1, 1).sinceDayZero()).toBe(1);
        expect(new LocalDate(1, 1, 2).sinceDayZero()).toBe(2);
        expect(new LocalDate(1, 2, 2).sinceDayZero()).toBe(33);
        expect(new LocalDate(1, 3, 3).sinceDayZero()).toBe(62);
        expect(new LocalDate(4, 3, 3).sinceDayZero()).toBe(1158);
    });
    it("can get the string representation.", function() {
        expect(new LocalDate(1, 1, 1).toString()).toBe("0001-01-01");
        expect(new LocalDate(2000, 10, 10).toString()).toBe("2000-10-10");
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
        expect(LocalDate.parse("2017-01-02").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("01/02/2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("Jan 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("January 2 2017").toString()).toBe("2017-01-02");
        expect(LocalDate.parse("today") instanceof LocalDate).toBe(true);
    });
    it("can pad zeros according to the required width.", function() {
        expect(LocalDate.padZero(1, 0)).toBe("1");
        expect(LocalDate.padZero(1, 1)).toBe("1");
        expect(LocalDate.padZero(1, 2)).toBe("01");
        expect(LocalDate.padZero(1, 3)).toBe("001");
        expect(LocalDate.padZero(1, 4)).toBe("0001");
    });
    it("can validate a given date.", function() {
        expect(LocalDate.validateDate(0, 1, 1)).toBe(false);
        expect(LocalDate.validateDate(1, 0, 1)).toBe(false);
        expect(LocalDate.validateDate(1, 1, 0)).toBe(false);
        expect(LocalDate.validateDate(1, 1, 1)).toBe(true);
        expect(LocalDate.validateDate(1, 13, 1)).toBe(false);
        expect(LocalDate.validateDate(1, 2, 29)).toBe(false);
        expect(LocalDate.validateDate(4, 2, 29)).toBe(true);
        expect(LocalDate.validateDate("a", 1, 1)).toBe(false);
    });
    it("can convert a month name or abbreviation to number.", function() {
        expect(LocalDate.monthStringToNumber("Jan")).toBe(1);
        expect(LocalDate.monthStringToNumber("Jan.")).toBe(1);
        expect(LocalDate.monthStringToNumber("January")).toBe(1);
        expect(LocalDate.monthStringToNumber("Invalid")).toBe(-1);
    });
})

describe("Period", function() {
    it("can calculate the days between the start and the end dates.",
        function() {
            expect(new Period(new LocalDate(1, 1, 1),
                new LocalDate(1, 1, 2)).getDays()).toBe(1);
            expect(new Period(new LocalDate(1, 1, 1),
                new LocalDate(1, 3, 1)).getDays()).toBe(59);
            expect(new Period(new LocalDate(2000, 1, 1),
                new LocalDate(2001, 1, 1)).getDays()).toBe(366);
        }
    );
    it("can calculate the years, months, and days between two dates.",
        function() {
            expect(new Period(new LocalDate(1, 1, 1),
                new LocalDate(2, 3, 4)).getYearsMonthsDays()).toEqual([1, 2, 3]);
            expect(new Period(new LocalDate(1, 5, 9),
                new LocalDate(2, 3, 4)).getYearsMonthsDays()).toEqual([0, 9, 26]);
        }
    );
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
        expect(new Period(new LocalDate(1, 5, 9),
            new LocalDate(2, 3, 4)).toString()).toBe("9 months 26 days");
    });
})

describe("DateCalc", function() {
    it("can calculate the period between the start and the end dates.",
        function() {
            expect(DateCalc.between("0001-01-01",
                "0001-01-02").toString()).toBe("1 day");
            expect(DateCalc.between("2000-01-01",
                "2001-03-02").toString()).toBe("1 year 2 months 1 day");
        }
    );
})
