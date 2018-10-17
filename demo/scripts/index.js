(function init() {
    var input1 = document.getElementById("input1");
    var input2 = document.getElementById("input2");
    var searchParams = new URLSearchParams(window.location.search);
    if (input1.value === "") {
        input1.value = searchParams.get("p1");
    }
    if (input2.value === "") {
        input2.value = searchParams.get("p2");
    }
    input1.addEventListener("input", calc);
    input2.addEventListener("input", calc);
    calc();
})();

function calc() {
    var str1 = document.getElementById("input1").value;
    var str2 = document.getElementById("input2").value;
    if (str1 === "" || str2 === "") {
        document.getElementById("prompt").innerHTML = "Info";
        document.getElementById("output").value = "Please enter two inputs.";
    } else {
        try {
            var resultString = DateCalc.calculate(str1, str2);
            document.getElementById("prompt").innerHTML = "Result";
            document.getElementById("output").value = resultString;
        } catch (e) {
            document.getElementById("prompt").innerHTML = "Info";
            document.getElementById("output").value = e.message;
        }
    }
}
