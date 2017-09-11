(function init() {
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var searchParams = new URLSearchParams(window.location.search);
    if (input1.value === "") {
        input1.value = searchParams.get("startDate");
    }
    if (input2.value === "") {
        input2.value = searchParams.get("endDate");
    }
    input1.addEventListener("input", calc);
    input2.addEventListener("input", calc);
    calc();
})();

function calc() {
    var str1 = document.getElementById("input1").value;
    var str2 = document.getElementById("input2").value;
    var period = DateCalc.between(str1, str2);
    var days = period.getDays();
    if (isNaN(days)) {
        document.getElementById("prompt").innerHTML = "Info";
        document.getElementById("output").value = "Please enter valid inputs.";
    } else {
        var daysString;
        if (days === 1) {
            daysString = days + " day";
        } else {
            daysString = days + " days";
        }
        var periodString = period.toString();
        var resultString;
        if (periodString === "" || daysString === periodString) {
            resultString = daysString;
        } else {
            resultString = daysString + " (" + periodString + ")";
        }
        document.getElementById("prompt").innerHTML =
            "Between " + period.startDate.toString() +
            " and " + period.endDate.toString();
        document.getElementById("output").value = resultString;
    }
}
