/**
 * A class for calculating dates and periods.
 */
var DateCalc = /** @class */ (function () {
    function DateCalc() {
    }
    /**
     * Calculate the date or the period according to the inputs.
     * Note that at least one of the inputs must be a valid date.
     * @param dateString1 A string representing a date or a period.
     * @param dateString2 A string representing a date or a period.
     * @return A string representing the calculated date or period.
     */
    DateCalc.calculate = function (input1, input2) {
        var localDate1;
        var localDate2;
        var validationScore = 0;
        input1 = input1.trim();
        input2 = input2.trim();
        localDate1 = LocalDate.parse(input1);
        localDate2 = LocalDate.parse(input2);
        validationScore += localDate1 ? 1 : 0;
        validationScore += localDate2 ? 2 : 0;
        switch (validationScore) {
            case 3:
                var days = Math.abs(localDate1.daysUntil(localDate2));
                var daysString = days + " " + Utils.pluralize(days, "day");
                var periodString = localDate1.periodUntil(localDate2).toString();
                return daysString === periodString ?
                    daysString : daysString + " (" + periodString + ")";
            case 2:
            case 1:
                var localDate = void 0;
                var period = void 0;
                if (validationScore === 2) {
                    localDate = localDate2;
                    period = Period.parse(input1);
                    if (!period) {
                        throw new Error("The first input is invalid.");
                    }
                }
                else {
                    localDate = localDate1;
                    period = Period.parse(input2);
                    if (!period) {
                        throw new Error("The second input is invalid.");
                    }
                }
                return localDate.addPeriod(period).toString();
            case 0:
                throw new Error("At least one input must be a valid date.");
        }
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
    }
    /**
     * Construct a LocalDate object by parsing a date string.
     * @param dateString The given date string.
     * @return The constructed LocalDate object;
     *   null if the date string is invalid.
     */
    LocalDate.parse = function (dateString) {
        var year = 0;
        var month = 0;
        var day = 0;
        if (dateString.toLowerCase() === "today") {
            var date = new Date();
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        }
        else {
            var datePieces = void 0;
            if (dateString.indexOf("-") > 0) {
                // Parse date strings like 2017-01-20.
                datePieces = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(dateString);
                if (datePieces) {
                    year = +datePieces[1];
                    month = +datePieces[2];
                    day = +datePieces[3];
                }
            }
            else if (dateString.indexOf("/") > 0) {
                // Parse date strings like 01/20/2017.
                datePieces = /^(\d{1,2})\/(\d{1,2})\/(\d{1,4})$/.exec(dateString);
                if (datePieces) {
                    year = +datePieces[3];
                    month = +datePieces[1];
                    day = +datePieces[2];
                }
            }
            else if (dateString.indexOf(" ") > 0) {
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
        }
        else {
            return null;
        }
    };
    /**
     * Get the number of days until a given date.
     * @param endDate The given date.
     * @return The number of days until that given date.
     */
    LocalDate.prototype.daysUntil = function (endDate) {
        return endDate.sinceDayZero() - this.sinceDayZero();
    };
    /**
     * Get a Period object representing the period until a given date.
     * @param endDate The given date.
     * @return The Period object until the given date.
     */
    LocalDate.prototype.periodUntil = function (endDate) {
        var _a;
        var startDate = this;
        if (startDate.daysUntil(endDate) < 0) {
            _a = [endDate, startDate], startDate = _a[0], endDate = _a[1];
        }
        var years = endDate.year - startDate.year;
        var months = endDate.month - startDate.month;
        var days = endDate.day - startDate.day;
        // Days in previous month, so possible values are 0 to 11.
        var daysInPrevMonth = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
        if (LocalDate.isLeapYear(endDate.year)) {
            daysInPrevMonth[2]++;
        }
        // Normalize the period.
        if (days < 0) {
            months--;
            days += daysInPrevMonth[endDate.month - 1];
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return new Period(years, months, days);
    };
    /**
     * Get a new LocalDate object after adding a Period to a LocalDate.
     * @param period The given Period object.
     * @return A new LocalDate object.
     */
    LocalDate.prototype.addPeriod = function (period) {
        var year = this.year + period.years;
        var month = this.month + period.months;
        var day = this.day + period.days;
        var daysInMonth;
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
     * Count the number of days since the hypothetical Day 0.
     * Day 0 is the day before 0001-1-1.
     * @return The number of days since Day 0.
     *   For example, 0001-1-1 will have the return value of 1.
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
     * Check if the given year is a leap year.
     * @param year The given year.
     * @return True if the year is a leap year; false otherwise.
     */
    LocalDate.isLeapYear = function (year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
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
     * Get the number of days in the given year and month.
     * Mote that both the year and the month must be valid and normalized.
     * @param year The given year.
     * @param month The given month.
     * @return The number of days in that month of that year.
     */
    LocalDate.getDaysInMonth = function (year, month) {
        var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (LocalDate.isLeapYear(year)) {
            daysInMonth[2] = 29;
        }
        return daysInMonth[month];
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
    return LocalDate;
}());
/**
 * A class to represent an amount of date-based time.
 */
var Period = /** @class */ (function () {
    function Period(years, months, days) {
        this.years = years;
        this.months = months;
        this.days = days;
    }
    /**
     * Construct a Period object by parsing a period string.
     * @param periodString The given period string.
     * @return The constructed Period object;
     *   null if the period string is invalid.
     */
    Period.parse = function (periodString) {
        var years;
        var months;
        var days;
        var periodPieces;
        periodPieces = new RegExp("^" +
            "((\\d*)\\s*(y|year|years))*\\s*" +
            "((\\d*)\\s*(m|month|months))*\\s*" +
            "((\\d*)\\s*(d|day|days))*$").exec(periodString);
        if (periodPieces) {
            years = +periodPieces[2] | 0;
            months = +periodPieces[5] | 0;
            days = +periodPieces[8] | 0;
            return new Period(years, months, days);
        }
        else {
            return null;
        }
    };
    /**
     * Get the string representation of the Period object.
     * Note that the returned string will have the following format:
     *   y years m months d days
     * where the units are pluralized automatically.
     * @return The string representation.
     */
    Period.prototype.toString = function () {
        var components = [
            { value: this.years, unit: "year" },
            { value: this.months, unit: "month" },
            { value: this.days, unit: "day" }
        ];
        return components.filter(function (c) { return c.value > 0; })
            .map(function (c) { return c.value + " " + Utils.pluralize(c.value, c.unit); })
            .join(" ") || "0 days";
    };
    return Period;
}());
/**
 * A class for shared miscellaneous utilities.
 */
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * Get the singular or the plural form of a unit based on the count.
     * Note that this is naively adding "s" at the end of the unit when necessary.
     * @param count The count.
     * @param singular The singular form of the unit.
     * @return The proper form of the unit.
     */
    Utils.pluralize = function (count, singular) {
        return count === 1 ? singular : singular + "s";
    };
    return Utils;
}());
