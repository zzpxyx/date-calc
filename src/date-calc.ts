/**
 * A class to represent a date without the time zone.
 */
class LocalDate {
    constructor(
        readonly year: number,
        readonly month: number,
        readonly day: number) {
    }

    /**
     * Count the number of days since the hypothetical Day 0.
     * Day 0 is the day before 0001-1-1.
     * @return The number of days since Day 0.
     * For example, 0001-1-1 will have the return value of 1.
     */
    public sinceDayZero(): number {
        let total: number = 0;

        // Count the number of days to the end of the previous year.
        let prevYear: number = this.year - 1;
        total += 365 * prevYear;
        total += Math.floor(prevYear / 4);
        total -= Math.floor(prevYear / 100);
        total += Math.floor(prevYear / 400);

        // Count the number of days in the given year.
        let daysToEndOfPrevMonth: number[] =
            [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        total += daysToEndOfPrevMonth[this.month];
        if ((this.month > 2) && LocalDate.isLeapYear(this.year)) {
            total++;
        }
        total += this.day;

        return total;
    }

    /**
     * Check if the given year is a leap year.
     * @return True if the year is a leap year; false otherwise.
     */
    public static isLeapYear(year: number): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
}
