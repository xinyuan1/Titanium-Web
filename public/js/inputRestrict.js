
function restrictValue(input) {
    if (input.value == '') {
        input.value = 0;
    }
    else if (input.value < 1) {
        input.value = 0;
    }
    else if (input.value > 100) {
        input.value = 100;
    }
}