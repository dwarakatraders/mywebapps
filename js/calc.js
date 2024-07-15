var isOperator = false;
var isAns = false;
function display(val) {
    let old = document.getElementById("idFirst").value;
    let oprat = document.getElementById("idOperator").value;
    let input = document.getElementById("idAnswerBox").textContent;
    if (!isNaN(val)) {//alert(input+"-"+old);

        if (isOperator == true || (input == 0 && (input + "").indexOf('.') == -1)) {
            document.getElementById("idAnswerBox").textContent = val;
        } else if (isAns == true) {
            document.getElementById("idAnswerBox").textContent = val;
        } else {
            document.getElementById("idAnswerBox").textContent += val;
        }
        isAns = false;
        isOperator = false;

    } else if (val == '.') {
        isAns = false; isOperator == false;
        if (input.includes('.')) {

            document.getElementById("idAnswerBox").textContent = input;
        }
        else {
            document.getElementById("idAnswerBox").textContent += val;
        }

    } else if (val == '+' || val == '-' || val == '*' || val == '/' || val=='%') {
        isAns = false;
        if (isOperator != true) {

            if (oprat != 0) {
                // alert(old+oprat+input);
                isAns = true;
                let ans = findAnswer(old, input, oprat);
                document.getElementById("idAnswerBox").textContent = (ans == 'Infinity' ? 'Not A Number' : ans);
                document.getElementById("idFirst").value = (ans == 'Infinity' ? 0 : ans);
                document.getElementById("idOperator").value = val;
            }
            else {
                document.getElementById("idFirst").value = input;
                document.getElementById("idOperator").value = val;
            }
        }
        else {
            document.getElementById("idOperator").value = val;
        }
        isOperator = true;
    }
    if (val == '+/-') {
        isAns = false;
        document.getElementById("idAnswerBox").textContent *= -1;
        isOperator = false;

    }
    else if (val == '=') {
        isOperator = false; isAns = true;
        if (oprat == 0) {
            document.getElementById("idFirst").value = 0;
            document.getElementById("idOperator").value = 0;
            document.getElementById("idAnswerBox").textContent = input;
        }
        else {
            let ans = findAnswer(old, input, oprat);
            document.getElementById("idFirst").value = 0;
            document.getElementById("idOperator").value = 0;
            document.getElementById("idAnswerBox").textContent = (ans == 'Infinity' ? 'Not A Number' : ans);

        }
    }
    adjustFontSize();
}
function clearInput() {
    document.getElementById("idFirst").value = 0;
    document.getElementById("idOperator").value = 0;
    document.getElementById("idAnswerBox").textContent = 0;
}
function findAnswer(x, y, opr) {
    // alert(x + opr + y);
    x = !isNaN(parseFloat(x)) ? parseFloat(x) : 0;
    y = !isNaN(parseFloat(y)) ? parseFloat(y) : 0;
    //alert(x + opr + y);
    switch (opr) {
        case '+':
            return x + y;
            break;
        case '-':
            return x - y;
            break;
        case '*':
            return x * y;
            break;
        case '/':
            return x / y;
            break;
        case '%':
            return x % y;
            break;
        default:
            return 0;
            break;
    }
}
// Example JavaScript code to add 'long' class based on content length
const displayElement = document.getElementById('idAnswerBox');
const maxLengthBeforeReducedFontSize = 10;

function adjustFontSize() {
    if (displayElement.textContent.length > maxLengthBeforeReducedFontSize) {
        displayElement.classList.add('long');
    } else {
        displayElement.classList.remove('long');
    }
}





