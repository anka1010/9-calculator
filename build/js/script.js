"use strict";

//////////////////////////
// CLASS
class Calculator {
  #expression;

  constructor() {
    this.reset();
  }

  reset() {
    this.#expression = ["0"];
  }

  #addNumber(value) {
    const currentOperand = this.#expression?.at(-1);

    // Max amount of symbols in an operand is 15
    if (currentOperand.length === 15) return;

    // If last element is not a number, it is an arithmetic operation => add new operand
    if (isNaN(currentOperand)) {
      this.#expression = [...this.#expression, value === "." ? "0." : value];
      return;
    }

    // Value can be: <number> or <.>

    // If current operand already has '.'
    if (value === "." && currentOperand.includes(".")) return;

    if (value === "." && currentOperand === "") {
      this.#expression = [...this.#expression.slice(0, -1), "0."];
      return;
    }

    // Only one leading '0'
    if (currentOperand === "0" && value === "0") return;

    // Add numer to current operand
    this.#expression = [
      ...this.#expression.slice(0, -1),
      currentOperand === "0" && value !== "." ? value : currentOperand + value,
    ];
  }

  #addOperation(value) {
    if (isNaN(this.#expression.at(-1))) return;

    this.#expression = [...this.#expression, value];
  }

  //
  addToExpression(value = "", type = "number") {
    if (type === "number") this.#addNumber(value);

    if (type === "operation") this.#addOperation(value);
  }

  deleteFromExpression() {
    let newOperations = this.#expression.join().slice(0, -1);
    newOperations =
      newOperations.at(-1) === "," ? newOperations.slice(0, -1) : newOperations;

    this.#expression =
      newOperations.length === 0 ? ["0"] : newOperations.split(",");
  }

  calculate() {
    // 1. Delete first and last operation, if any (+, -, *, /)
    let newRes = this.#expression.join("").replace(/[^-\d/*+.]/g, "");
    console.log(newRes);
    if (isNaN(newRes.at(-1))) {
      newRes.slice(0, -1);
      console.log(newRes);
    }

    this.#expression = [eval(newRes)];
  }

  getOutput() {
    return this.#expression
      .reduce((acc, op) => acc + " " + op + " ", "")
      .trim();
  }
}

const calc = new Calculator();

//////////////////////////
// DOM Elements
const output = document.querySelector("#output");
const numberBtns = document.querySelectorAll("[data-number]");
const dotBtn = document.querySelector("[data-dot]");
const operationBtns = document.querySelectorAll("[data-operation]");
const deleteBtn = document.querySelector("[data-delete]");
const resetBtn = document.querySelector("[data-reset]");
const equalBtn = document.querySelector("[data-equal]");

//
function updateOutput() {
  output.textContent = calc.getOutput();
}
updateOutput();

// Buttons with numbers click
numberBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (isNaN(Number(e.target.dataset.number))) return; // FIXME - parseFloat instead of Number()

    calc.addToExpression(e.target.dataset.number, "number");
    updateOutput();
  });
});

dotBtn.addEventListener("click", () => {
  calc.addToExpression(".", "number");
  updateOutput();
});

// Buttons with operations
operationBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    calc.addToExpression(btn.dataset.operation, "operation");
    updateOutput();
  })
);

equalBtn.addEventListener("click", () => {
  calc.calculate();
  updateOutput();
});

deleteBtn.addEventListener("click", (e) => {
  calc.deleteFromExpression();
  updateOutput();
});

resetBtn.addEventListener("click", () => {
  calc.reset();
  updateOutput();
});

// Keyboard events
document.addEventListener("keydown", (e) => {
  const numbersArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const operationsArr = ["+", "-", "*", "/"];

  // Numbers
  if (numbersArr.includes(e.key)) calc.addToExpression(e.key, "number");

  // .
  if (e.key === ".") calc.addToExpression(".", "number");

  // +, -, *, /
  if (operationsArr.includes(e.key)) calc.addToExpression(e.key, "operation");

  // Delete
  if (e.key === "Delete" || e.key === "Backspace") calc.deleteFromExpression();

  // Reset
  if (e.key === "Escape") calc.reset();

  // Calculate
  if (e.key === "Enter" || e.key === "=") calc.calculate();

  updateOutput();
});
