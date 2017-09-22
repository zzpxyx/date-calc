/**
 * A class for calculating dates.
 */
var DateCalc = /** @class */ (function () {
    function DateCalc() {
    }
    /**
     * Calculate the period between the start and the end dates.
     * @param dateString1 A string representing a date.
     * @param dateString2 A string representing another date.
     * @return A Period object for the period between the two dates.
     */
    DateCalc.between = function (dateString1, dateString2) {
        var date1 = LocalDate.parse(dateString1);
        var date2 = LocalDate.parse(dateString2);
        return new Period(date1, date2);
    };
    return DateCalc;
}());
/**
 * A class to represent a date without the time zone.
 */
var LocalDate = /** @class */ (function () {
    function LocalDate(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
        if (!LocalDate.validateDate(year, month, day)) {
            throw new Error("Please check date format.");
        }
    }
    /**
     * Check if the given year is a leap year.
     * @param year The given year.
     * @return True if the year is a leap year; false otherwise.
     */
    LocalDate.isLeapYear = function (year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    };
    /**
     * Construct a LocalDate object by parsing a date string.
     * @param dateString The given date string.
     * @return The constructed LocalDate object.
     */
    LocalDate.parse = function (dateString) {
        var localDate;
        var date;
        var year = 0;
        var month = 0;
        var day = 0;
        if (dateString.toLowerCase() === "today") {
            date = new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        }
        else {
            var datePieces = void 0;
            if (dateString.indexOf("-") > 0) {
                // Parse date like 2017-01-20.
                datePieces = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
                if (datePieces != null) {
                    year = +datePieces[1];
                    month = +datePieces[2];
                    day = +datePieces[3];
                }
            }
            else if (dateString.indexOf("/") > 0) {
                // Parse date like 01/20/2017.
                datePieces = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/.exec(dateString);
                if (datePieces != null) {
                    year = +datePieces[3];
                    month = +datePieces[1];
                    day = +datePieces[2];
                }
            }
            else if (dateString.indexOf(" ") > 0) {
                // Parse date like Jan 20 2017 or January 20 2017.
                datePieces = /^(.+)\s(\d{1,2})\s(\d{1,4})$/.exec(dateString);
                if (datePieces != null) {
                    year = +datePieces[3];
                    month = LocalDate.monthStringToNumber(datePieces[1]);
                    day = +datePieces[2];
                }
            }
        }
        return new LocalDate(year, month, day);
    };
    /**
     * Pad leading zeroes for the given value to the given length.
     * @param value The given value.
     * @param length The given length.
     * @return A string containing the given value with padded leading zeroes.
     */
    LocalDate.padZero = function (value, length) {
        var paddedValue = "" + value;
        while (paddedValue.length < length) {
            paddedValue = "0" + paddedValue;
        }
        return paddedValue;
    };
    /**
     * Check if a given date is valid.
     * @param year The year in the given date.
     * @param month The month in the given date.
     * @param day The day in the given date.
     * @return True if valid; false, otherwise.
     */
    LocalDate.validateDate = function (year, month, day) {
        var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (LocalDate.isLeapYear(year)) {
            daysInMonth[2] = 29;
        }
        if (!isFinite(year) || year < 1 ||
            !isFinite(month) || month < 1 || month > 12 ||
            !isFinite(day) || day < 1 || day > daysInMonth[month]) {
            return false;
        }
        return true;
    };
    /**
     * Convert a month name or abbreviation to the corresponding number.
     * @param monthString The month name or abbreviation.
     * @return The month number. -1 if monthString is not valid.
     */
    LocalDate.monthStringToNumber = function (monthString) {
        var month = -1;
        // Remove trailing period for month abbreviation.
        if (monthString[monthString.length - 1] === ".") {
            monthString = monthString.slice(0, -1);
        }
        if (monthString.length > 2) {
            var monthAbbrNames = ["", "jan", "feb", "mar", "apr", "may", "jun",
                "jul", "aug", "sep", "oct", "nov", "dec"];
            var monthNames = ["", "january", "february", "march",
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
    };
    /**
     * Count the number of days since the hypothetical Day 0.
     * Day 0 is the day before 0001-1-1.
     * @return The number of days since Day 0.
     * For example, 0001-1-1 will have the return value of 1.
     */
    LocalDate.prototype.sinceDayZero = function () {
        var total = 0;
        // Count the number of days to the end of the previous year.
        var prevYear = this.year - 1;
        total += 365 * prevYear;
        total += Math.floor(prevYear / 4);
        total -= Math.floor(prevYear / 100);
        total += Math.floor(prevYear / 400);
        // Count the number of days in the given year.
        var daysToEndOfPrevMonth = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        total += daysToEndOfPrevMonth[this.month];
        if ((this.month > 2) && LocalDate.isLeapYear(this.year)) {
            total++;
        }
        total += this.day;
        return total;
    };
    /**
     * Get the string representation of the LocalDate object.
     * Note that the returned string will have the following format:
     *   yyyy-mm-dd
     * @return The string representation.
     */
    LocalDate.prototype.toString = function () {
        return LocalDate.padZero(this.year, 4) + "-" +
            LocalDate.padZero(this.month, 2) + "-" +
            LocalDate.padZero(this.day, 2);
    };
    return LocalDate;
}());
/**
 * A class to represent an amount of date-based time.
 */
var Period = /** @class */ (function () {
    /**
     * The two dates will be swapped if the start date is later than the end date.
     */
    function Period(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        if (startDate == null || endDate == null) {
            throw new Error("Please check date format.");
        }
        if (startDate.sinceDayZero() > endDate.sinceDayZero()) {
            var tmpDate = this.startDate;
            this.startDate = this.endDate;
            this.endDate = tmpDate;
        }
    }
    /**
     * Calculate the number of days between the start and the end dates.
     * @return The number of days in between.
     */
    Period.prototype.getDays = function () {
        return this.endDate.sinceDayZero() - this.startDate.sinceDayZero();
    };
    /**
     * Calculate the years, months, and days between the start and end dates.
     * @return An array with the number of years, months, and days.
     */
    Period.prototype.getYearsMonthsDays = function () {
        var years = this.endDate.year - this.startDate.year;
        var months = this.endDate.month - this.startDate.month;
        var days = this.endDate.day - this.startDate.day;
        var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
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
    };
    /**
     * Get the string representation of the Period object.
     * Note that the returned string will have the following format:
     *   3 years 2 months 1 day
     * @return The string representation.
     */
    Period.prototype.toString = function () {
        var ret = "";
        var values = this.getYearsMonthsDays();
        var units = ["year", "month", "day"];
        for (var i = 0; i < 3; i++) {
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
    };
    return Period;
}());