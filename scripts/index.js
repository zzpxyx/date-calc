(function init() {
    document.getElementById("input1").addEventListener("input", calc);
    document.getElementById("input2").addEventListener("input", calc);
})();

function calc() {
    var str1 = document.getElementById("input1").value;
    var str2 = document.getElementById("input2").value;
    document.getElementById("output").value = parseDate(str1) + " " + parseDate(str2);
}

function parseDate(str) {
    var date = new Date(str);
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    return year + "-" + month + "-" + day;
}
