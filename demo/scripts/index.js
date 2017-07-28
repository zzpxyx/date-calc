(function init() {
    document.getElementById("input1").addEventListener("input", calc);
    document.getElementById("input2").addEventListener("input", calc);
    calc();
})();

function calc() {
    var str1 = document.getElementById("input1").value;
    var str2 = document.getElementById("input2").value;
    var days = DateCalc.daysBetween(str1, str2);
    if (isNaN(days)) {
        document.getElementById("output").value = "Please enter valid inputs.";
    } else {
        var daysString;
        if (days === 1) {
            daysString = days + " day";
        } else {
            daysString = days + " days";
        }
        var periodString = DateCalc.periodBetween(str1, str2);
        document.getElementById("output").value =
            daysString + " (" + periodString + ")";
    }
}

function parseDate(str) {
    var localDate = LocalDate.parse(str);
    return localDate.year + "-" + localDate.month + "-" + localDate.day;
}
