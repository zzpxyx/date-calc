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
});

describe("Period", function() {
    it("can calculate the days between the start and the end dates.", function() {
        expect(new Period(new LocalDate(1, 1, 1),
            new LocalDate(1, 1, 2)).getDays()).toBe(1);
        expect(new Period(new LocalDate(1, 1, 1),
            new LocalDate(1, 3, 1)).getDays()).toBe(59);
        expect(new Period(new LocalDate(2000, 1, 1),
            new LocalDate(2001, 1, 1)).getDays()).toBe(366);
    });
})
