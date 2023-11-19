"use strict";

//////////////////////////
// CLASS
class Calculator {
  #operations = ["0"];

  constructor() {
    this.reset();
  }

  reset() {
    this.#operations = ["0"]; // sequence of operands and operations to calculate
  }

  // Helper methods
  #addOperand(value) {
    const currentOperand = this.#operations?.at(-1);
    console.log("current", currentOperand);

    // If last operand is not a number, it is an arithmetic operation => add new operand
    if (isNaN(currentOperand)) {
      this.#operations = [...this.#operations, value === "." ? "0." : value];
      return;
    }

    // If current operand already has '.'
    if (value === "." && currentOperand.includes(".")) return;

    // Only one leading '0'
    if (currentOperand.at(0) === "0" && value === "0") return;

    // Add numer to current operand
    this.#operations = [
      ...this.#operations.slice(0, -1),
      currentOperand === "0" && value !== "." ? value : currentOperand + value,
    ];
  }

  #addOperation(value) {
    if (isNaN(this.#operations.at(-1))) return;

    this.#operations = [...this.#operations, value];
  }

  // Operations
  addToOperations(value = "", type = "number") {
    if (type === "number") this.#addOperand(value);

    if (type === "operation") this.#addOperation(value);
  }

  getOperations() {
    return this.#operations
      .reduce((acc, op) => acc + " " + op + " ", "")
      .trim();
  }

  deleteFromOperations() {
    let newOperations = this.#operations.join().slice(0, -1);
    newOperations =
      newOperations.at(-1) === "," ? newOperations.slice(0, -1) : newOperations;

    this.#operations =
      newOperations.length === 0 ? ["0"] : newOperations.split(",");
  }

  calculate() {
    let newRes = this.#operations.join("").replace(/[^-\d/*+.]/g, "");
    console.log(newRes);
    if (isNaN(newRes.at(-1))) {
      newRes.slice(0, -1);
      console.log(newRes);
    }

    this.#operations = [eval(newRes)];
  }
}

const calc = new Calculator();

//////////////////////////
// DOM Elements
const output = document.querySelector("#output");
const numbersBtn = document.querySelectorAll("[data-number]");
const dotBtn = document.querySelector("[data-dot]");
const operationsBtn = document.querySelectorAll("[data-operation]");
const deleteBtn = document.querySelector("[data-delete]");
const resetBtn = document.querySelector("[data-reset]");
const equalBtn = document.querySelector("[data-equal]");

//
function updateOutput() {
  output.textContent = calc.getOperations();
}
updateOutput();

// Buttons with numbers click
numbersBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (isNaN(Number(e.target.dataset.number))) return; // FIXME - parseFloat instead of Number()

    calc.addToOperations(e.target.dataset.number, "number");
    updateOutput();
  });
});

dotBtn.addEventListener("click", () => {
  calc.addToOperations(".", "number");
  updateOutput();
});

// Buttons with operations
operationsBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    calc.addToOperations(btn.dataset.operation, "operation");
    updateOutput();
  })
);

equalBtn.addEventListener("click", () => {
  calc.calculate();
  updateOutput();
});

deleteBtn.addEventListener("click", (e) => {
  calc.deleteFromOperations();
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

  if (numbersArr.includes(e.key)) calc.addToOperations(e.key, "number");

  if (e.key === ".") calc.addToOperations(".", "number");

  if (operationsArr.includes(e.key)) calc.addToOperations(e.key, "operation");

  if (e.key === "Delete" || e.key === "Backspace") calc.deleteFromOperations();

  if (e.key === "Escape") calc.reset();

  if (e.key === "Enter" || e.key === "=") calc.calculate();

  updateOutput();
});
