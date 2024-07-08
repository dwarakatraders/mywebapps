var isOperator = false;
var isAns = false;
function display(val) {
    let old = document.getElementById("idFirst").value;
    let oprat = document.getElementById("idOperator").value;
    let input = document.getElementById("idAnswerBox").value;
    if (!isNaN(val)) {//alert(input+"-"+old);

        if (isOperator == true || (input == 0 && (input + "").indexOf('.') == -1)) {
            document.getElementById("idAnswerBox").value = val;
        } else if (isAns == true) {
            document.getElementById("idAnswerBox").value = val;
        } else {
            document.getElementById("idAnswerBox").value += val;
        }
        isAns = false;
        isOperator = false;

    } else if (val == '.') {
        isAns = false; isOperator == false;
        if (input.includes('.')) {
          
            document.getElementById("idAnswerBox").value = input;
        }
        else {
            document.getElementById("idAnswerBox").value += val;
        }

    } else if (val == '+' || val == '-' || val == '*' || val == '/') {
        isAns = false;
        if (isOperator != true) {

            if (oprat != 0) {
                // alert(old+oprat+input);
                isAns = true;
                let ans = findAnswer(old, input, oprat);
                document.getElementById("idAnswerBox").value = (ans=='Infinity'?'Not A Number':ans) ;
                document.getElementById("idFirst").value = (ans=='Infinity'?0:ans);
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
        document.getElementById("idAnswerBox").value *= -1;
        isOperator = false;

    }
    else if (val == '=') {
        isOperator = false; isAns = true;
        if (oprat == 0) {
            document.getElementById("idFirst").value = 0;
            document.getElementById("idOperator").value = 0;
            document.getElementById("idAnswerBox").value = input;
        }
        else {
            let ans = findAnswer(old, input, oprat);
            document.getElementById("idFirst").value = 0;
            document.getElementById("idOperator").value = 0;
            document.getElementById("idAnswerBox").value = (ans=='Infinity'?'Not A Number':ans) ;

        }
    }
}
function clearInput() {
    document.getElementById("idFirst").value = 0;
    document.getElementById("idOperator").value = 0;
    document.getElementById("idAnswerBox").value = 0;
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
        default:
            return 0;
            break;
    }
}



