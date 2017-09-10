/**
 * A class for calculating dates.
 */
class DateCalc {
    /**
     * Calculate the period between the start and the end dates.
     * @param dateString1 A string representing a date.
     * @param dateString2 A string representing another date.
     * @return A Period object for the period between the two dates.
     */
    static between(dateString1: string, dateString2: string): Period {
        let date1: LocalDate = LocalDate.parse(dateString1);
        let date2: LocalDate = LocalDate.parse(dateString2);
        return new Period(date1, date2);
    }
}

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
     * Check if the given year is a leap year.
     * @param year The given year.
     * @return True if the year is a leap year; false otherwise.
     */
    static isLeapYear(year: number): boolean {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    /**
     * Construct a LocalDate object by parsing a date string.
     * @param dateString The given date string.
     * @return The constructed LocalDate object.
     */
    static parse(dateString: string): LocalDate {
        let date: Date = new Date(dateString);
        let year: number = date.getUTCFullYear();
        let month: number = date.getUTCMonth() + 1;
        let day: number = date.getUTCDate();
        return new LocalDate(year, month, day);
    }

    /**
     * Count the number of days since the hypothetical Day 0.
     * Day 0 is the day before 0001-1-1.
     * @return The number of days since Day 0.
     * For example, 0001-1-1 will have the return value of 1.
     */
    sinceDayZero(): number {
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
     * Get the string representation of the LocalDate object.
     * Note that the returned string will have the following format:
     *   yyyy-mm-dd
     * @return The string representation.
     */
    toString(): string {
        return this.year + "-" + this.month + "-" + this.day;
    }
}

/**
 * A class to represent an amount of date-based time.
 */
class Period {
    /**
     * The two dates will be swapped if the start date is later than the end date.
     */
    constructor(
        readonly startDate: LocalDate,
        readonly endDate: LocalDate) {
        if (startDate.sinceDayZero() > endDate.sinceDayZero()) {
            let tmpDate: LocalDate = this.startDate;
            this.startDate = this.endDate;
            this.endDate = tmpDate;
        }

    }

    /**
     * Calculate the number of days between the start and the end dates.
     * @return The number of days in between.
     */
    getDays(): number {
        return this.endDate.sinceDayZero() - this.startDate.sinceDayZero();
    }

    /**
     * Calculate the years, months, and days between the start and end dates.
     * @return An array with the number of years, months, and days.
     */
    getYearsMonthsDays(): number[] {
        let years: number = this.endDate.year - this.startDate.year;
        let months: number = this.endDate.month - this.startDate.month;
        let days: number = this.endDate.day - this.startDate.day;
        let daysInMonth: number[] =
            [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Normalize the period.
        if (days < 0) {
            months--;
            days += daysInMonth[this.endDate.month];
            if (LocalDate.isLeapYear(this.endDate.year)) {
                days++;
            }
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return [years, months, days];
    }

    /**
     * Get the string representation of the Period object.
     * Note that the returned string will have the following format:
     *   3 years 2 months 1 day
     * @return The string representation.
     */
    toString(): string {
        let ret: string = "";
        let values: number[] = this.getYearsMonthsDays();
        let units: string[] = ["year", "month", "day"];
        for (let i: number = 0; i < 3; i++) {
            if (values[i] > 0) {
                if (ret !== "") {
                    ret += " ";
                }
                ret += values[i] + " " + units[i];
                if (values[i] > 1) {
                    ret += "s";
                }
            }
        }
        return ret;
    }
}
