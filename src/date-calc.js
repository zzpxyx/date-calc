/**
 * A class for calculating dates.
 */
var DateCalc = (function () {
    function DateCalc() {
    }
    /**
     * Calculate the number of days between the start and the end dates.
     * @param startDateString The string for the start date.
     * @param endDateString The string for the end date.
     * @return The number of days in between.
     * For example, given 2017-01-01 and 2017-01-02, the return value will be 1.
     */
    DateCalc.daysBetween = function (startDateString, endDateString) {
        var startDate = LocalDate.parse(startDateString);
        var endDate = LocalDate.parse(endDateString);
        var period = new Period(startDate, endDate);
        return period.getDays();
    };
    /**
     * Calculate the period between the start and the end dates.
     * @param startDateString The string for the start date.
     * @param endDateString The string for the end date.
     * @return The string describing the period.
     * For example, given 2017-01-01 and 2018-03-04, the return value will be
     * 1 year 2 months 3days.
     */
    DateCalc.periodBetween = function (startDateString, endDateString) {
        var startDate = LocalDate.parse(startDateString);
        var endDate = LocalDate.parse(endDateString);
        var period = new Period(startDate, endDate);
        return period.toString();
    };
    return DateCalc;
}());
/**
 * A class to represent a date without the time zone.
 */
var LocalDate = (function () {
    function LocalDate(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
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
        var date = new Date(dateString);
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth() + 1;
        var day = date.getUTCDate();
        return new LocalDate(year, month, day);
    };
    return LocalDate;
}());
/**
 * A class to represent an amount of date-based time.
 */
var Period = (function () {
    function Period(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
    /**
     * Calculate the number of days between the start and the end dates.
     * @return The number of days in between.
     */
    Period.prototype.getDays = function () {
        return this.endDate.sinceDayZero() - this.startDate.sinceDayZero();
    };
    /**
     * Get the string representation of the Period object.
     * @return The string representation.
     */
    Period.prototype.toString = function () {
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
        // Format the return string.
        var ret = "";
        var values = [years, months, days];
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
