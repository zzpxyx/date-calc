/**
 * A class for calculating dates and periods.
 */
class DateCalc {
    /**
     * Calculate the period between the start and the end dates.
     * @param dateString1 A string representing a date.
     * @param dateString2 A string representing another date.
     * @return A Period object for the period between the two dates.
     */
    public static calculate(input1: string, input2: string): string {
        let localDate1: LocalDate;
        let localDate2: LocalDate;
        let validationScore: number = 0;
        localDate1 = LocalDate.parse(input1);
        localDate2 = LocalDate.parse(input2);
        validationScore += localDate1 ? 1 : 0;
        validationScore += localDate2 ? 2 : 0;
        switch (validationScore) {
            case 3:
                let days = Math.abs(localDate1.daysUntil(localDate2));
                let daysString = days + " " + Utils.pluralize(days, "day");
                let periodString = localDate1.periodUntil(localDate2).toString();
                return daysString === periodString ?
                    daysString : daysString + " (" + periodString + ")";
            //case [true, false]:
            //    if (Period.tryParse(input2, period)) {
            //        return localDate1.addPeriod(period).toString();
            //    } else {
            //        throw new Error("Second input is invalid.");
            //    }
            //case [false, true]:
            //    if (Period.tryParse(input1, period)) {
            //        return localDate2.addPeriod(period).toString();
            //    } else {
            //        throw new Error("First input is invalid.");
            //    }
            //case [false, false]:
            //    throw new Error("Either or both inputs are invalid.");
        }
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
     * Construct a LocalDate object by parsing a date string.
     * @param dateString The given date string.
     * @return The constructed LocalDate object.
     */
    public static parse(dateString: string): LocalDate {
        let year: number = 0;
        let month: number = 0;
        let day: number = 0;
        if (dateString.toLowerCase() === "today") {
            let date: Date = new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        } else {
            let datePieces: string[];
            if (dateString.indexOf("-") > 0) {
                // Parse date strings like 2017-01-20.
                datePieces = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
                if (datePieces) {
                    year = +datePieces[1];
                    month = +datePieces[2];
                    day = +datePieces[3];
                }
            } else if (dateString.indexOf("/") > 0) {
                // Parse date strings like 01/20/2017.
                datePieces = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/.exec(dateString);
                if (datePieces) {
                    year = +datePieces[3];
                    month = +datePieces[1];
                    day = +datePieces[2];
                }
            } else if (dateString.indexOf(" ") > 0) {
                // Parse date strings like Jan 20 2017 or January 20 2017.
                datePieces = /^(.+)\s(\d{1,2})\s(\d{1,4})$/.exec(dateString);
                if (datePieces) {
                    year = +datePieces[3];
                    month = LocalDate.monthStringToNumber(datePieces[1]);
                    day = +datePieces[2];
                }
            }
        }
        if (LocalDate.validateDate(year, month, day)) {
            return new LocalDate(year, month, day);
        } else {
            throw new Error("Invalid date or unsupported format.");
        }
    }

    /**
     * Get the number of days until a given date.
     * @param endDate The given date.
     * @return The number of days until that given date.
     */
    public daysUntil(endDate: LocalDate): number {
        return endDate.sinceDayZero() - this.sinceDayZero();
    }

    /**
     * Get a Period object representing the period until a given date.
     * @param endDate The given date.
     * @return The Period object until the given date.
     */
    public periodUntil(endDate: LocalDate): Period {
        let startDate: LocalDate = this;
        if (startDate.daysUntil(endDate) < 0) {
            [startDate, endDate] = [endDate, startDate];
        }
        let years: number = endDate.year - startDate.year;
        let months: number = endDate.month - startDate.month;
        let days: number = endDate.day - startDate.day;
        let daysInMonth: number[] =
            [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Normalize the period.
        if (days < 0) {
            months--;
            days += daysInMonth[endDate.month];
            if (LocalDate.isLeapYear(endDate.year)) {
                days++;
            }
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return new Period(years, months, days);
    }

    /**
     * Get a new LocalDate object after adding a Period to a LocalDate.
     * @param period The given Period object.
     * @return A new LocalDate object.
     */
    public addPeriod(period: Period): LocalDate {
        let year: number = this.year + period.years;
        let month: number = this.month + period.months;
        let day: number = this.day + period.days;
        let daysInMonth: number;

        // Normalize year and month.
        year += Math.floor((month - 1) / 12);
        month = (month - 1) % 12 + 1;

        // Normalize day.
        daysInMonth = LocalDate.getDaysInMonth(year, month);
        while (day > daysInMonth) {
            day -= daysInMonth;
            month++;
            if (month > 12) {
                year++;
                month -= 12;
            }
            daysInMonth = LocalDate.getDaysInMonth(year, month);
        }
        return new LocalDate(year, month, day);
    }

    /**
     * Get the string representation of the LocalDate object.
     * Note that the returned string will have the following format:
     *   yyyy-mm-dd
     * @return The string representation.
     */
    public toString(): string {
        return LocalDate.padZero(this.year, 4) + "-" +
            LocalDate.padZero(this.month, 2) + "-" +
            LocalDate.padZero(this.day, 2);
    }

    /**
     * Check if a given date is valid.
     * @param year The year in the given date.
     * @param month The month in the given date.
     * @param day The day in the given date.
     * @return True if valid; false, otherwise.
     */
    private static validateDate(
        year: number,
        month: number,
        day: number
    ): boolean {
        let daysInMonth: number[] =
            [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (LocalDate.isLeapYear(year)) {
            daysInMonth[2] = 29;
        }
        if (!isFinite(year) || year < 1 ||
            !isFinite(month) || month < 1 || month > 12 ||
            !isFinite(day) || day < 1 || day > daysInMonth[month]) {
            return false;
        }
        return true;
    }

    /**
     * Count the number of days since the hypothetical Day 0.
     * Day 0 is the day before 0001-1-1.
     * @return The number of days since Day 0.
     * For example, 0001-1-1 will have the return value of 1.
     */
    private sinceDayZero(): number {
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
     * @param year The given year.
     * @return True if the year is a leap year; false otherwise.
     */
    private static isLeapYear(year: number): boolean {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    /**
     * Convert a month name or abbreviation to the corresponding number.
     * @param monthString The month name or abbreviation.
     * @return The month number. -1 if monthString is not valid.
     */
    private static monthStringToNumber(monthString: string): number {
        let month: number = -1;

        // Remove trailing period for month abbreviation.
        if (monthString[monthString.length - 1] === ".") {
            monthString = monthString.slice(0, -1);
        }

        if (monthString.length > 2) {
            let monthAbbrNames: string[] =
                ["", "jan", "feb", "mar", "apr", "may", "jun",
                    "jul", "aug", "sep", "oct", "nov", "dec"];
            let monthNames: string[] =
                ["", "january", "february", "march",
                    "april", "may", "june",
                    "july", "august", "september",
                    "october", "november", "december"];
            monthString = monthString.toLowerCase();
            month = monthAbbrNames.indexOf(monthString);
            if (month === -1) {
                month = monthNames.indexOf(monthString);
            }
        }
        return month;
    }

    /**
     * Get the number of days in the given year and month.
     * Mote that both the year and the month must be valid and normalized.
     * @param year The given year.
     * @param month The given month.
     * @return The number of days in that month of that year.
     */
    private static getDaysInMonth(year: number, month: number): number {
        let daysInMonth: number[] =
            [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (LocalDate.isLeapYear(year)) {
            daysInMonth[2] = 29;
        }
        return daysInMonth[month];
    }

    /**
     * Pad leading zeroes for the given value to the given length.
     * @param value The given value.
     * @param length The given length.
     * @return A string containing the given value with padded leading zeroes.
     */
    private static padZero(value: number, length: number): string {
        let paddedValue: string = "" + value;
        while (paddedValue.length < length) {
            paddedValue = "0" + paddedValue;
        }
        return paddedValue;
    }
}

/**
 * A class to represent an amount of date-based time.
 */
class Period {
    constructor(
        readonly years: number,
        readonly months: number,
        readonly days: number) {
    }

    /**
     * Construct a Period object by parsing a period string.
     * @param periodString The given period string.
     * @return The constructed Period object.
     */
    public static parse(periodString: string): Period {
        let years: number = 0;
        let months: number = 0;
        let days: number = 0;
        let periodPieces: string[];
        periodPieces = new RegExp("^" +
            "(\\d*)\\s*(y|year|years)\\s*" +
            "(\\d*)\\s*(m|month|months)\\s*" +
            "(\\d*)\\s*(d|day|days)$").exec(periodString);
        if (periodPieces) {
            years = +periodPieces[1];
            months = +periodPieces[3];
            days = +periodPieces[5];
        }
        return new Period(years, months, days);
    }

    /**
     * Get the string representation of the Period object.
     * Note that the returned string will have the following format:
     *   y years m months d days
     * where the units are pluralized automatically.
     * @return The string representation.
     */
    public toString(): string {
        let components: { value: number, unit: string }[] = [
            { value: this.years, unit: "year" },
            { value: this.months, unit: "month" },
            { value: this.days, unit: "day" }
        ];
        return components.filter(c => c.value > 0)
            .map(c => c.value + " " + Utils.pluralize(c.value, c.unit))
            .join(" ") || "0 days";
    }
}

/**
 * A class for shared miscellaneous utilities.
 */
class Utils {
    /**
     * Get the singular or the plural form of a unit based on the count.
     * Note that this is naively adding "s" at the end of the unit when necessary.
     * @param count The count.
     * @param singular The singular form of the unit.
     * @return The proper form of the unit.
     */
    public static pluralize(count: number, singular: string): string {
        return count === 1 ? singular : singular + "s";
    }
}
