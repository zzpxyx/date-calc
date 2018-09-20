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
                let periodString = Period.between(localDate1, localDate2)
                    .toString();
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
    private constructor(
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

    public daysUntil(endDate: LocalDate): number {
        return endDate.sinceDayZero() - this.sinceDayZero();
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
        if ((this.month > 2) && Utils.isLeapYear(this.year)) {
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
    public toString(): string {
        return LocalDate.padZero(this.year, 4) + "-" +
            LocalDate.padZero(this.month, 2) + "-" +
            LocalDate.padZero(this.day, 2);
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
        if (Utils.isLeapYear(year)) {
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
}

/**
 * A class to represent an amount of date-based time.
 */
class Period {
    private constructor(
        readonly years: number,
        readonly months: number,
        readonly days: number) {
    }

    public static between(localDate1: LocalDate, localDate2: LocalDate): Period {
        if (localDate1.daysUntil(localDate2) < 0) {
            [localDate1, localDate2] = [localDate2, localDate1];
        }
        let years: number = localDate2.year - localDate1.year;
        let months: number = localDate2.month - localDate1.month;
        let days: number = localDate2.day - localDate1.day;
        let daysInMonth: number[] =
            [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Normalize the period.
        if (days < 0) {
            months--;
            days += daysInMonth[localDate2.month];
            if (Utils.isLeapYear(localDate2.year)) {
                days++;
            }
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return new Period(years, months, days);
    }

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

class Utils {
    /**
     * Check if the given year is a leap year.
     * @param year The given year.
     * @return True if the year is a leap year; false otherwise.
     */
    public static isLeapYear(year: number): boolean {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    public static pluralize(count: number, singular: string): string {
        return count === 1 ? singular : singular + "s";
    }
}
