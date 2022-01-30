function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function operate(operator, num1, num2) {
  let result = 0;

  if (operator === '+') result = add(num1, num2);
  else if (operator === '-') result = subtract(num1, num2);
  else if (operator === '*') result = multiply(num1, num2);
  else if (operator === '/') result = divide(num1, num2);
  else return;

  const maxDecimalLength = 4;
  const hasDecimal = `${result}`.includes('.');
  const decimal = `${result}`.split('.')[1];

  if (result === Infinity || isNaN(result)) {
    return 'ERROR';
  }

  if (!hasDecimal || decimal.length < maxDecimalLength) {
    return result;
  }

  return result.toFixed(maxDecimalLength);
}

let prevNum = null;
let currentNum = null;
let total = null;
let prevOperator = null;
let currentOperator = null;
let inputMode = false;

const screen = document.querySelector('.result');
const equationEl = document.querySelector('.equation');
const numBtns = document.querySelectorAll('.num');
const operatorBtns = document.querySelectorAll('.operator');
const decimalBtn = document.querySelector('.decimal');
const equalsButton = document.querySelector('.equals');
const delBtn = document.querySelector('.delete');
const clearBtn = document.querySelector('.clear');
const posNegBtn = document.querySelector('.plusminus');

const getDigits = () => screen.textContent;
const getFirstDigit = () => getDigits()[0];
const isZeroStart = () => +getFirstDigit() === 0;
const hasDecimal = () => getDigits().includes('.');
const removeFirstDigit = () => getDigits().slice(1);

function resetState() {
  prevNum = null;
  currentNum = null;
  total = null;
  prevOperator = null;
  currentOperator = null;
}

function updateScreen(text = 0) {
  screen.textContent = text;
}

function clearEquation() {
  equationEl.innerHTML = '';
}

function clearDisplay() {
  resetState();
  updateScreen();
  clearEquation();
}

function updateEquationEl(isEquals) {
  clearEquation();

  const numSpan = document.createElement('span');
  const operatorSpan = document.createElement('span');
  operatorSpan.classList.add('symbol');

  let symbol = '';
  if (prevOperator === '+') symbol = String.fromCharCode(43);
  if (prevOperator === '-') symbol = String.fromCharCode(8722);
  if (prevOperator === '*') symbol = String.fromCharCode(215);
  if (prevOperator === '/') symbol = String.fromCharCode(247);

  numSpan.textContent = prevNum;
  operatorSpan.textContent = symbol;

  equationEl.appendChild(numSpan);
  equationEl.appendChild(operatorSpan);

  if (isEquals) {
    const nextSpan = document.createElement('span');
    const equalsSpan = document.createElement('span');

    nextSpan.textContent = currentNum;
    equationEl.appendChild(nextSpan);
    equalsSpan.classList.add('symbol');
    equalsSpan.textContent = '=';
    equationEl.appendChild(equalsSpan);
  }
}

function displayDigits() {
  if (inputMode) {
    updateScreen();
    inputMode = false;
  }

  const digit = this.value;
  updateScreen(getDigits() + digit);

  if (isZeroStart() && getDigits()[1] !== '.') {
    updateScreen(removeFirstDigit());
  }
}

function displayDecimal() {
  inputMode = false;
  if (hasDecimal()) return;
  updateScreen(getDigits() + '.');
}

function deleteLastDigit() {
  const resultDelLast = getDigits().slice(0, -1);
  updateScreen(resultDelLast);

  const [first, ...rest] = resultDelLast;

  if (
    !getDigits() ||
    (first === '-' && rest.length <= 0) ||
    resultDelLast === '-0'
  )
    updateScreen();
}

function changeDigitPosNeg() {
  if (+getDigits() === 0) return;

  if (getFirstDigit() === '-') {
    updateScreen(removeFirstDigit());
  } else {
    updateScreen(`-${getDigits()}`);
  }
}

function handleEquation() {
  if (isNaN(getDigits())) {
    clearDisplay();
    return;
  }

  if (prevNum === null) {
    prevNum = +getDigits();
    total = prevNum;
  } else {
    total = operate(prevOperator, prevNum, +getDigits());
    prevNum = total;
  }

  prevOperator = this.value;
  updateEquationEl();
  updateScreen(total);
  inputMode = true;
}

function equate() {
  if (isNaN(getDigits())) {
    clearDisplay();
    return;
  }

  if (prevNum === null) return;

  currentNum = +getDigits();
  total = operate(prevOperator, prevNum, currentNum);

  updateEquationEl(true);
  updateScreen(total);

  prevNum = null;
  inputMode = true;
}

numBtns.forEach((btn) => btn.addEventListener('click', displayDigits));
operatorBtns.forEach((btn) => btn.addEventListener('click', handleEquation));
equalsButton.addEventListener('click', equate);
decimalBtn.addEventListener('click', displayDecimal);
delBtn.addEventListener('click', deleteLastDigit);
clearBtn.addEventListener('click', clearDisplay);
posNegBtn.addEventListener('click', changeDigitPosNeg);
